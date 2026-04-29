// Adaptive learning engine.
//
// Every answer updates a per-topic record in localStorage; the engine
// reads that record and weights the next quiz toward weak topics. The
// goal is simple: weak topics show up MUCH more often, medium sometimes,
// strong only as occasional review.
//
// Topic classification (by accuracy):
//   weak    : 0 - 50%
//   medium  : 51 - 75%
//   strong  : 76 - 100%
//
// Quiz distribution: 60% weak / 30% medium / 10% strong.
//
// If the user has fewer than MIN_ATTEMPTS_FOR_ADAPTIVE answers, fall
// back to a balanced random quiz that lightly samples every topic.
//
// Difficulty also scales with performance:
//   - weak topics  → bias toward easy/medium questions to rebuild fluency
//   - strong topics→ bias toward hard questions for stretch
//   - medium       → mixed

import { questions as DEFAULT_BANK, allTopics } from '../data/questions.js';
import {
  loadState,
  recordTopicAnswer,
  rememberIds,
  recordSpacedRepetitionAnswer,
  updateState,
} from './storage.js';
import { shuffle, sampleN, randomizeQuestion } from './seededRandom.js';

export const WEAK_MAX = 50;
export const MEDIUM_MAX = 75;
export const TARGET_DISTRIBUTION = { weak: 0.60, medium: 0.30, strong: 0.10 };
export const MIN_ATTEMPTS_FOR_ADAPTIVE = 8;
export const MIN_TOPIC_ATTEMPTS = 3;

// ---------- 1. Read topic performance ----------

export function getTopicStats() {
  const state = loadState();
  const stored = state.topicStats || {};
  const topics = allTopics();
  const out = {};
  for (const t of topics) {
    const s = stored[t];
    out[t] = s
      ? { ...s }
      : {
          attempts: 0, correct: 0, incorrect: 0, accuracy: 0,
          recentIncorrectCount: 0, lastPracticed: null, recentResults: [],
          byDifficulty: {
            easy:   { attempts: 0, correct: 0 },
            medium: { attempts: 0, correct: 0 },
            hard:   { attempts: 0, correct: 0 },
          },
        };
  }
  return out;
}

// ---------- 2. Update topic stats ----------

export function updateTopicStats(topic, isCorrect, difficulty = 'medium') {
  return recordTopicAnswer(topic, isCorrect, difficulty);
}

/**
 * Convenience: handle both topic stats and spaced-repetition scheduling
 * for a single answer. Used by Quiz / Daily / Exam.
 */
export function recordAnswer({ question, isCorrect, mode = 'practice' }) {
  if (!question) return;
  if (mode !== 'daily-replay') {
    updateTopicStats(question.topic, isCorrect, question.difficulty);
  }
  recordSpacedRepetitionAnswer(question.id, isCorrect);
}

// ---------- 3. Classify topics ----------

export function classifyTopics(stats = getTopicStats()) {
  const weak = [], medium = [], strong = [], unseen = [];
  for (const topic of Object.keys(stats)) {
    const s = stats[topic];
    if (!s || s.attempts < MIN_TOPIC_ATTEMPTS) { unseen.push(topic); continue; }
    if (s.accuracy <= WEAK_MAX) weak.push(topic);
    else if (s.accuracy <= MEDIUM_MAX) medium.push(topic);
    else strong.push(topic);
  }
  return { weak, medium, strong, unseen };
}

export function getRecommendedTopics(limit = 4, stats = getTopicStats()) {
  const entries = Object.entries(stats);
  const seen = entries
    .filter(([, s]) => s.attempts >= MIN_TOPIC_ATTEMPTS)
    .sort((a, b) => {
      const accDiff = a[1].accuracy - b[1].accuracy;
      if (accDiff !== 0) return accDiff;
      return b[1].recentIncorrectCount - a[1].recentIncorrectCount;
    })
    .map(([topic, s]) => ({
      topic, accuracy: s.accuracy, attempts: s.attempts,
      reason: s.accuracy <= WEAK_MAX ? 'weak'
            : s.accuracy <= MEDIUM_MAX ? 'review' : 'strong',
    }));
  const unseen = entries
    .filter(([, s]) => s.attempts < MIN_TOPIC_ATTEMPTS)
    .map(([topic]) => ({ topic, accuracy: 0, attempts: 0, reason: 'unseen' }));
  return [...seen, ...unseen].slice(0, limit);
}

