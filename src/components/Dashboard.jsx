import React from 'react';
import { questions } from '../data/questions.js';
import { flashcards } from '../data/flashcards.js';
import {
  classifyTopics,
  getRecommendedTopics,
  buildStudyRecommendations,
  getTopicStats,
} from '../utils/adaptiveLearning.js';
import { todayDateString } from '../utils/seededRandom.js';

export default function Dashboard({ stats, onNavigate }) {
  const accuracy =
    stats.totalQuestions > 0 ? Math.round((stats.totalCorrect / stats.totalQuestions) * 100) : 0;

  const topicStats = getTopicStats();
  const cls = classifyTopics(topicStats);
  const recs = getRecommendedTopics(4, topicStats);
  const advice = buildStudyRecommendations(topicStats, 3);

  const today = todayDateString();
  const dailyDone = stats.lastDailyDate === today;

  return (
    <div className="space-y-8 animate-fade-up">
      {/* Hero card */}
      <section className="card-dark relative overflow-hidden p-8 sm:p-10">
        <div className="absolute -right-20 -top-16 h-64 w-64 rounded-full bg-brand-500/30 blur-3xl" aria-hidden="true" />
        <div className="absolute -left-10 -bottom-10 h-48 w-48 rounded-full bg-brand-800/40 blur-3xl" aria-hidden="true" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-200">
              <span className="h-2 w-2 rounded-full bg-brand-400" />
              Welcome back
            </div>
            <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
              Master AP CSP, <span className="text-brand-400">one question at a time.</span>
            </h1>
            <p className="mt-3 text-sm text-ink-200">
              Adaptive quizzes pull more from the topics you struggle with.
              Daily challenges build streaks. Mini games sharpen specific skills.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button className="btn-primary" onClick={() => onNavigate('practice-setup')}>
                Start Practice <span aria-hidden>→</span>
              </button>
              <button
                className="rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 text-sm font-medium text-white hover:bg-white/10"
                onClick={() => onNavigate('daily')}
              >
                {dailyDone ? "Today's daily — done ✓" : "Today's daily challenge"}
              </button>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center lg:text-right">
            <SummaryStat value={`${stats.totalPoints}`} label="Total Points" />
            <SummaryStat value={`${accuracy}%`} label="Mastery" highlight />
            <SummaryStat value={`${stats.dailyStreak}`} label="Day Streak" />
          </div>
        </div>
      </section>

      {/* Quick stats */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Metric value={stats.bestScore} label="Best Score" />
        <Metric value={stats.totalQuizzes} label="Quizzes Taken" />
        <Metric value={stats.totalQuestions} label="Questions Answered" />
        <Metric value={stats.totalCorrect} label="Correct" />
      </section>

      {/* Mode grid */}
      <section>
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="section-title">Study Modes</h2>
          <span className="text-xs text-ink-400">
            {questions.length} questions · {flashcards.length} cards
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <ModeCard
            tag="01" title="Practice Mode"
            desc="Adaptive quizzes that target your weak topics. Choose 5, 10, 20, Survival, or Focus mode."
            cta="Start practice" onClick={() => onNavigate('practice-setup')}
            highlight
          />
          <ModeCard
            tag="02" title="Exam Simulation"
            desc="Full 70-question AP-style test. Timed. No instant feedback. Section breakdown at the end."
            cta="Begin exam" onClick={() => onNavigate('exam')}
          />
          <ModeCard
            tag="03" title="Daily Challenge"
            desc="Five questions seeded by today. Same set worldwide. Build a daily streak."
            cta={dailyDone ? "Replay (no streak update)" : "Start today"}
            onClick={() => onNavigate('daily')}
          />
          <ModeCard
            tag="04" title="Flashcards"
            desc="55+ vocab cards with flip, shuffle, and known tracking. Quick warm-up."
            cta="Open deck" onClick={() => onNavigate('flashcards')}
          />
          <ModeCard
            tag="05" title="Mini Games"
            desc="Binary Rush · Algorithm Order · Bug Hunt · Logic Gate. Each targets a key skill."
            cta="Play" onClick={() => onNavigate('games')}
          />
          <ModeCard
            tag="06" title="Stats & Mastery"
            desc="Per-topic mastery, points, accuracy, and game high scores."
            cta="View stats" onClick={() => onNavigate('stats')}
          />
        </div>
      </section>

      {/* Topics + recommendations */}
      <section className="grid gap-6 lg:grid-cols-3">
        <div className="card p-6 lg:col-span-2">
          <div className="flex items-baseline justify-between">
            <h3 className="section-title">Topic Mastery</h3>
            <span className="text-xs text-ink-400">
              {cls.weak.length} weak · {cls.medium.length} medium · {cls.strong.length} strong · {cls.unseen.length} unseen
            </span>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <TopicGroup label="Weak" topics={cls.weak} stats={topicStats} tone="weak" empty="No weak topics yet — keep practicing." />
            <TopicGroup label="Medium" topics={cls.medium} stats={topicStats} tone="medium" empty="No medium topics yet." />
            <TopicGroup label="Strong" topics={cls.strong} stats={topicStats} tone="strong" empty="Earn 76%+ accuracy to land here." />
            <TopicGroup label="Not yet practiced" topics={cls.unseen} stats={topicStats} tone="unseen" empty="All topics attempted!" />
          </div>
        </div>

        <div className="space-y-4">
          <div className="card p-6">
            <h3 className="section-title">Study Recommendations</h3>
            <ul className="mt-4 space-y-3">
              {advice.map((a, i) => (
                <li key={i} className="rounded-xl border border-ink-100 bg-ink-50 p-3">
                  <div className="text-sm font-semibold text-ink-900">{a.title}</div>
                  <div className="mt-1 text-xs text-ink-500">{a.detail}</div>
                </li>
              ))}
            </ul>
            <button className="btn-ghost mt-4 w-full" onClick={() => onNavigate('practice-setup')}>
              Build me a quiz →
            </button>
          </div>

          <div className="card p-6">
            <h3 className="section-title">Next focus</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {recs.length === 0 && <span className="text-sm text-ink-500">Practice a few questions and we'll pick targets for you.</span>}
              {recs.map((r) => (
                <span
                  key={r.topic}
                  className={`pill ${r.reason === 'weak' ? 'pill-red' : r.reason === 'review' ? 'pill-amber' : r.reason === 'strong' ? 'pill-green' : ''}`}
                >
                  {r.topic}
                  <span className="text-[10px] opacity-70">
                    {r.attempts > 0 ? `${r.accuracy}%` : 'new'}
                  </span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <p className="text-center text-xs text-ink-400">
        Add questions in <code className="rounded bg-ink-100 px-1.5 py-0.5">src/data/questions.js</code> ·
        flashcards in <code className="rounded bg-ink-100 px-1.5 py-0.5">src/data/flashcards.js</code> ·
        new games in <code className="rounded bg-ink-100 px-1.5 py-0.5">src/components/games/</code>.
      </p>
    </div>
  );
}

function SummaryStat({ value, label, highlight }) {
  return (
    <div className="min-w-[88px]">
      <div className={`text-2xl font-extrabold ${highlight ? 'text-brand-400' : 'text-white'}`}>{value}</div>
      <div className="text-[11px] uppercase tracking-wider text-ink-300">{label}</div>
    </div>
  );
}

function Metric({ value, label }) {
  return (
    <div className="card p-4">
      <div className="text-xs uppercase tracking-wider text-ink-400">{label}</div>
      <div className="mt-1 text-2xl font-extrabold text-ink-900">{value}</div>
    </div>
  );
}

function ModeCard({ tag, title, desc, cta, onClick, highlight }) {
  return (
    <button
      onClick={onClick}
      className={`group card relative flex flex-col items-start gap-3 p-6 text-left transition hover:-translate-y-0.5 hover:shadow-pop
        ${highlight ? 'ring-2 ring-brand-400/40' : ''}`}
    >
      <span className="font-mono text-xs font-semibold tracking-[0.2em] text-brand-600">{tag}</span>
      <h3 className="text-lg font-bold text-ink-900">{title}</h3>
      <p className="text-sm leading-relaxed text-ink-500">{desc}</p>
      <span className="mt-auto inline-flex items-center gap-1 text-sm font-semibold text-brand-600">
        {cta}
        <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
      </span>
    </button>
  );
}

function TopicGroup({ label, topics, stats, tone, empty }) {
  const tones = {
    weak:    'border-bad-500/30 bg-bad-500/5',
    medium:  'border-amber-300/40 bg-amber-50',
    strong:  'border-good-500/30 bg-good-500/5',
    unseen:  'border-ink-200 bg-ink-50',
  };
  const labelTones = {
    weak: 'text-bad-600',
    medium: 'text-amber-700',
    strong: 'text-good-600',
    unseen: 'text-ink-500',
  };
  return (
    <div className={`rounded-xl border ${tones[tone]} p-4`}>
      <div className={`text-xs font-semibold uppercase tracking-wider ${labelTones[tone]}`}>{label}</div>
      {topics.length === 0 ? (
        <div className="mt-2 text-xs text-ink-500">{empty}</div>
      ) : (
        <ul className="mt-2 space-y-2">
          {topics.slice(0, 5).map((t) => {
            const s = stats[t] || { accuracy: 0, attempts: 0 };
            return (
              <li key={t} className="space-y-1">
                <div className="flex items-baseline justify-between text-sm">
                  <span className="font-medium text-ink-800">{t}</span>
                  <span className="text-xs text-ink-500">
                    {s.attempts > 0 ? `${s.accuracy}%` : 'new'}
                  </span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${s.attempts > 0 ? s.accuracy : 0}%` }} />
                </div>
              </li>
            );
          })}
          {topics.length > 5 && (
            <li className="text-[11px] text-ink-400">+{topics.length - 5} more</li>
          )}
        </ul>
      )}
    </div>
  );
}
