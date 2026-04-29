import React, { useState } from 'react';
import Quiz from './Quiz.jsx';
import { todaySeedString } from '../utils/random.js';
import { loadState } from '../utils/storage.js';

export default function DailyChallenge({ onFinish, onHome }) {
  const dateString = todaySeedString();
  const [started, setStarted] = useState(false);
  const state = loadState();
  const alreadyDone = state.lastDailyDate === dateString;
  const lastResult = state.lastDailyResult;

  if (!started && alreadyDone && lastResult && lastResult.date === dateString) {
    const accuracy =
      lastResult.total > 0
        ? Math.round((lastResult.correct / lastResult.total) * 100)
        : 0;
    return (
      <section className="daily-done">
        <div className="daily-card">
          <div className="daily-emoji">📅</div>
          <h2 className="section-title">Today's Daily Challenge — Done!</h2>
          <p className="section-sub">
            You scored <strong>{lastResult.score}</strong> points ·{' '}
            {lastResult.correct}/{lastResult.total} correct ({accuracy}%).
          </p>
          <div className="daily-streak-display">
            🔥 <strong>{state.dailyStreak}</strong> day streak
          </div>
          <p className="come-back">Come back tomorrow for a new challenge.</p>

          <div className="setup-actions">
            <button className="primary-btn" onClick={() => setStarted(true)}>
              Replay (no streak update)
            </button>
            <button className="ghost-btn" onClick={onHome}>
              Home
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (!started) {
    return (
      <section className="daily-intro">
        <div className="daily-card">
          <div className="daily-emoji">📅</div>
          <h2 className="section-title">Daily Challenge</h2>
          <p className="section-sub">
            5 questions. Same set for every player today: <strong>{dateString}</strong>.
            Build your daily streak by completing one each day.
          </p>
          <div className="daily-streak-display">
            🔥 Current streak: <strong>{state.dailyStreak}</strong>
          </div>
          <div className="setup-actions">
            <button className="primary-btn" onClick={() => setStarted(true)}>
              Begin today's challenge →
            </button>
            <button className="ghost-btn" onClick={onHome}>
              Cancel
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <Quiz
      config={{
        length: 5,
        mode: alreadyDone ? 'practice' : 'daily',
        seedString: alreadyDone ? undefined : `daily-${dateString}`,
        dateString,
      }}
      onFinish={onFinish}
      onQuit={onHome}
    />
  );
}