/**
 * Friendly recommendations text for the dashboard / results page.
 */
export function buildStudyRecommendations(stats = getTopicStats(), limit = 4) {
  const recs = [];
  const cls = classifyTopics(stats);
  const sorted = Object.entries(stats)
    .filter(([, s]) => s.attempts >= MIN_TOPIC_ATTEMPTS)
    .sort((a, b) => a[1].accuracy - b[1].accuracy);

  if (cls.weak.length > 0) {
    const worst = sorted[0];
    if (worst) recs.push({
      kind: 'focus',
      title: `Focus on ${worst[0]}`,
      detail: `You're at ${worst[1].accuracy}% — weak-topic drills will help fastest.`,
    });
  }
  if (cls.weak.includes('Binary')) recs.push({
    kind: 'game',
    title: 'Try Binary Rush',
    detail: 'A short mini-game tightens your binary fluency.',
  });
  if (cls.strong.length > 0) {
    const best = [...sorted].reverse().find(([, s]) => s.accuracy >= 76);
    if (best) recs.push({
      kind: 'praise',
      title: `Strong in ${best[0]}`,
      detail: `${best[1].accuracy}% accuracy — keep it warm with mixed review.`,
    });
  }
  if (cls.unseen.length > 0) recs.push({
    kind: 'explore',
    title: 'Try a Mixed Review',
    detail: `${cls.unseen.length} topic${cls.unseen.length === 1 ? '' : 's'} you haven't practiced yet.`,
  });
  if (recs.length === 0) recs.push({
    kind: 'start',
    title: 'Start with a 10-question quiz',
    detail: 'A short practice run will calibrate your weak/medium/strong topics.',
  });
  return recs.slice(0, limit);
}

// ---------- 4. Generate adaptive quiz ----------

/**
 * Build a quiz of `quizLength` questions from `questionBank`, weighted
 * toward weak topics.
 *
 * Options:
 *   adaptive (default true)
 *   topic ('all' | <name>)             — single-topic mode disables weighting
 *   topics (string[]) optional         — restrict to a subset (Focus/Weakness modes)
 *   excludeIds (Set<string>) optional  — explicit exclusion
 *   markShown (default true)           — record selected ids so the next
 *                                        quiz tries to avoid them
 *   prioritizeDue (default true)       — pull spaced-rep due ids in first
 */
