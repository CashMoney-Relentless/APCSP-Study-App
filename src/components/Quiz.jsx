import React, { useEffect, useMemo, useState } from 'react';
import QuestionCard from './QuestionCard.jsx';
import { questions as bank } from '../data/questions.js';
import {
  mulberry32, hashStringToSeed, randomizeQuestion, sampleN, shuffle,
} from '../utils/seededRandom.js';
import {
  recordDailyFinish, recordQuizFinish, updateState,
} from '../utils/storage.js';
import {
  generateAdaptiveQuiz, recordAnswer,
} from '../utils/adaptiveLearning.js';
import { POINTS, scoreAnswer } from '../utils/scoring.js';

export default function Quiz({ config, onFinish, onQuit }) {
  const {
    length,
    mode = 'practice',
    topic = 'all',
    seedString,
    dateString,
    adaptive = true,
    lives: livesStart = null,
    showInstantFeedback = true,
    topicSubset = null,
  } = config;

  // Seeded RNG only for the daily challenge.
  const seededRng = useMemo(() => {
    if (seedString) return mulberry32(hashStringToSeed(seedString));
    return null;
  }, [seedString]);

  // Build the quiz once per config.
  const built = useMemo(() => {
    if (seededRng) {
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
    const opts = { adaptive, topic };
    if (Array.isArray(topicSubset) && topicSubset.length > 0) {
      opts.topics = topicSubset;
    }
    const r = generateAdaptiveQuiz(bank, length, opts);
    return {
      questions: r.questions.map((q) => randomizeQuestion(q, Math.random)),
      plan: r.plan,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [length, topic, adaptive, seededRng, topicSubset && topicSubset.join(',')]);

  const quizQuestions = built.questions;
  const plan = built.plan;

  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [locked, setLocked] = useState(false);
  const [score, setScore] = useState(0);
  const [pointsEarned, setPointsEarned] = useState(0);
  const [streak, setStreak] = useState(0);
  const [history, setHistory] = useState([]);
  const [lives, setLives] = useState(livesStart);

  const current = quizQuestions[index];

  function handleSelect(i) {
    if (locked) return;
    setSelected(i);
    setLocked(true);
    const isCorrect = i === current.correctAnswer;

    const { earned, nextStreak } = scoreAnswer({
      isCorrect, difficulty: current.difficulty, prevStreak: streak,
    });
    setScore((s) => s + earned);
    setPointsEarned((p) => p + earned);
    setStreak(nextStreak);
    setHistory((h) => [
      ...h,
      { question: current, selected: i, isCorrect, points: earned },
    ]);

    // Live updates: topic stats + spaced rep (skip stat updates for daily replay).
    if (mode !== 'daily-replay') {
      recordAnswer({ question: current, isCorrect, mode });
    }

    if (livesStart != null && !isCorrect) {
      const remaining = lives - 1;
      setLives(remaining);
      if (remaining <= 0) {
        // Survival: end immediately on next tick.
        setTimeout(() => finalizeQuiz([
          ...history,
          { question: current, selected: i, isCorrect, points: earned },
        ], score + earned, pointsEarned + earned), 600);
      }
    }

    // Drill mode: auto-advance after a short pause.
    if (!showInstantFeedback) {
      setTimeout(() => advance(), 350);
    }
  }

  function advance(forced = false) {
    if (!forced && !locked) return;
    if (index + 1 >= quizQuestions.length) {
      finalizeQuiz(history.length === quizQuestions.length ? history : history, score, pointsEarned);
      return;
    }
    setIndex((i) => i + 1);
    setSelected(null);
    setLocked(false);
  }

  function finalizeQuiz(finalHistory, finalScore, finalPoints) {
    const total = finalHistory.length;
    const correct = finalHistory.filter((h) => h.isCorrect).length;
    const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
    const result = {
      score: finalScore,
      pointsEarned: finalPoints,
      correct,
      total,
      accuracy,
      history: finalHistory,
      mode,
      dateString,
      plan,
      lives,
    };

    if (mode === 'daily' && dateString) {
      recordDailyFinish({
        score: finalScore, correct, total, dateString, history: finalHistory,
        pointsEarned: finalPoints + POINTS.DAILY_CHALLENGE_BONUS,
      });
    } else if (mode !== 'daily-replay') {
      recordQuizFinish({
        score: finalScore, correct, total,
        history: finalHistory, pointsEarned: finalPoints, mode,
      });
    } else {
      // daily-replay: still remember ids so we don't show the same in the
      // very next quiz.
      updateState((s) => ({
        ...s,
        recentQuestionIds: [
          ...(s.recentQuestionIds || []),
          ...finalHistory.map((h) => h.question.id),
        ].slice(-36),
      }));
    }

    onFinish(result);
  }

  function handleNext() { advance(); }

  // Keyboard shortcuts: 1-4 pick, Enter advance.
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
      <div className="card p-6 text-center">
        <p className="text-ink-700">No questions available for this configuration.</p>
        <button className="btn-ghost mt-3" onClick={onQuit}>Back</button>
      </div>
    );
  }

  const progressPct = Math.round(((index + (locked ? 1 : 0)) / quizQuestions.length) * 100);

  return (
    <div className="space-y-4 animate-fade-up">
      <div className="card flex flex-wrap items-center gap-4 px-4 py-3 sm:px-6">
        <div className="flex-1 min-w-[200px]">
          <div className="progress-track"><div className="progress-fill" style={{ width: `${progressPct}%` }} /></div>
          <div className="mt-1.5 text-xs uppercase tracking-wider text-ink-400">
            {index + 1} of {quizQuestions.length}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {plan?.adaptive && <span className="pill-blue">⚡ Adaptive</span>}
          {mode === 'survival' && (
            <span className="pill-red">
              {'❤'.repeat(Math.max(0, lives))}{lives < (livesStart || 0) ? '🤍'.repeat((livesStart || 0) - lives) : ''}
            </span>
          )}
          {mode === 'drill' && <span className="pill-amber">drill</span>}
          {mode === 'focus' && <span className="pill-blue">focus</span>}
          <span className="pill">
            <span className="text-ink-400">pts</span>
            <span className="text-base font-bold text-brand-700">{score}</span>
          </span>
          <span className={`pill ${streak >= 3 ? 'pill-amber' : ''}`}>🔥 {streak}</span>
          <button className="btn-ghost" onClick={onQuit}>Quit</button>
        </div>
      </div>

      <QuestionCard
        question={current}
        index={index}
        total={quizQuestions.length}
        selectedIndex={selected}
        isLocked={locked}
        showFeedback={showInstantFeedback}
        onSelect={handleSelect}
      />

      <div className="flex justify-end">
        <button className="btn-primary" disabled={!locked} onClick={handleNext}>
          {index + 1 >= quizQuestions.length ? 'See results' : 'Next →'}
        </button>
      </div>
    </div>
  );
}
