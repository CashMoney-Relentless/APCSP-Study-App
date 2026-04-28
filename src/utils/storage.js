// Thin wrapper around localStorage for tracking stats, daily streak, and
// known flashcards. All reads are SSR/sandbox-safe.

const KEY = 'apcsp_arena_v1';

const DEFAULT_STATE = {
  bestScore: 0,
  totalQuizzes: 0,
  totalQuestions: 0,
  totalCorrect: 0,
  dailyStreak: 0,
  lastDailyDate: null, // YYYY-MM-DD
  lastDailyResult: null, // { score, correct, total, date }
  knownFlashcards: [], // ids
};

function safeStorage() {
  try {
    return typeof window !== 'undefined' ? window.localStorage : null;
  } catch {
    return null;
  }
}

export function loadState() {
  const ls = safeStorage();
  if (!ls) return { ...DEFAULT_STATE };
  try {
    const raw = ls.getItem(KEY);
    if (!raw) return { ...DEFAULT_STATE };
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_STATE, ...parsed };
  } catch {
    return { ...DEFAULT_STATE };
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

export function recordQuizResult({ score, correct, total }) {
  return updateState((s) => ({
    ...s,
    bestScore: Math.max(s.bestScore, score),
    totalQuizzes: s.totalQuizzes + 1,
    totalQuestions: s.totalQuestions + total,
    totalCorrect: s.totalCorrect + correct,
  }));
}

// Increment streak only when the previous daily was completed yesterday.
// Resets to 1 if there's a gap; stays the same if user already played today.
export function recordDailyCompletion({ score, correct, total, dateString }) {
  return updateState((s) => {
    let streak = s.dailyStreak;
    if (s.lastDailyDate === dateString) {
      // already played today — do not double count
    } else if (isYesterday(s.lastDailyDate, dateString)) {
      streak = (s.dailyStreak || 0) + 1;
    } else {
      streak = 1;
    }
    return {
      ...s,
      bestScore: Math.max(s.bestScore, score),
      totalQuizzes: s.lastDailyDate === dateString ? s.totalQuizzes : s.totalQuizzes + 1,
      totalQuestions: s.lastDailyDate === dateString ? s.totalQuestions : s.totalQuestions + total,
      totalCorrect: s.lastDailyDate === dateString ? s.totalCorrect : s.totalCorrect + correct,
      dailyStreak: streak,
      lastDailyDate: dateString,
      lastDailyResult: { score, correct, total, date: dateString },
    };
  });
}

function isYesterday(prevDateStr, todayStr) {
  if (!prevDateStr) return false;
  const [py, pm, pd] = prevDateStr.split('-').map(Number);
  const [ty, tm, td] = todayStr.split('-').map(Number);
  const prev = new Date(py, pm - 1, pd);
  const today = new Date(ty, tm - 1, td);
  const diffDays = Math.round((today - prev) / (1000 * 60 * 60 * 24));
  return diffDays === 1;
}

export function toggleKnownFlashcard(id) {
  return updateState((s) => {
    const set = new Set(s.knownFlashcards);
    if (set.has(id)) set.delete(id);
    else set.add(id);
    return { ...s, knownFlashcards: Array.from(set) };
  });
}

export function resetAllStats() {
  return updateState(() => ({ ...DEFAULT_STATE }));
}