export function generateAdaptiveQuiz(questionBank = DEFAULT_BANK, quizLength = 10, opts = {}) {
  const {
    adaptive = true,
    topic = 'all',
    topics: topicSubset = null,
    excludeIds,
    markShown = true,
    prioritizeDue = true,
  } = opts;

  const state = loadState();
  const recent = new Set(excludeIds || state.recentQuestionIds || []);
  let activeBank = questionBank;
  if (Array.isArray(topicSubset) && topicSubset.length > 0) {
    activeBank = questionBank.filter((q) => topicSubset.includes(q.topic));
    if (activeBank.length === 0) activeBank = questionBank;
  }

  // ---- Single-topic mode ----
  if (topic && topic !== 'all') {
    const pool = activeBank.filter((q) => q.topic === topic);
    const picked = pickWithRecencyAvoidance(pool, quizLength, recent);
    finalize(picked, markShown);
    return {
      questions: picked,
      plan: planFor({
        adaptive: false, target: zeroTarget(picked.length),
        actual: zeroTarget(picked.length), used: countByTopic(picked),
        cls: classifyTopics(), reason: `single-topic:${topic}`,
      }),
    };
  }

  const stats = getTopicStats();
  const totalAttempts = Object.values(stats).reduce((a, s) => a + s.attempts, 0);
  const cls = classifyTopics(stats);

  // ---- Cold start fallback ----
  if (!adaptive || totalAttempts < MIN_ATTEMPTS_FOR_ADAPTIVE) {
    const picked = pickWithRecencyAvoidance(activeBank, quizLength, recent);
    finalize(picked, markShown);
    return {
      questions: picked,
      plan: planFor({
        adaptive: false, target: zeroTarget(picked.length),
        actual: zeroTarget(picked.length), used: countByTopic(picked),
        cls,
        reason: totalAttempts < MIN_ATTEMPTS_FOR_ADAPTIVE
          ? `insufficient-history:${totalAttempts}/${MIN_ATTEMPTS_FOR_ADAPTIVE}`
          : 'adaptive-disabled',
      }),
    };
  }

  // ---- Real adaptive selection ----
  const target = computeTargetCounts(quizLength, cls);
  const usedIds = new Set();
  const picked = [];

  // Pull spaced-repetition due items first, biased toward weak/medium.
  if (prioritizeDue) {
    const dueIds = pullDueQuestionIds(state.spacedRepetition, activeBank, 3);
    for (const id of dueIds) {
      const q = activeBank.find((x) => x.id === id);
      if (!q || usedIds.has(q.id)) continue;
      const bucket = topicBucket(q.topic, cls);
      if (target[bucket] > 0) {
        picked.push(q);
        usedIds.add(q.id);
        target[bucket]--;
      }
    }
  }

  const counts = { weak: 0, medium: 0, strong: 0, fill: 0 };

  function takeFromBucket(bucket, n, pref) {
    if (n <= 0 || bucket.length === 0) return 0;
    const order = weightedTopicOrder(bucket, stats);
    let added = 0;
    let attempts = 0;
    const maxAttempts = n * 8 + 4;
    while (added < n && attempts < maxAttempts && order.length > 0) {
      attempts++;
      const t = order[(added + attempts) % order.length];
      const q = pickOneFromTopic(t, activeBank, usedIds, recent, pref);
      if (q) {
        picked.push(q);
        usedIds.add(q.id);
        added++;
      } else {
        const idx = order.indexOf(t);
        if (idx >= 0) order.splice(idx, 1);
      }
    }
    return added;
  }

  counts.weak   = takeFromBucket(cls.weak,   target.weak,   ['easy', 'medium', 'hard']);
  counts.medium = takeFromBucket(cls.medium, target.medium, ['medium', 'easy', 'hard']);
  counts.strong = takeFromBucket(cls.strong, target.strong, ['hard', 'medium', 'easy']);

  // Fill remaining slots from weak → medium → unseen → strong
  const fillOrder = [...cls.weak, ...cls.medium, ...cls.unseen, ...cls.strong];
  while (picked.length < quizLength) {
    let progressed = false;
    for (const t of fillOrder) {
      if (picked.length >= quizLength) break;
      const q = pickOneFromTopic(t, activeBank, usedIds, recent);
      if (q) { picked.push(q); usedIds.add(q.id); counts.fill++; progressed = true; }
    }
    if (!progressed) break;
  }
  if (picked.length < quizLength) {
    const remaining = activeBank.filter((q) => !usedIds.has(q.id));
    const extras = sampleN(remaining, quizLength - picked.length);
    for (const q of extras) { picked.push(q); usedIds.add(q.id); counts.fill++; }
  }

  const ordered = shuffle(picked).slice(0, quizLength);
  finalize(ordered, markShown);
  return {
    questions: ordered,
    plan: planFor({
      adaptive: true, target: { ...target, weak: counts.weak, medium: counts.medium, strong: counts.strong, fill: counts.fill },
      actual: counts, used: countByTopic(ordered), cls, reason: 'adaptive',
    }),
  };
}

// ---------- helpers ----------

function planFor({ adaptive, target, actual, used, cls, reason }) {
  return {
    adaptive,
    targetCounts: target,
    actualCounts: actual,
    usedTopics: used,
    classification: cls,
    reason,
  };
}

function zeroTarget(n) {
  return { weak: 0, medium: 0, strong: 0, fill: n };
}

function topicBucket(topic, cls) {
  if (cls.weak.includes(topic)) return 'weak';
  if (cls.medium.includes(topic)) return 'medium';
  if (cls.strong.includes(topic)) return 'strong';
  return 'fill';
}

