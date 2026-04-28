import React from 'react';
import { questions } from '../data/questions.js';

export default function Home({ stats, onStartPractice, onDaily, onFlashcards, onStats }) {
  const accuracy =
    stats.totalQuestions > 0
      ? Math.round((stats.totalCorrect / stats.totalQuestions) * 100)
      : 0;

  return (
    <section className="home">
      <div className="hero">
        <h1 className="hero-title">
          AP CSP <span className="grad">Study Arena</span>
        </h1>
        <p className="hero-sub">
          Sharpen your AP Computer Science Principles skills with quizzes,
          flashcards, and a fresh daily challenge.
        </p>
      </div>

      <div className="stat-row">
        <StatPill label="Best Score" value={stats.bestScore} />
        <StatPill label="Daily Streak" value={`${stats.dailyStreak}🔥`} />
        <StatPill label="Questions Answered" value={stats.totalQuestions} />
        <StatPill label="Avg Accuracy" value={`${accuracy}%`} />
      </div>

      <div className="action-grid">
        <ActionCard
          color="violet"
          icon="🎯"
          title="Start Practice"
          desc="Choose 5, 10, or 20 questions. Random every time."
          onClick={onStartPractice}
        />
        <ActionCard
          color="cyan"
          icon="📅"
          title="Daily Challenge"
          desc="Same 5 questions worldwide today. Build your streak."
          onClick={onDaily}
        />
        <ActionCard
          color="pink"
          icon="🃏"
          title="Flashcards"
          desc="Vocabulary review. Flip, shuffle, mark as known."
          onClick={onFlashcards}
        />
        <ActionCard
          color="amber"
          icon="📊"
          title="Stats"
          desc="Track your progress over time."
          onClick={onStats}
        />
      </div>

      <div className="bank-note">
        <strong>{questions.length}</strong> questions in the bank · easily expand
        in <code>src/data/questions.js</code>.
      </div>
    </section>
  );
}

function StatPill({ label, value }) {
  return (
    <div className="stat-pill">
      <div className="stat-pill-value">{value}</div>
      <div className="stat-pill-label">{label}</div>
    </div>
  );
}

function ActionCard({ icon, title, desc, color, onClick }) {
  return (
    <button className={`action-card action-${color}`} onClick={onClick}>
      <div className="action-icon" aria-hidden="true">{icon}</div>
      <div className="action-title">{title}</div>
      <div className="action-desc">{desc}</div>
    </button>
  );
}
