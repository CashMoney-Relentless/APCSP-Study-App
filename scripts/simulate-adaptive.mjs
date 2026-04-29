// Quick simulation that confirms the adaptive engine produces the expected
// 60/30/10 weak/medium/strong distribution. Seeds bad performance on
// Binary, Procedures, and Lists.

const store = new Map();
globalThis.window = {
  localStorage: {
    getItem: (k) => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => store.set(k, v),
    removeItem: (k) => store.delete(k),
  },
};

const KEY = 'apcsp_mastery_lab_v1';

const { questions } = await import('../src/data/questions.js');
const {
  generateAdaptiveQuiz, classifyTopics, getTopicStats, getRecommendedTopics,
} = await import('../src/utils/adaptiveLearning.js');

function ts(attempts, correct) {
  return {
    attempts, correct, incorrect: attempts - correct,
    accuracy: Math.round((correct / attempts) * 100),
    recentIncorrectCount: attempts - correct,
    lastPracticed: new Date().toISOString(),
    recentResults: [
      ...Array(correct).fill(1),
      ...Array(attempts - correct).fill(0),
    ],
    byDifficulty: {
      easy: { attempts: 0, correct: 0 },
      medium: { attempts, correct },
      hard: { attempts: 0, correct: 0 },
    },
  };
}

const topicStats = {
  Binary:    ts(8, 2),
  Procedures: ts(8, 2),
  Lists:     ts(8, 2),
  Variables: ts(8, 5),
  Selection: ts(8, 5),
  Cybersecurity: ts(8, 5),
  Internet:  ts(10, 9),
  Iteration: ts(10, 9),
};

store.set(KEY, JSON.stringify({
  bestScore: 0, totalPoints: 0, totalQuizzes: 5, totalQuestions: 50, totalCorrect: 25,
  dailyStreak: 0, lastDailyDate: null, lastDailyResult: null, lastExamResult: null,
  knownFlashcards: [], topicStats, recentQuestionIds: [], spacedRepetition: {},
  gameHighScores: { binaryRush: 0, algorithmOrder: 0, bugHunt: 0, logicGate: 0 },
}));

const stats = getTopicStats();
const cls = classifyTopics(stats);
console.log('Classification:');
console.log('  weak  :', cls.weak.join(', '));
console.log('  medium:', cls.medium.join(', '));
console.log('  strong:', cls.strong.join(', '));

console.log('\nRecommended:', getRecommendedTopics(5).map(r => `${r.topic}(${r.accuracy}%, ${r.reason})`).join(', '));

const N = 200;
const LEN = 10;
const totals = { weak: 0, medium: 0, strong: 0, other: 0 };
const perTopic = {};
let firstPlan = null;

for (let i = 0; i < N; i++) {
  const r = generateAdaptiveQuiz(questions, LEN, { adaptive: true, markShown: false });
  if (!firstPlan) firstPlan = r.plan;
  for (const q of r.questions) {
    perTopic[q.topic] = (perTopic[q.topic] || 0) + 1;
    if (cls.weak.includes(q.topic)) totals.weak++;
    else if (cls.medium.includes(q.topic)) totals.medium++;
    else if (cls.strong.includes(q.topic)) totals.strong++;
    else totals.other++;
  }
}

const totalQs = N * LEN;
console.log('\nFirst plan target:', firstPlan.targetCounts);
console.log(`\nBucket frequency over ${N} quizzes (${totalQs} questions):`);
for (const k of ['weak', 'medium', 'strong', 'other']) {
  const pct = ((totals[k] / totalQs) * 100).toFixed(1);
  console.log(`  ${k.padEnd(6)} ${String(totals[k]).padStart(5)} (${pct}%)`);
}

console.log('\nTop 6 topics:');
const sorted = Object.entries(perTopic).sort((a, b) => b[1] - a[1]).slice(0, 6);
for (const [t, n] of sorted) {
  const bucket = cls.weak.includes(t) ? 'weak' : cls.medium.includes(t) ? 'medium' : cls.strong.includes(t) ? 'strong' : 'unseen';
  console.log(`  ${t.padEnd(18)} ${String(n).padStart(4)}  [${bucket}]`);
}

// Edge: Focus mode
const focus = generateAdaptiveQuiz(questions, 8, { adaptive: true, topics: cls.weak, markShown: false });
console.log('\nFocus mode (weak only) topics:', focus.plan.usedTopics);
