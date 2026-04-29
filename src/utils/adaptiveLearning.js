// Adaptive study engine.
//
// Drives which questions appear in a practice quiz based on per-topic
// performance saved in localStorage. The goal is simple:
//   - weak topics show up MUCH more often
//   - medium topics show up sometimes
//   - strong topics still appear, but rarely (for review)
//
// Topic classification (by accuracy):
//   weak    : 0 - 50%
//   medium  : 51 - 75%
//   strong  : 76 - 100%
//
// Question distribution per quiz:
//   60% weak / 30% medium / 10% strong
//
// If the user has not answered enough questions yet
// (MIN_ATTEMPTS_FOR_ADAPTIVE total across all topics), we fall back to a
// balanced random quiz that lightly samples every topic.

import { questions as DEFAULT_BANK, allTopics } from '../data/questions.js';
import {
  loadState,
  recordTopicAnswer,
  rememberShownIds,
} from './storage.js';
import { shuffle, sampleN, randomizeQuestion } from './random.js';

// ---- Tunables ----
export const WEAK_MAX = 50;        // <=50% accuracy => weak
export const MEDIUM_MAX = 75;      // <=75% (and >50%) => medium
export const TARGET_DISTRIBUTION = { weak: 0.60, medium: 0.30, strong: 0.10 };
export const MIN_ATTEMPTS_FOR_ADAPTIVE = 8;   // before this, use balanced mix
export const MIN_TOPIC_ATTEMPTS = 3;          // min attempts before classifying

// ---- 1. Read topic performance from localStorage ----

/**
 * Returns the full topic stats map keyed by topic name. Topics that the
 * user has never seen are returned with a zeroed entry so callers can
 * iterate every known topic uniformly.
 */
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
          attempts: 0,
          correct: 0,
          incorrect: 0,
          accuracy: 0,
          recentIncorrectCount: 0,
          lastPracticed: null,
          recentResults: [],
        };
  }
  return out;
}

// ---- 2. Update topic stats after an answer ----
// (Thin wrapper around storage so callers only need the adaptive module.)

export function updateTopicStats(topic, isCorrect) {
  return recordTopicAnswer(topic, isCorrect);
}

// ---- 3. Classify topics ----

/**
 * Returns { weak: string[], medium: string[], strong: string[], unseen: string[] }.
 * A topic with fewer than MIN_TOPIC_ATTEMPTS attempts is treated as
 * 'unseen' so it doesn't unfairly skew toward weak/strong on tiny samples.
 */
export function classifyTopics(stats = getTopicStats()) {
  const weak = [];
  const medium = [];
  const strong = [];
  const unseen = [];

  for (const topic of Object.keys(stats)) {
    const s = stats[topic];
    if (!s || s.attempts < MIN_TOPIC_ATTEMPTS) {
      unseen.push(topic);
      continue;
    }
    if (s.accuracy <= WEAK_MAX) weak.push(topic);
    else if (s.accuracy <= MEDIUM_MAX) medium.push(topic);
    else strong.push(topic);
  }

  return { weak, medium, strong, unseen };
}

/**
 * Suggested topics to study next (for the UI). Returns the worst-performing
 * topics first, then unseen ones, capped at `limit`.
 */
export function getRecommendedTopics(limit = 3, stats = getTopicStats()) {
  const entries = Object.entries(stats);
  const seen = entries
    .filter(([, s]) => s.attempts >= MIN_TOPIC_ATTEMPTS)
    .sort((a, b) => {
      // Lowest accuracy first; tiebreak by more recent incorrects.
      const accDiff = a[1].accuracy - b[1].accuracy;
      if (accDiff !== 0) return accDiff;
      return b[1].recentIncorrectCount - a[1].recentIncorrectCount;
    })
    .map(([topic, s]) => ({
      topic,
      accuracy: s.accuracy,
      attempts: s.attempts,
      reason: s.accuracy <= WEAK_MAX ? 'weak' : s.accuracy <= MEDIUM_MAX ? 'review' : 'strong',
    }));

  const unseen = entries
    .filter(([, s]) => s.attempts < MIN_TOPIC_ATTEMPTS)
    .map(([topic]) => ({ topic, accuracy: 0, attempts: 0, reason: 'unseen' }));

  return [...seen, ...unseen].slice(0, limit);
}

// ---- 4. Generate an adaptive quiz ----

