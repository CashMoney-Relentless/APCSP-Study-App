import React from 'react';
import { questions, allTopics } from '../data/questions.js';

const NAV = [
  { id: 'home', label: 'Overview', icon: '◇' },
  { id: 'setup', label: 'Practice', icon: '◎' },
  { id: 'daily', label: 'Daily', icon: '✦' },
  { id: 'flashcards', label: 'Flashcards', icon: '▤' },
  { id: 'stats', label: 'Stats', icon: '◢' },
];

export default function Sidebar({ view, onNavigate, stats, open, onClose }) {
  const accuracy =
    stats.totalQuestions > 0
      ? Math.round((stats.totalCorrect / stats.totalQuestions) * 100)
      : 0;

  // Top three topics by attempts
  const topics = allTopics();
  const topicRows = topics
    .map((t) => {
      const ts = stats.topicStats?.[t] || { correct: 0, total: 0 };
      return { topic: t, ...ts };
    })
    .filter((r) => r.total > 0)
    .sort((a, b) => b.total - a.total)
    .slice(0, 4);

  // Activity matches the section we're in (or 'home' for results/quiz)
  const activeNav = (() => {
    if (view === 'quiz') return null;
    if (view === 'results') return null;
    if (view === 'setup') return 'setup';
    return view;
  })();

  return (
    <>
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="sidebar-inner">
          <div className="profile">
            <div className="avatar" aria-hidden="true">
              <span>AP</span>
              <span className="avatar-dot" />
            </div>
            <div className="profile-name">AP CSP Arena</div>
            <div className="profile-role">Study companion</div>
          </div>

          <div className="info-list">
            <InfoRow label="Bank" value={`${questions.length} questions`} />
            <InfoRow label="Topics" value={`${topics.length}`} />
            <InfoRow label="Accuracy" value={`${accuracy}%`} />
          </div>

          <nav className="nav-list" aria-label="Sections">
            {NAV.map((n) => (
              <button
                key={n.id}
                className={`nav-item ${activeNav === n.id ? 'active' : ''}`}
                onClick={() => {
                  onNavigate(n.id);
                  onClose && onClose();
                }}
              >
                <span className="nav-icon" aria-hidden="true">{n.icon}</span>
                <span className="nav-label">{n.label}</span>
              </button>
            ))}
          </nav>

          {topicRows.length > 0 && (
            <div className="topic-mastery">
              <div className="block-label">Mastery</div>
              <ul className="topic-bars">
                {topicRows.map((r) => {
                  const pct = Math.round((r.correct / r.total) * 100);
                  return (
                    <li key={r.topic}>
                      <div className="topic-bar-row">
                        <span className="topic-name">{r.topic}</span>
                        <span className="topic-pct">{pct}%</span>
                      </div>
                      <div className="topic-track">
                        <div className="topic-fill" style={{ width: `${pct}%` }} />
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          <div className="sidebar-foot">
            <div className="streak-mini">
              <span className="streak-num">{stats.dailyStreak}</span>
              <span className="streak-lbl">day streak</span>
            </div>
            <div className="best-mini">
              <span className="best-num">{stats.bestScore}</span>
              <span className="best-lbl">best score</span>
            </div>
          </div>
        </div>
      </aside>
      {open && <div className="sidebar-backdrop" onClick={onClose} />}
    </>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="info-row">
      <span className="info-label">{label}</span>
      <span className="info-dotline" aria-hidden="true" />
      <span className="info-value">{value}</span>
    </div>
  );
}
