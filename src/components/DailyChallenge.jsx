import React, { useState } from 'react';
import Quiz from './Quiz.jsx';
import { todayDateString } from '../utils/seededRandom.js';
import { loadState } from '../utils/storage.js';

export default function DailyChallenge({ onFinish, onHome }) {
  const dateString = todayDateString();
  const [started, setStarted] = useState(false);
  const [forceReplay, setForceReplay] = useState(false);

  const state = loadState();
  const alreadyDone = state.lastDailyDate === dateString;
  const lastResult = state.lastDailyResult;

  if (!started && alreadyDone && lastResult && lastResult.date === dateString && !forceReplay) {
    const accuracy =
      lastResult.total > 0 ? Math.round((lastResult.correct / lastResult.total) * 100) : 0;
    return (
      <div className="mx-auto max-w-xl text-center animate-fade-up">
        <div className="card p-8 sm:p-10">
          <div className="text-3xl">📅</div>
          <h2 className="mt-3 text-xl font-bold text-ink-900">Today's daily challenge — done!</h2>
          <p className="mt-2 text-sm text-ink-500">
            You scored <strong>{lastResult.score}</strong> · {lastResult.correct}/{lastResult.total} ({accuracy}%).
          </p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-amber-300 bg-amber-50 px-4 py-1.5 text-sm font-bold text-amber-700">
            🔥 {state.dailyStreak} day streak
          </div>
          <p className="mt-4 text-sm text-ink-500">Come back tomorrow for a new challenge.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button className="btn-primary" onClick={() => { setForceReplay(true); setStarted(true); }}>
              Replay (no streak update)
            </button>
            <button className="btn-ghost" onClick={onHome}>Dashboard</button>
          </div>
        </div>
      </div>
    );
  }

  if (!started) {
    return (
      <div className="mx-auto max-w-xl text-center animate-fade-up">
        <div className="card p-8 sm:p-10">
          <div className="text-3xl">📅</div>
          <h2 className="mt-3 text-xl font-bold text-ink-900">Daily Challenge</h2>
          <p className="mt-2 text-sm text-ink-500">
            5 questions. Same set for everyone today: <strong>{dateString}</strong>.
            Complete it daily to build a streak.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-ink-200 bg-ink-50 px-4 py-1.5 text-sm font-semibold text-ink-700">
            🔥 Current streak: {state.dailyStreak}
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button className="btn-primary" onClick={() => setStarted(true)}>Begin today's challenge →</button>
            <button className="btn-ghost" onClick={onHome}>Cancel</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Quiz
      config={{
        length: 5,
        mode: forceReplay ? 'daily-replay' : 'daily',
        seedString: forceReplay ? undefined : `daily-${dateString}`,
        dateString,
      }}
      onFinish={onFinish}
      onQuit={onHome}
    />
  );
}
