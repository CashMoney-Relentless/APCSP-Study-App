// localStorage wrapper for AP CSP Mastery Lab.
// All reads are SSR/sandbox-safe. The shape is versioned so future
// migrations can be added cleanly.

const KEY = 'apcsp_mastery_lab_v1';

const RECENT_HISTORY_LIMIT = 20;       // last N answers per topic (recentResults)
const RECENT_QUESTION_LIMIT = 36;      // recently shown question ids (anti-repeat)
const SR_BOX_INITIAL = 0;              // spaced-repetition Leitner box

export const DEFAULT_TOPIC_STAT = {
  attempts: 0,
  correct: 0,
  incorrect: 0,
  accuracy: 0,                         // 0-100
  recentIncorrectCount: 0,
  lastPracticed: null,                 // ISO string
  recentResults: [],                   // 0/1 list (most recent at end)
  // difficulty performance
  byDifficulty: {
    easy:   { attempts: 0, correct: 0 },
    medium: { attempts: 0, correct: 0 },
    hard:   { attempts: 0, correct: 0 },
  },
};

const DEFAULT_STATE = {
  bestScore: 0,
  totalPoints: 0,
  totalQuizzes: 0,
  totalQuestions: 0,
  totalCorrect: 0,
  dailyStreak: 0,
  lastDailyDate: null,
  lastDailyResult: null,
  lastExamResult: null,
  knownFlashcards: [],
  topicStats: {},
  recentQuestionIds: [],
  // spaced repetition: per-question { box, dueAt (ISO), lastSeenAt }
  spacedRepetition: {},
  // mini-game records
  gameHighScores: { binaryRush: 0, algorithmOrder: 0, bugHunt: 0, logicGate: 0 },
};

function safeStorage() {
  try {
    return typeof window !== 'undefined' ? window.localStorage : null;
  } catch {
    return null;
  }
}

function deepMerge(target, source) {
  if (!source) return target;
  const out = { ...target };
  for (const k of Object.keys(source)) {
    const a = out[k];
    const b = source[k];
    if (
      a && b && typeof a === 'object' && typeof b === 'object' &&
      !Array.isArray(a) && !Array.isArray(b)
    ) {
      out[k] = deepMerge(a, b);
    } else if (b !== undefined) {
      out[k] = b;
    }
  }
  return out;
}

function migrateTopicStat(raw) {
  if (!raw) return { ...DEFAULT_TOPIC_STAT, byDifficulty: cloneByDiff() };
  const out = deepMerge({ ...DEFAULT_TOPIC_STAT, byDifficulty: cloneByDiff() }, raw);
  if (raw.attempts == null && raw.total != null) {
    const correct = raw.correct || 0;
    const attempts = raw.total || 0;
    out.attempts = attempts;
    out.correct = correct;
    out.incorrect = Math.max(0, attempts - correct);
    out.accuracy = attempts > 0 ? Math.round((correct / attempts) * 100) : 0;
  }
  return out;
}

function cloneByDiff() {
  return {
    easy:   { attempts: 0, correct: 0 },
    medium: { attempts: 0, correct: 0 },
    hard:   { attempts: 0, correct: 0 },
  };
}

function migrate(state) {
  const merged = deepMerge(DEFAULT_STATE, state || {});
  const topics = merged.topicStats || {};
  const out = {};
  for (const k of Object.keys(topics)) out[k] = migrateTopicStat(topics[k]);
  merged.topicStats = out;
  if (!Array.isArray(merged.recentQuestionIds)) merged.recentQuestionIds = [];
  if (typeof merged.spacedRepetition !== 'object' || Array.isArray(merged.spacedRepetition)) {
    merged.spacedRepetition = {};
  }
  return merged;
}

export function loadState() {
  const ls = safeStorage();
  if (!ls) return migrate({});
  try {
    const raw = ls.getItem(KEY);
    if (!raw) return migrate({});
    return migrate(JSON.parse(raw));
  } catch {
    return migrate({});
  }
}

