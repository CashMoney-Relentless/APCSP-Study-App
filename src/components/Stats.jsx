import React, { useState } from 'react';
import { resetAllStats, loadState } from '../utils/storage.js';

export default function Stats({ stats, onHome, onReset }) {
  const [confirm, setConfirm] = useState(false);
  const [snap, setSnap] = useState(stats);

  const accuracy =
    snap.totalQuestions > 0
      ? Math.round((snap.totalCorrect / snap.totalQuestions) * 100)
      : 0;

  function handleReset() {
    resetAllStats();
    const fresh = loadState();
    setSnap(fresh);
    onReset && onReset();
    setConfirm(false);
  }

  return (
    <section className="stats">
      <h2 className="section-title">Your Stats</h2>
      <p className="section-sub">
        All data is saved on this device only (localStorage). Clearing your browser data resets everything.
      </p>

      <div className="stats-grid">
        <StatCard label="Best Score" value={snap.bestScore} icon="🏆" />
        <StatCard label="Total Quizzes" value={snap.totalQuizzes} icon="📚" />
        <StatCard label="Questions Answered" value={snap.totalQuestions} icon="❓" />
        <StatCard label="Correct Answers" value={snap.totalCorrect} icon="✅" />
        <StatCard label="Average Accuracy" value={`${accuracy}%`} icon="🎯" />
        <StatCard label="Daily Streak" value={`${snap.dailyStreak}🔥`} icon="📅" />
        <StatCard
          label="Last Daily"
          value={snap.lastDailyDate || '—'}
          icon="🕐"
          small
        />
      </div>

      <div className="stats-actions">
        {!confirm ? (
          <button className="danger-btn" onClick={() => setConfirm(true)}>
            Reset all stats
          </button>
        ) : (
          <div className="confirm-row">
            <span>Are you sure? This cannot be undone.</span>
            <button className="danger-btn" onClick={handleReset}>
              Yes, reset
            </button>
            <button className="ghost-btn" onClick={() => setConfirm(false)}>
              Cancel
            </button>
          </div>
        )}
        <button className="ghost-btn" onClick={onHome}>Home</button>
      </div>
    </section>
  );
}

function StatCard({ label, value, icon, small }) {
  return (
    <div className={`stat-card ${small ? 'small' : ''}`}>
      <div className="stat-card-icon">{icon}</div>
      <div className="stat-card-value">{value}</div>
      <div className="stat-card-label">{label}</div>
    </div>
  );
}