/**
 * Build a quiz of `quizLength` questions from `questionBank`, weighted
 * toward weak topics. Returns an array of QUESTION OBJECTS (not yet
 * randomized; the caller usually calls `randomizeQuestion` on each).
 *
 * Options:
 *   adaptive (default true)         — set false for a balanced random quiz
 *   excludeIds (Set<string>)        — ids to avoid (passed in or read from storage)
 *   topic ('all' | <name>)          — if a single topic is requested,
 *                                     adaptive mode is disabled and we
 *                                     just sample inside that topic
 *   markShown (default true)        — record chosen ids as recently-shown
 */
export function generateAdaptiveQuiz(questionBank = DEFAULT_BANK, quizLength = 10, opts = {}) {
  const {
    adaptive = true,
    excludeIds,
    topic = 'all',
    markShown = true,
  } = opts;

  // If user picked a specific topic, adaptive sorting is irrelevant.
  if (topic && topic !== 'all') {
    const pool = questionBank.filter((q) => q.topic === topic);
    const picked = pickWithRecencyAvoidance(pool, quizLength, excludeIds);
    if (markShown) rememberShownIds(picked.map((q) => q.id));
    return {
      questions: picked,
      plan: {
        adaptive: false,
        targetCounts: { weak: 0, medium: 0, strong: 0, fill: picked.length },
        actualCounts: { weak: 0, medium: 0, strong: 0, fill: picked.length },
        usedTopics: countByTopic(picked),
        classification: classifyTopics(),
        reason: `single-topic:${topic}`,
      },
    };
  }

  const stats = getTopicStats();
  const totalAttempts = Object.values(stats).reduce((sum, s) => sum + s.attempts, 0);
  const classification = classifyTopics(stats);

  // Not enough data yet => balanced random mix.
  if (!adaptive || totalAttempts < MIN_ATTEMPTS_FOR_ADAPTIVE) {
    const picked = pickWithRecencyAvoidance(questionBank, quizLength, excludeIds);
    if (markShown) rememberShownIds(picked.map((q) => q.id));
    return {
      questions: picked,
      plan: {
        adaptive: false,
        targetCounts: { weak: 0, medium: 0, strong: 0, fill: picked.length },
        actualCounts: { weak: 0, medium: 0, strong: 0, fill: picked.length },
        usedTopics: countByTopic(picked),
        classification,
        reason: totalAttempts < MIN_ATTEMPTS_FOR_ADAPTIVE
          ? `insufficient-history:${totalAttempts}/${MIN_ATTEMPTS_FOR_ADAPTIVE}`
          : 'adaptive-disabled',
      },
    };
  }

  // ---- Real adaptive selection ----
  const target = computeTargetCounts(quizLength, classification);

  const exclude = new Set(excludeIds || loadState().recentQuestionIds || []);
  const usedIds = new Set();
  const picked = [];

  function takeFromBucket(bucket, n) {
    if (n <= 0 || bucket.length === 0) return 0;
    // Build a weighted pool: the worse the topic accuracy / more recent
    // incorrects, the more times its questions appear in the pool.
    const weightedTopics = weightedTopicOrder(bucket, stats);
    let added = 0;

    // Try to fill `n` questions, drawing topic-by-topic in the weighted order.
    let attempts = 0;
    const maxAttempts = n * 6 + 4;
    while (added < n && attempts < maxAttempts && weightedTopics.length > 0) {
      attempts++;
      const t = weightedTopics[(added + attempts) % weightedTopics.length];
      const q = pickOneFromTopic(t, questionBank, usedIds, exclude);
      if (q) {
        picked.push(q);
        usedIds.add(q.id);
        added++;
      } else {
        // No fresh question available in that topic; remove it from rotation.
        const idx = weightedTopics.indexOf(t);
        if (idx >= 0) weightedTopics.splice(idx, 1);
      }
    }
    return added;
  }

  const counts = { weak: 0, medium: 0, strong: 0, fill: 0 };
  counts.weak = takeFromBucket(classification.weak, target.weak);
  counts.medium = takeFromBucket(classification.medium, target.medium);
  counts.strong = takeFromBucket(classification.strong, target.strong);

  // Fill any remaining slots: prefer weak > medium > strong > unseen > anywhere.
  const fillOrder = [
    ...classification.weak,
    ...classification.medium,
    ...classification.unseen,
    ...classification.strong,
  ];
  while (picked.length < quizLength) {
    let progressed = false;
    for (const t of fillOrder) {
      if (picked.length >= quizLength) break;
      const q = pickOneFromTopic(t, questionBank, usedIds, exclude);
      if (q) {
        picked.push(q);
        usedIds.add(q.id);
        counts.fill++;
        progressed = true;
      }
    }
    if (!progressed) break;
  }

  // Last resort: relax the recency exclusion if we still don't have enough.
  if (picked.length < quizLength) {
    const remainingPool = questionBank.filter((q) => !usedIds.has(q.id));
    const extras = sampleN(remainingPool, quizLength - picked.length);
    for (const q of extras) { picked.push(q); usedIds.add(q.id); counts.fill++; }
  }

  // Final shuffle so question topics aren't grouped by bucket.
  const ordered = shuffle(picked).slice(0, quizLength);

  if (markShown) rememberShownIds(ordered.map((q) => q.id));

  return {
    questions: ordered,
    plan: {
      adaptive: true,
      targetCounts: target,
      actualCounts: counts,
      usedTopics: countByTopic(ordered),
      classification,
      reason: 'adaptive',
    },
  };
}