export function saveState(state) {
  const ls = safeStorage();
  if (!ls) return;
  try {
    ls.setItem(KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
}

export function updateState(updater) {
  const cur = loadState();
  const next = typeof updater === 'function' ? updater(cur) : { ...cur, ...updater };
  saveState(next);
  return next;
}

// ------------- Topic stats -------------

function applySingleAnswer(topicStats, topic, isCorrect, difficulty = 'medium') {
  const prev = topicStats[topic] || { ...DEFAULT_TOPIC_STAT, byDifficulty: cloneByDiff() };
  const recent = [...(prev.recentResults || []), isCorrect ? 1 : 0].slice(-RECENT_HISTORY_LIMIT);
  const attempts = prev.attempts + 1;
  const correct = prev.correct + (isCorrect ? 1 : 0);
  const incorrect = prev.incorrect + (isCorrect ? 0 : 1);
  const byD = { ...cloneByDiff(), ...(prev.byDifficulty || {}) };
  const dKey = ['easy', 'medium', 'hard'].includes(difficulty) ? difficulty : 'medium';
  byD[dKey] = {
    attempts: (byD[dKey]?.attempts || 0) + 1,
    correct: (byD[dKey]?.correct || 0) + (isCorrect ? 1 : 0),
  };
  return {
    ...topicStats,
    [topic]: {
      attempts,
      correct,
      incorrect,
      accuracy: attempts > 0 ? Math.round((correct / attempts) * 100) : 0,
      recentIncorrectCount: recent.filter((v) => v === 0).length,
      lastPracticed: new Date().toISOString(),
      recentResults: recent,
      byDifficulty: byD,
    },
  };
}

/**
 * Live single-answer update. Called by Quiz on every selection so the
 * NEXT quiz's adaptive engine sees fresh data immediately.
 */
export function recordTopicAnswer(topic, isCorrect, difficulty) {
  return updateState((s) => ({
    ...s,
    topicStats: applySingleAnswer(s.topicStats, topic, isCorrect, difficulty),
  }));
}

// ------------- Spaced repetition -------------
// Leitner-style boxes: 0..5 with doubling intervals (in hours).
// Missed -> drop to 0 (5 minutes). Correct -> bump up one box.
const SR_HOURS = [0.0833, 6, 24, 72, 168, 336]; // 5min, 6h, 1d, 3d, 1w, 2w

export function scheduleSpacedRepetition(prev, isCorrect) {
  const now = Date.now();
  const prevBox = prev?.box ?? SR_BOX_INITIAL;
  const nextBox = isCorrect
    ? Math.min(SR_HOURS.length - 1, prevBox + 1)
    : 0;
  const dueAt = new Date(now + SR_HOURS[nextBox] * 60 * 60 * 1000).toISOString();
  return { box: nextBox, dueAt, lastSeenAt: new Date(now).toISOString() };
}

export function recordSpacedRepetitionAnswer(questionId, isCorrect) {
  return updateState((s) => ({
    ...s,
    spacedRepetition: {
      ...s.spacedRepetition,
      [questionId]: scheduleSpacedRepetition(s.spacedRepetition?.[questionId], isCorrect),
    },
  }));
}

// ------------- Aggregates -------------

export function recordQuizFinish({
  score, correct, total, history = [], pointsEarned = 0, mode = 'practice',
}) {
  return updateState((s) => ({
    ...s,
    bestScore: Math.max(s.bestScore, score),
    totalPoints: s.totalPoints + pointsEarned,
    totalQuizzes: s.totalQuizzes + 1,
    totalQuestions: s.totalQuestions + total,
    totalCorrect: s.totalCorrect + correct,
    recentQuestionIds: rememberIds(s.recentQuestionIds, history.map((h) => h.question?.id)),
    // mode is forwarded for potential future use (per-mode stats)
    _lastMode: mode,
  }));
}

export function recordDailyFinish({ score, correct, total, dateString, history = [], pointsEarned = 0 }) {
  return updateState((s) => {
    let streak = s.dailyStreak;
    const alreadyToday = s.lastDailyDate === dateString;
    if (alreadyToday) {
      // already counted today
    } else if (isYesterday(s.lastDailyDate, dateString)) {
      streak = (s.dailyStreak || 0) + 1;
    } else {
      streak = 1;
    }
    return {
      ...s,
      bestScore: Math.max(s.bestScore, score),
      totalPoints: s.totalPoints + (alreadyToday ? 0 : pointsEarned),
      totalQuizzes: alreadyToday ? s.totalQuizzes : s.totalQuizzes + 1,
      totalQuestions: alreadyToday ? s.totalQuestions : s.totalQuestions + total,
      totalCorrect: alreadyToday ? s.totalCorrect : s.totalCorrect + correct,
      recentQuestionIds: rememberIds(s.recentQuestionIds, history.map((h) => h.question?.id)),
      dailyStreak: streak,
      lastDailyDate: dateString,
      lastDailyResult: { score, correct, total, date: dateString },
    };
  });
}

export function recordExamFinish({ score, correct, total, sectionBreakdown, durationSec, history = [], pointsEarned = 0 }) {
  return updateState((s) => ({
    ...s,
    bestScore: Math.max(s.bestScore, score),
    totalPoints: s.totalPoints + pointsEarned,
    totalQuizzes: s.totalQuizzes + 1,
    totalQuestions: s.totalQuestions + total,
    totalCorrect: s.totalCorrect + correct,
    recentQuestionIds: rememberIds(s.recentQuestionIds, history.map((h) => h.question?.id)),
    lastExamResult: {
      score, correct, total, sectionBreakdown, durationSec,
      date: new Date().toISOString(),
    },
  }));
}

export function recordGameScore(game, score) {
  return updateState((s) => ({
    ...s,
    totalPoints: s.totalPoints + Math.max(0, score),
    gameHighScores: {
      ...s.gameHighScores,
      [game]: Math.max(s.gameHighScores?.[game] || 0, score),
    },
  }));
}

export function rememberIds(prev, ids) {
  const cleaned = (ids || []).filter(Boolean);
  if (cleaned.length === 0) return prev || [];
  const merged = [...(prev || []), ...cleaned];
  return merged.slice(-RECENT_QUESTION_LIMIT);
}

function isYesterday(prevDateStr, todayStr) {
  if (!prevDateStr) return false;
  const [py, pm, pd] = prevDateStr.split('-').map(Number);
  const [ty, tm, td] = todayStr.split('-').map(Number);
  const prev = new Date(py, pm - 1, pd);
  const today = new Date(ty, tm - 1, td);
  return Math.round((today - prev) / (1000 * 60 * 60 * 24)) === 1;
}

// ------------- Flashcards -------------

export function toggleKnownFlashcard(id) {
  return updateState((s) => {
    const set = new Set(s.knownFlashcards);
    if (set.has(id)) set.delete(id);
    else set.add(id);
    return { ...s, knownFlashcards: Array.from(set) };
  });
}

export function clearKnownFlashcards() {
  return updateState((s) => ({ ...s, knownFlashcards: [] }));
}

// ------------- Reset -------------

export function resetAllStats() {
  return updateState(() => migrate({}));
}

export const RECENT_HISTORY_LIMIT_VALUE = RECENT_HISTORY_LIMIT;
export const RECENT_QUESTION_LIMIT_VALUE = RECENT_QUESTION_LIMIT;
