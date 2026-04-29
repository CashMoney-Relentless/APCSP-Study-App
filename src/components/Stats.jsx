import React, { useState } from 'react';
import { resetAllStats, loadState } from '../utils/storage.js';
import { classifyTopics, getTopicStats } from '../utils/adaptiveLearning.js';

export default function Stats({ stats, onHome, onReset, onPractice, onGames }) {
  const [confirm, setConfirm] = useState(false);
  const [snap, setSnap] = useState(stats);

  const accuracy =
    snap.totalQuestions > 0 ? Math.round((snap.totalCorrect / snap.totalQuestions) * 100) : 0;

  const topicStats = getTopicStats();
  const topicEntries = Object.entries(topicStats).filter(([, s]) => s.attempts > 0);
  const cls = classifyTopics(topicStats);

  const strongest = [...topicEntries]
    .sort((a, b) => b[1].accuracy - a[1].accuracy || b[1].attempts - a[1].attempts)[0];
  const weakest = [...topicEntries]
    .sort((a, b) => a[1].accuracy - b[1].accuracy || b[1].recentIncorrectCount - a[1].recentIncorrectCount)[0];

  function handleReset() {
    resetAllStats();
    const fresh = loadState();
    setSnap(fresh);
    onReset && onReset();
    setConfirm(false);
  }

  return (
    <div className="space-y-6 animate-fade-up">
      <header>
        <h2 className="section-title">Your Stats</h2>
        <p className="mt-2 text-sm text-ink-500">
          All data is stored on this device only (localStorage). Clearing your browser data resets everything.
        </p>
      </header>

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        <StatCard label="Best Score" value={snap.bestScore} />
        <StatCard label="Total Points" value={snap.totalPoints} highlight />
        <StatCard label="Quizzes Taken" value={snap.totalQuizzes} />
        <StatCard label="Questions Answered" value={snap.totalQuestions} />
        <StatCard label="Correct Answers" value={snap.totalCorrect} />
        <StatCard label="Accuracy" value={`${accuracy}%`} />
        <StatCard label="Daily Streak" value={`${snap.dailyStreak}🔥`} />
        <StatCard label="Last Daily" value={snap.lastDailyDate || '—'} small />
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="card p-5">
          <h3 className="section-title">Strongest topic</h3>
          {strongest ? (
            <TopicSummary topic={strongest[0]} stat={strongest[1]} tone="strong" />
          ) : (
            <p className="mt-3 text-sm text-ink-500">Take a few quizzes to see your strengths.</p>
          )}
        </div>
        <div className="card p-5">
          <h3 className="section-title">Weakest topic</h3>
          {weakest ? (
            <TopicSummary topic={weakest[0]} stat={weakest[1]} tone="weak" />
          ) : (
            <p className="mt-3 text-sm text-ink-500">No data yet.</p>
          )}
        </div>
      </section>

      <section className="card p-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="section-title">Topic mastery</h3>
          <span className="text-xs text-ink-400">
            {cls.weak.length} weak · {cls.medium.length} medium · {cls.strong.length} strong · {cls.unseen.length} unseen
          </span>
        </div>

        {topicEntries.length === 0 ? (
          <p className="mt-4 text-sm text-ink-500">No quizzes taken yet.</p>
        ) : (
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {topicEntries
              .sort((a, b) => a[1].accuracy - b[1].accuracy)
              .map(([topic, s]) => (
                <li key={topic} className="rounded-xl border border-ink-100 p-4">
                  <div className="flex items-baseline justify-between">
                    <span className="font-semibold text-ink-900">{topic}</span>
                    <span className="text-xs text-ink-500">
                      {s.correct}/{s.attempts} · {s.accuracy}%
                    </span>
                  </div>
                  <div className="progress-track mt-2">
                    <div className="progress-fill" style={{ width: `${s.accuracy}%` }} />
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {(['easy', 'medium', 'hard']).map((d) => {
                      const bd = s.byDifficulty?.[d] || { attempts: 0, correct: 0 };
                      if (bd.attempts === 0) return null;
                      const accD = Math.round((bd.correct / bd.attempts) * 100);
                      return (
                        <span key={d} className="pill text-[11px]">
                          {d}: {bd.correct}/{bd.attempts} ({accD}%)
                        </span>
                      );
                    })}
                  </div>
                </li>
              ))}
          </ul>
        )}
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="card p-5">
          <h3 className="section-title">Game high scores</h3>
          <ul className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-2">
            {Object.entries(snap.gameHighScores || {}).map(([game, score]) => (
              <li key={game} className="rounded-xl border border-ink-100 p-3 text-center">
                <div className="text-xs uppercase tracking-wider text-ink-400">{labelGame(game)}</div>
                <div className="mt-1 text-xl font-bold text-ink-900">{score}</div>
              </li>
            ))}
          </ul>
          {onGames && (
            <button className="btn-ghost mt-4" onClick={onGames}>Play a game →</button>
          )}
        </div>

        <div className="card p-5">
          <h3 className="section-title">Quick actions</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {onPractice && <button className="btn-primary" onClick={onPractice}>Start practice</button>}
            <button className="btn-ghost" onClick={onHome}>Dashboard</button>
            {!confirm ? (
              <button className="btn-danger ml-auto" onClick={() => setConfirm(true)}>Reset all stats</button>
            ) : (
              <div className="ml-auto flex flex-wrap items-center gap-2 rounded-xl border border-bad-500/40 bg-bad-500/10 p-2 text-sm text-bad-600">
                Reset all stats?
                <button className="btn-danger" onClick={handleReset}>Yes, reset</button>
                <button className="btn-ghost" onClick={() => setConfirm(false)}>Cancel</button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function StatCard({ label, value, highlight, small }) {
  return (
    <div className="card p-4">
      <div className="text-[11px] uppercase tracking-wider text-ink-400">{label}</div>
      <div className={`mt-1 ${small ? 'text-base' : 'text-2xl'} font-extrabold ${highlight ? 'text-brand-600' : 'text-ink-900'}`}>
        {value}
      </div>
    </div>
  );
}

function TopicSummary({ topic, stat, tone }) {
  const color = tone === 'strong' ? 'text-good-600' : 'text-bad-600';
  return (
    <div className="mt-3">
      <div className="flex items-baseline justify-between">
        <span className="text-lg font-bold text-ink-900">{topic}</span>
        <span className={`text-sm font-semibold ${color}`}>{stat.accuracy}%</span>
      </div>
      <div className="progress-track mt-2"><div className="progress-fill" style={{ width: `${stat.accuracy}%` }} /></div>
      <div className="mt-2 text-xs text-ink-500">
        {stat.correct}/{stat.attempts} correct · {stat.recentIncorrectCount} recent miss{stat.recentIncorrectCount === 1 ? '' : 'es'}
      </div>
    </div>
  );
}

function labelGame(id) {
  if (id === 'binaryRush') return 'Binary Rush';
  if (id === 'algorithmOrder') return 'Algorithm Order';
  if (id === 'bugHunt') return 'Bug Hunt';
  if (id === 'logicGate') return 'Logic Gate';
  return id;
}
