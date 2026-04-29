import React, { useEffect, useMemo, useState } from 'react';
import QuestionCard from './QuestionCard.jsx';
import { questions as bank } from '../data/questions.js';
import {
  mulberry32,
  hashStringToSeed,
  randomizeQuestion,
  sampleN,
  shuffle,
} from '../utils/random.js';
import {
  recordDailyCompletion,
  updateState,
} from '../utils/storage.js';
import {
  generateAdaptiveQuiz,
  updateTopicStats,
} from '../utils/adaptiveLearning.js';

const POINTS_CORRECT = 100;
const STREAK_3_BONUS = 50;
const STREAK_5_BONUS = 100;
const HARD_BONUS = 50;

export default function Quiz({ config, onFinish, onQuit }) {
  const {
    length,
    mode = 'practice',
    topic = 'all',
    seedString,
    dateString,
    adaptive = true,
  } = config;

  // Seeded RNG only when a seedString is given (daily mode). The adaptive
  // engine itself relies on Math.random for question variety so the same
  // user doesn't see identical practice quizzes back-to-back.
  const seededRng = useMemo(() => {
    if (seedString) return mulberry32(hashStringToSeed(seedString));
    return null;
  }, [seedString]);

  const built = useMemo(() => {
    if (seededRng) {
      // Daily / seeded path: keep deterministic behavior, no adaptive bias.
      let pool = bank;
      if (topic && topic !== 'all') {
        pool = bank.filter((q) => q.topic === topic);
        if (pool.length < length) pool = bank;
      }
      const sampled = sampleN(pool, length, seededRng);
      const ordered = shuffle(sampled, seededRng);
      return {
        questions: ordered.map((q) => randomizeQuestion(q, seededRng)),
        plan: { adaptive: false, reason: 'seeded' },
      };
    }

    const result = generateAdaptiveQuiz(bank, length, { adaptive, topic });
    const rngForChoices = Math.random;
    return {
      questions: result.questions.map((q) => randomizeQuestion(q, rngForChoices)),
      plan: result.plan,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [length, topic, adaptive, seededRng]);

  const quizQuestions = built.questions;
  const plan = built.plan;

  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [locked, setLocked] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [history, setHistory] = useState([]);

  const current = quizQuestions[index];

  function handleSelect(i) {
    if (locked) return;
    setSelected(i);
    setLocked(true);

    const isCorrect = i === current.correctAnswer;
    let earned = 0;
    let nextStreak = streak;

    if (isCorrect) {
      earned += POINTS_CORRECT;
      if (current.difficulty === 'hard') earned += HARD_BONUS;
      nextStreak = streak + 1;
      if (nextStreak > 0 && nextStreak % 5 === 0) earned += STREAK_5_BONUS;
      else if (nextStreak > 0 && nextStreak % 3 === 0) earned += STREAK_3_BONUS;
    } else {
      nextStreak = 0;
    }

    setScore((s) => s + earned);
    setStreak(nextStreak);
    setHistory((h) => [
      ...h,
      { question: current, selected: i, isCorrect, points: earned },
    ]);

    // Live per-answer topic update — for non-daily modes only, so the
    // very next quiz reflects the latest performance. Daily uses the
    // batch update at completion to keep "already played today" gating.
    if (mode !== 'daily') {
      updateTopicStats(current.topic, isCorrect);
    }
  }

  function handleNext() {
    if (!locked) return;
    if (index + 1 >= quizQuestions.length) {
      const correct = history.filter((h) => h.isCorrect).length;
      const total = quizQuestions.length;
      const finalScore = score;
      const result = {
        score: finalScore,
        correct,
        total,
        accuracy: total > 0 ? Math.round((correct / total) * 100) : 0,
        history,
        mode,
        dateString,
        plan,
      };

      if (mode === 'daily' && dateString) {
        recordDailyCompletion({
          score: finalScore,
          correct,
          total,
          dateString,
          history,
        });
      } else {
        // Topic stats already applied live; record aggregate score and
        // remember which question ids were used (history-aware).
        updateState((s) => ({
          ...s,
          bestScore: Math.max(s.bestScore, finalScore),
          totalQuizzes: s.totalQuizzes + 1,
          totalQuestions: s.totalQuestions + total,
          totalCorrect: s.totalCorrect + correct,
          recentQuestionIds: [
            ...(s.recentQuestionIds || []),
            ...history.map((h) => h.question.id),
          ].slice(-24),
        }));
      }

      onFinish(result);
      return;
    }
    setIndex((i) => i + 1);
    setSelected(null);
    setLocked(false);
  }

  useEffect(() => {
    function onKey(e) {
      if (e.key >= '1' && e.key <= '6') {
        const n = Number(e.key) - 1;
        if (current && n < current.choices.length) handleSelect(n);
      } else if (e.key === 'Enter' && locked) {
        handleNext();
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  if (!current) {
    return (
      <section className="quiz">
        <div className="question-card">
          <div className="question-text">No questions available for this configuration.</div>
          <div className="quiz-actions">
            <button className="ghost-btn" onClick={onQuit}>Back</button>
          </div>
        </div>
      </section>
    );
  }

  const progressPct = Math.round(((index + (locked ? 1 : 0)) / quizQuestions.length) * 100);

  return (
    <section className="quiz">
      <div className="quiz-topbar">
        <div className="quiz-progress">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progressPct}%` }} />
          </div>
          <div className="progress-label">
            {index + 1} of {quizQuestions.length}
          </div>
        </div>

        <div className="quiz-stats">
          {plan?.adaptive && (
            <div className="adaptive-badge" title="Adaptive: weighted toward your weak topics">
              ⚡ Adaptive
            </div>
          )}
          <div className="quiz-score" title="Live score">
            <span className="quiz-score-num">{score}</span>
            <span className="quiz-score-label">pts</span>
          </div>
          <div className={`quiz-streak ${streak >= 3 ? 'on-fire' : ''}`} title="Streak">
            🔥 {streak}
          </div>
          <button className="ghost-btn small" onClick={onQuit}>
            Quit
          </button>
        </div>
      </div>

      <QuestionCard
        question={current}
        index={index}
        total={quizQuestions.length}
        selectedIndex={selected}
        isLocked={locked}
        onSelect={handleSelect}
      />

      <div className="quiz-actions">
        <button
          className="primary-btn"
          disabled={!locked}
          onClick={handleNext}
        >
          {index + 1 >= quizQuestions.length ? 'See results' : 'Next →'}
        </button>
      </div>
    </section>
  );
}
