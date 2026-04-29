// Thin wrapper around localStorage for tracking stats, daily streak,
// known flashcards, and per-topic mastery used by the adaptive engine.

const KEY = 'apcsp_arena_v1';

const RECENT_HISTORY_LIMIT = 20; // last N answers per topic (drives recentIncorrectCount)
const RECENT_QUESTIONS_LIMIT = 24; // recently-shown question ids, to avoid repeats

const DEFAULT_TOPIC_STAT = {
  attempts: 0,
  correct: 0,
  incorrect: 0,
  accuracy: 0,            // 0-100 (computed)
  recentIncorrectCount: 0,
  lastPracticed: null,    // ISO string
  recentResults: [],      // array of 0/1 (1 = correct)
};

const DEFAULT_STATE = {
  bestScore: 0,
  totalQuizzes: 0,
  totalQuestions: 0,
  totalCorrect: 0,
  dailyStreak: 0,
  lastDailyDate: null,
  lastDailyResult: null,
  knownFlashcards: [],
  topicStats: {},          // { [topic]: TopicStat }
  recentQuestionIds: [],   // for avoiding repeats across quizzes
};

function safeStorage() {
  try {
    return typeof window !== 'undefined' ? window.localStorage : null;
  } catch {
    return null;
  }
}

function migrateTopicStat(raw) {
  if (!raw) return { ...DEFAULT_TOPIC_STAT };
  // The pre-adaptive shape was { correct, total }. Carry that forward.
  if (raw.attempts == null && raw.total != null) {
    const correct = raw.correct || 0;
    const attempts = raw.total || 0;
    return {
      ...DEFAULT_TOPIC_STAT,
      attempts,
      correct,
      incorrect: Math.max(0, attempts - correct),
      accuracy: attempts > 0 ? Math.round((correct / attempts) * 100) : 0,
    };
  }
  return { ...DEFAULT_TOPIC_STAT, ...raw };
}

function migrate(state) {
  const migrated = { ...DEFAULT_STATE, ...state };
  const ts = migrated.topicStats || {};
  const out = {};
  for (const k of Object.keys(ts)) out[k] = migrateTopicStat(ts[k]);
  migrated.topicStats = out;
  if (!Array.isArray(migrated.recentQuestionIds)) migrated.recentQuestionIds = [];
  return migrated;
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
    // ignore quota / privacy errors
  }
}

export function updateState(updater) {
  const current = loadState();
  const next = typeof updater === 'function' ? updater(current) : { ...current, ...updater };
  saveState(next);
  return next;
}

// ---- Aggregate quiz outcomes ----

export function recordQuizResult({ score, correct, total, history = [] }) {
  return updateState((s) => ({
    ...s,
    bestScore: Math.max(s.bestScore, score),
    totalQuizzes: s.totalQuizzes + 1,
    totalQuestions: s.totalQuestions + total,
    totalCorrect: s.totalCorrect + correct,
    topicStats: applyHistoryToTopicStats(s.topicStats, history),
    recentQuestionIds: rememberQuestionIds(s.recentQuestionIds, history),
  }));
}

export function recordDailyCompletion({ score, correct, total, dateString, history = [] }) {
  return updateState((s) => {
    let streak = s.dailyStreak;
    const alreadyToday = s.lastDailyDate === dateString;
    if (alreadyToday) {
      // already played today — do not double count
    } else if (isYesterday(s.lastDailyDate, dateString)) {
      streak = (s.dailyStreak || 0) + 1;
    } else {
      streak = 1;
    }
    return {
      ...s,
      bestScore: Math.max(s.bestScore, score),
      totalQuizzes: alreadyToday ? s.totalQuizzes : s.totalQuizzes + 1,
      totalQuestions: alreadyToday ? s.totalQuestions : s.totalQuestions + total,
      totalCorrect: alreadyToday ? s.totalCorrect : s.totalCorrect + correct,
      topicStats: alreadyToday ? s.topicStats : applyHistoryToTopicStats(s.topicStats, history),
      recentQuestionIds: rememberQuestionIds(s.recentQuestionIds, history),
      dailyStreak: streak,
      lastDailyDate: dateString,
      lastDailyResult: { score, correct, total, date: dateString },
    };
  });
}

function applyHistoryToTopicStats(prev, history) {
  let out = { ...prev };
  for (const h of history) {
    const topic = h.question?.topic;
    if (!topic) continue;
    out = applySingleAnswer(out, topic, !!h.isCorrect);
  }
  return out;
}

// Mutates an immutable topicStats map by recording one answer.
// Exported indirectly via recordTopicAnswer below.
function applySingleAnswer(topicStats, topic, isCorrect) {
  const prev = topicStats[topic] || { ...DEFAULT_TOPIC_STAT };
  const recent = [...(prev.recentResults || []), isCorrect ? 1 : 0].slice(
    -RECENT_HISTORY_LIMIT
  );
  const attempts = prev.attempts + 1;
  const correct = prev.correct + (isCorrect ? 1 : 0);
  const incorrect = prev.incorrect + (isCorrect ? 0 : 1);
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
    },
  };
}

// Live single-answer update — used by Quiz on each answer so the next
// quiz immediately reflects the fresh state.
export function recordTopicAnswer(topic, isCorrect) {
  return updateState((s) => ({
    ...s,
    topicStats: applySingleAnswer(s.topicStats, topic, isCorrect),
  }));
}

function rememberQuestionIds(prev, history) {
  const ids = history.map((h) => h.question?.id).filter(Boolean);
  if (ids.length === 0) return prev;
  // Newest at the END so older ids fall off first.
  const merged = [...(prev || []), ...ids];
  return merged.slice(-RECENT_QUESTIONS_LIMIT);
}

export function rememberShownIds(ids) {
  return updateState((s) => ({
    ...s,
    recentQuestionIds: rememberQuestionIds(s.recentQuestionIds, ids.map((id) => ({ question: { id } }))),
  }));
}

// ---- Daily helpers ----

function isYesterday(prevDateStr, todayStr) {
  if (!prevDateStr) return false;
  const [py, pm, pd] = prevDateStr.split('-').map(Number);
  const [ty, tm, td] = todayStr.split('-').map(Number);
  const prev = new Date(py, pm - 1, pd);
  const today = new Date(ty, tm - 1, td);
  const diffDays = Math.round((today - prev) / (1000 * 60 * 60 * 24));
  return diffDays === 1;
}

// ---- Flashcards ----

export function toggleKnownFlashcard(id) {
  return updateState((s) => {
    const set = new Set(s.knownFlashcards);
    if (set.has(id)) set.delete(id);
    else set.add(id);
    return { ...s, knownFlashcards: Array.from(set) };
  });
}

// ---- Reset ----

export function resetAllStats() {
  return updateState(() => migrate({}));
}

// ---- Constants exported so the adaptive engine can re-use them ----

export const RECENT_HISTORY_LIMIT_VALUE = RECENT_HISTORY_LIMIT;
export const RECENT_QUESTIONS_LIMIT_VALUE = RECENT_QUESTIONS_LIMIT;
