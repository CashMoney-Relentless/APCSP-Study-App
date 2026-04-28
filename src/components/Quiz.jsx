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
import { recordQuizResult, recordDailyCompletion } from '../utils/storage.js';

// Scoring constants (kept local so they're easy to tweak).
const POINTS_CORRECT = 100;
const STREAK_3_BONUS = 50;
const STREAK_5_BONUS = 100;
const HARD_BONUS = 50;

export default function Quiz({ config, onFinish, onQuit }) {
  const { length, mode = 'practice', topic = 'all', seedString, dateString } = config;

  // Build a seeded RNG when seedString is provided (daily mode).
  // Otherwise use Math.random for full randomness each attempt.
  const rng = useMemo(() => {
    if (seedString) return mulberry32(hashStringToSeed(seedString));
    return Math.random;
  }, [seedString]);

  const quizQuestions = useMemo(() => {
    let pool = bank;
    if (topic && topic !== 'all') {
      pool = bank.filter((q) => q.topic === topic);
      if (pool.length < length) pool = bank; // fallback if topic too small
    }
    const sampled = sampleN(pool, length, rng);
    const ordered = shuffle(sampled, rng);
    return ordered.map((q) => randomizeQuestion(q, rng));
  }, [length, topic, rng]);

  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [locked, setLocked] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [history, setHistory] = useState([]); // { question, selected, isCorrect, points }

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
  }

  function handleNext() {
    if (!locked) return;
    if (index + 1 >= quizQuestions.length) {
      // Finalize
      const correct = history.filter((h) => h.isCorrect).length;
      const total = quizQuestions.length;
      const finalScore = score; // history already includes the just-locked question
      const result = {
        score: finalScore,
        correct,
        total,
        accuracy: total > 0 ? Math.round((correct / total) * 100) : 0,
        history,
        mode,
        dateString,
      };

      if (mode === 'daily' && dateString) {
        recordDailyCompletion({
          score: finalScore,
          correct,
          total,
          dateString,
        });
      } else {
        recordQuizResult({ score: finalScore, correct, total });
      }

      onFinish(result);
      return;
    }
    setIndex((i) => i + 1);
    setSelected(null);
    setLocked(false);
  }

  // Keyboard shortcuts: 1-4 to pick, Enter to advance.
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

  if (!current) return null;

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