// ---- Helpers ----

function computeTargetCounts(quizLength, { weak, medium, strong }) {
  // Start from desired ratios; collapse buckets that have zero topics.
  const buckets = [];
  if (weak.length > 0) buckets.push(['weak', TARGET_DISTRIBUTION.weak]);
  if (medium.length > 0) buckets.push(['medium', TARGET_DISTRIBUTION.medium]);
  if (strong.length > 0) buckets.push(['strong', TARGET_DISTRIBUTION.strong]);

  if (buckets.length === 0) {
    return { weak: 0, medium: 0, strong: 0 };
  }

  const sum = buckets.reduce((a, b) => a + b[1], 0);
  // Floor each bucket, then hand out leftover slots by remainder.
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
    const k = remainders[r][0];
    counts[k] += 1;
    assigned++;
    r++;
  }

  // Guarantee at least 1 weak question if any weak topics exist.
  if (weak.length > 0 && counts.weak === 0 && quizLength > 0) {
    if (counts.strong > 0) counts.strong--;
    else if (counts.medium > 0) counts.medium--;
    counts.weak += 1;
  }
  return counts;
}

/**
 * Returns an array of topic names with weak ones repeated the most so that
 * a round-robin draw naturally favors them. Repetition is based on how
 * far below 100% the topic is, plus a kicker for recent incorrects.
 */
function weightedTopicOrder(topics, stats) {
  const order = [];
  for (const t of topics) {
    const s = stats[t] || { accuracy: 0, recentIncorrectCount: 0 };
    // weight: 1..5 based on (100 - accuracy)/20, plus 1 per recent miss (cap 3).
    const accWeight = Math.max(1, Math.ceil((100 - s.accuracy) / 20));
    const missWeight = Math.min(3, s.recentIncorrectCount || 0);
    const weight = Math.max(1, accWeight + missWeight);
    for (let i = 0; i < weight; i++) order.push(t);
  }
  return shuffle(order);
}

function pickOneFromTopic(topic, bank, usedIds, excludeIds) {
  const candidates = bank.filter(
    (q) => q.topic === topic && !usedIds.has(q.id) && !excludeIds.has(q.id)
  );
  if (candidates.length > 0) return sampleN(candidates, 1)[0];
  // Fall back: ignore recency exclusion within the topic.
  const fallback = bank.filter((q) => q.topic === topic && !usedIds.has(q.id));
  if (fallback.length > 0) return sampleN(fallback, 1)[0];
  return null;
}

function pickWithRecencyAvoidance(pool, n, excludeIds) {
  const exclude = excludeIds || new Set(loadState().recentQuestionIds || []);
  const fresh = pool.filter((q) => !exclude.has(q.id));
  if (fresh.length >= n) return sampleN(fresh, n);
  // Not enough fresh; top up from the rest.
  const rest = pool.filter((q) => exclude.has(q.id));
  return [...sampleN(fresh, fresh.length), ...sampleN(rest, n - fresh.length)];
}

function countByTopic(qs) {
  const out = {};
  for (const q of qs) out[q.topic] = (out[q.topic] || 0) + 1;
  return out;
}

// Convenience helper for randomizing a list of questions returned by the
// engine. The caller can also do this themselves; provided for symmetry.
export function randomizeAll(questions, rng) {
  return questions.map((q) => randomizeQuestion(q, rng));
}
