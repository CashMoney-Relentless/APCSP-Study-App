// Edge-case tests for the adaptive engine.
const store = new Map();
globalThis.window = {
  localStorage: {
    getItem: (k) => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => store.set(k, v),
    removeItem: (k) => store.delete(k),
  },
};
const KEY = 'apcsp_arena_v1';
const { questions } = await import('../src/data/questions.js');
const { generateAdaptiveQuiz } = await import('../src/utils/adaptiveLearning.js');

function setState(state) {
  store.clear();
  store.set(KEY, JSON.stringify({
    bestScore: 0, totalQuizzes: 0, totalQuestions: 0, totalCorrect: 0,
    dailyStreak: 0, lastDailyDate: null, lastDailyResult: null,
    knownFlashcards: [], recentQuestionIds: [], topicStats: {},
    ...state,
  }));
}

function topicStat(attempts, correct) {
  return {
    attempts, correct, incorrect: attempts - correct,
    accuracy: Math.round((correct/attempts)*100),
    recentIncorrectCount: attempts - correct,
    lastPracticed: new Date().toISOString(),
    recentResults: [...Array(correct).fill(1), ...Array(attempts-correct).fill(0)],
  };
}

console.log('--- Case 1: empty stats (cold start) ---');
setState({});
let r = generateAdaptiveQuiz(questions, 10, { adaptive: true, markShown: false });
console.log('  reason:', r.plan.reason, '| adaptive:', r.plan.adaptive);
console.log('  topics used:', Object.keys(r.plan.usedTopics).length);

console.log('\n--- Case 2: just below MIN_ATTEMPTS_FOR_ADAPTIVE ---');
setState({ topicStats: { Variables: topicStat(4, 2) } });
r = generateAdaptiveQuiz(questions, 10, { adaptive: true, markShown: false });
console.log('  reason:', r.plan.reason, '| adaptive:', r.plan.adaptive);

console.log('\n--- Case 3: only strong topics ---');
setState({ topicStats: {
  Variables: topicStat(10, 10),
  Lists: topicStat(8, 8),
  Iteration: topicStat(8, 8),
}});
r = generateAdaptiveQuiz(questions, 10, { adaptive: true, markShown: false });
console.log('  reason:', r.plan.reason);
console.log('  target:', r.plan.targetCounts);
console.log('  topics:', r.plan.usedTopics);

console.log('\n--- Case 4: weak + strong, no medium ---');
setState({ topicStats: {
  Binary: topicStat(8, 1),       // 12.5% weak
  Internet: topicStat(8, 8),     // 100% strong
  Iteration: topicStat(8, 7),    // 87.5% strong
}});
r = generateAdaptiveQuiz(questions, 10, { adaptive: true, markShown: false });
console.log('  target:', r.plan.targetCounts);
console.log('  topics:', r.plan.usedTopics);

console.log('\n--- Case 5: 5-question quiz with weak emphasis ---');
setState({ topicStats: {
  Binary: topicStat(8, 2),
  Procedures: topicStat(8, 2),
  Lists: topicStat(8, 2),
  Internet: topicStat(8, 7),
  Variables: topicStat(8, 5),
}});
r = generateAdaptiveQuiz(questions, 5, { adaptive: true, markShown: false });
console.log('  target:', r.plan.targetCounts);
console.log('  topics:', r.plan.usedTopics);

console.log('\n--- Case 6: 20-question quiz ---');
r = generateAdaptiveQuiz(questions, 20, { adaptive: true, markShown: false });
console.log('  target:', r.plan.targetCounts, '(should sum to 20)');
console.log('  topics:', r.plan.usedTopics);
