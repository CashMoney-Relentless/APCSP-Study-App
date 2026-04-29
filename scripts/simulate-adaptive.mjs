// Lightweight sanity simulation for the adaptive engine.
// Sets up an in-memory localStorage shim, seeds a fake history where the
// learner is bad at Binary, Procedures, and Lists and good at Internet
// and Iteration, then runs many quizzes and prints the topic distribution.

const store = new Map();
globalThis.window = {
  localStorage: {
    getItem: (k) => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => store.set(k, v),
    removeItem: (k) => store.delete(k),
  },
};

const STORAGE_KEY = 'apcsp_arena_v1';

const { questions } = await import('../src/data/questions.js');
const {
  generateAdaptiveQuiz,
  classifyTopics,
  getTopicStats,
  getRecommendedTopics,
} = await import('../src/utils/adaptiveLearning.js');

// Build a fake topicStats: weak on Binary, Procedures, Lists; strong on
// Internet and Iteration; medium on the rest.
const weakTopics = ['Binary', 'Procedures', 'Lists'];
const strongTopics = ['Internet', 'Iteration'];
const mediumTopics = ['Variables', 'Selection', 'Cybersecurity'];

const topicStats = {};
for (const t of weakTopics) topicStats[t] = mk(8, 2);     // 25%
for (const t of mediumTopics) topicStats[t] = mk(8, 5);    // ~62%
for (const t of strongTopics) topicStats[t] = mk(10, 9);   // 90%

function mk(attempts, correct) {
  return {
    attempts,
    correct,
    incorrect: attempts - correct,
    accuracy: Math.round((correct / attempts) * 100),
    recentIncorrectCount: attempts - correct,
    lastPracticed: new Date().toISOString(),
    recentResults: [
      ...Array(correct).fill(1),
      ...Array(attempts - correct).fill(0),
    ],
  };
}

store.set(
  STORAGE_KEY,
  JSON.stringify({
    bestScore: 0,
    totalQuizzes: 5,
    totalQuestions: 50,
    totalCorrect: 25,
    dailyStreak: 0,
    lastDailyDate: null,
    lastDailyResult: null,
    knownFlashcards: [],
    topicStats,
    recentQuestionIds: [],
  })
);

console.log('=== Topic stats ===');
const stats = getTopicStats();
for (const [t, s] of Object.entries(stats)) {
  if (s.attempts === 0) continue;
  console.log(`  ${t.padEnd(18)} acc=${String(s.accuracy).padStart(3)}%  attempts=${s.attempts}`);
}

const cls = classifyTopics(stats);
console.log('\n=== Classification ===');
console.log('  weak  :', cls.weak.join(', ') || '(none)');
console.log('  medium:', cls.medium.join(', ') || '(none)');
console.log('  strong:', cls.strong.join(', ') || '(none)');
console.log('  unseen:', cls.unseen.length, 'topics');

console.log('\n=== Recommended focus ===');
console.log(getRecommendedTopics(5).map((r) => `${r.topic}(${r.accuracy}%, ${r.reason})`).join('  '));

// Run 200 simulated 10-question quizzes and tally topic frequency.
const N_QUIZZES = 200;
const LENGTH = 10;
const totals = { weak: 0, medium: 0, strong: 0, other: 0 };
const perTopic = {};
let firstPlan = null;

for (let i = 0; i < N_QUIZZES; i++) {
  const r = generateAdaptiveQuiz(questions, LENGTH, { adaptive: true, markShown: false });
  if (!firstPlan) firstPlan = r.plan;
  for (const q of r.questions) {
    perTopic[q.topic] = (perTopic[q.topic] || 0) + 1;
    if (cls.weak.includes(q.topic)) totals.weak++;
    else if (cls.medium.includes(q.topic)) totals.medium++;
    else if (cls.strong.includes(q.topic)) totals.strong++;
    else totals.other++;
  }
}
const totalQs = N_QUIZZES * LENGTH;

console.log('\n=== First plan target counts ===');
console.log(' ', firstPlan.targetCounts);

console.log(`\n=== Bucket frequency over ${N_QUIZZES} quizzes (${totalQs} questions) ===`);
for (const k of ['weak', 'medium', 'strong', 'other']) {
  const pct = ((totals[k] / totalQs) * 100).toFixed(1);
  console.log(`  ${k.padEnd(6)} ${String(totals[k]).padStart(5)} (${pct}%)`);
}

console.log('\n=== Top 6 topics by frequency ===');
const sorted = Object.entries(perTopic).sort((a, b) => b[1] - a[1]).slice(0, 6);
for (const [t, n] of sorted) {
  const bucket = cls.weak.includes(t) ? 'weak'
    : cls.medium.includes(t) ? 'medium'
    : cls.strong.includes(t) ? 'strong' : 'unseen';
  console.log(`  ${t.padEnd(18)} ${String(n).padStart(4)}  [${bucket}]`);
}

console.log('\n=== Quiz with single-topic override ===');
const single = generateAdaptiveQuiz(questions, 5, { adaptive: true, topic: 'Binary', markShown: false });
console.log(' ', single.plan.reason, '->', Object.keys(single.plan.usedTopics));