function computeTargetCounts(quizLength, { weak, medium, strong }) {
  const buckets = [];
  if (weak.length > 0) buckets.push(['weak', TARGET_DISTRIBUTION.weak]);
  if (medium.length > 0) buckets.push(['medium', TARGET_DISTRIBUTION.medium]);
  if (strong.length > 0) buckets.push(['strong', TARGET_DISTRIBUTION.strong]);
  if (buckets.length === 0) return { weak: 0, medium: 0, strong: 0 };
  const sum = buckets.reduce((a, b) => a + b[1], 0);
  const raw = buckets.map(([k, w]) => [k, (w / sum) * quizLength]);
  const floors = raw.map(([k, v]) => [k, Math.floor(v)]);
  let assigned = floors.reduce((a, b) => a + b[1], 0);
  const remainders = raw
    .map(([k, v], i) => [k, v - floors[i][1], i])
    .sort((a, b) => b[1] - a[1]);
  const counts = { weak: 0, medium: 0, strong: 0 };
  for (const [k, v] of floors) counts[k] = v;
  let r = 0;
  while (assigned < quizLength && r < remainders.length) {
    counts[remainders[r][0]] += 1;
    assigned++;
    r++;
  }
  if (weak.length > 0 && counts.weak === 0 && quizLength > 0) {
    if (counts.strong > 0) counts.strong--;
    else if (counts.medium > 0) counts.medium--;
    counts.weak += 1;
  }
  return counts;
}

function weightedTopicOrder(topics, stats) {
  const order = [];
  for (const t of topics) {
    const s = stats[t] || { accuracy: 0, recentIncorrectCount: 0 };
    const accWeight = Math.max(1, Math.ceil((100 - s.accuracy) / 20));
    const missWeight = Math.min(3, s.recentIncorrectCount || 0);
    const w = Math.max(1, accWeight + missWeight);
    for (let i = 0; i < w; i++) order.push(t);
  }
  return shuffle(order);
}

/**
 * Pick a question from `topic`, preferring the given difficulty order
 * (`pref`). `usedIds` and `excludeIds` are sets of ids to avoid.
 */
function pickOneFromTopic(topic, bank, usedIds, excludeIds, pref = null) {
  const allInTopic = bank.filter(
    (q) => q.topic === topic && !usedIds.has(q.id) && !excludeIds.has(q.id)
  );
  if (allInTopic.length === 0) {
    // fall back: ignore recency exclusion
    const fallback = bank.filter((q) => q.topic === topic && !usedIds.has(q.id));
    return fallback.length > 0 ? sampleN(fallback, 1)[0] : null;
  }
  if (pref) {
    for (const d of pref) {
      const tier = allInTopic.filter((q) => q.difficulty === d);
      if (tier.length > 0) return sampleN(tier, 1)[0];
    }
  }
  return sampleN(allInTopic, 1)[0];
}

function pickWithRecencyAvoidance(pool, n, exclude) {
  const fresh = pool.filter((q) => !exclude.has(q.id));
  if (fresh.length >= n) return sampleN(fresh, n);
  const rest = pool.filter((q) => exclude.has(q.id));
  return [...sampleN(fresh, fresh.length), ...sampleN(rest, n - fresh.length)];
}

function countByTopic(qs) {
  const out = {};
  for (const q of qs) out[q.topic] = (out[q.topic] || 0) + 1;
  return out;
}

function pullDueQuestionIds(srMap, bank, max) {
  if (!srMap) return [];
  const now = Date.now();
  const bankIds = new Set(bank.map((q) => q.id));
  const due = Object.entries(srMap)
    .filter(([id, info]) => bankIds.has(id) && info?.dueAt && new Date(info.dueAt).getTime() <= now)
    .sort((a, b) => new Date(a[1].dueAt) - new Date(b[1].dueAt))
    .slice(0, max)
    .map(([id]) => id);
  return due;
}

function finalize(picked, markShown) {
  if (!markShown) return;
  updateState((s) => ({
    ...s,
    recentQuestionIds: rememberIds(s.recentQuestionIds, picked.map((q) => q.id)),
  }));
}

// Convenience: randomize answer order for a list of picked questions.
export function randomizeAll(questions, rng = Math.random) {
  return questions.map((q) => randomizeQuestion(q, rng));
}

// Re-export so consumers only import from one module if they want.
export { recordSpacedRepetitionAnswer };
