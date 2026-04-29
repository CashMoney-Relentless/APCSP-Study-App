import React, { useMemo, useState } from 'react';
import { allTopics } from '../data/questions.js';
import {
  classifyTopics,
  generateAdaptiveQuiz,
  getRecommendedTopics,
  getTopicStats,
  MIN_ATTEMPTS_FOR_ADAPTIVE,
  TARGET_DISTRIBUTION,
} from '../utils/adaptiveLearning.js';

const LENGTH_OPTIONS = [
  { id: 'short',  label: 'Short',  count: 5,  desc: '5 questions · quick warm-up' },
  { id: 'medium', label: 'Medium', count: 10, desc: '10 questions · solid review' },
  { id: 'long',   label: 'Long',   count: 20, desc: '20 questions · full session' },
];

const MODES = [
  { id: 'practice',    label: 'Standard',     desc: 'Adaptive practice with explanations after each answer.' },
  { id: 'survival',    label: 'Survival',     desc: '3 lives. Wrong answers cost a life. How far can you get?' },
  { id: 'focus',       label: 'Focus Mode',   desc: 'Only your weak topics. Builds fluency where it matters.' },
  { id: 'mixed',       label: 'Mixed Review', desc: 'Even sample across every topic for broad review.' },
  { id: 'drill',       label: 'Weakness Drill',desc: 'Rapid-fire weak topics with no explanations between.' },
];

export default function QuizSetup({ onStart, onCancel }) {
  const [length, setLength] = useState('medium');
  const [topic, setTopic] = useState('all');
  const [mode, setMode] = useState('practice');
  const [adaptive, setAdaptive] = useState(true);

  const topics = ['all', ...allTopics()];
  const stats = useMemo(() => getTopicStats(), []);
  const cls = useMemo(() => classifyTopics(stats), [stats]);
  const recs = useMemo(() => getRecommendedTopics(4, stats), [stats]);
  const totalAttempts = Object.values(stats).reduce((a, s) => a + s.attempts, 0);

  const lengthCount = LENGTH_OPTIONS.find((o) => o.id === length).count;

  // Mode-specific adjustments
  const isFocusMode = mode === 'focus' || mode === 'drill';
  const isSurvival = mode === 'survival';
  const lengthForMode = isSurvival ? 30 : lengthCount; // survival uses big pool, lives end it
  const adaptiveActive = adaptive && topic === 'all' && !isFocusMode && totalAttempts >= MIN_ATTEMPTS_FOR_ADAPTIVE;

  const focusTopics = useMemo(() => {
    if (cls.weak.length > 0) return cls.weak;
    if (cls.medium.length > 0) return cls.medium;
    return [];
  }, [cls]);

  // Live plan preview (without marking ids as shown)
  const preview = useMemo(() => {
    const opts = {
      adaptive: !isFocusMode && adaptive,
      topic,
      markShown: false,
    };
    if (isFocusMode) opts.topics = focusTopics;
    const r = generateAdaptiveQuiz(undefined, lengthForMode, opts);
    return r.plan;
  }, [topic, adaptive, lengthForMode, isFocusMode, focusTopics]);

  function handleStart() {
    const config = {
      length: lengthForMode,
      topic,
      adaptive,
      mode,
      lives: isSurvival ? 3 : null,
      showInstantFeedback: mode !== 'drill',
      topicSubset: isFocusMode ? focusTopics : null,
    };
    onStart(config);
  }

  return (
    <div className="space-y-6 animate-fade-up">
      <header className="space-y-2">
        <h2 className="section-title">Choose your practice</h2>
        <p className="text-sm text-ink-500">
          The adaptive engine prioritizes the topics you struggle with — flip the toggle below to see the plan change.
        </p>
      </header>

      {/* Length */}
      <section className="card p-5">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-ink-500">Length</h3>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {LENGTH_OPTIONS.map((o) => (
            <button
              key={o.id}
              onClick={() => setLength(o.id)}
              className={`rounded-xl border p-4 text-center transition
                ${length === o.id
                  ? 'border-brand-500 bg-brand-50 ring-2 ring-brand-200'
                  : 'border-ink-200 bg-white hover:border-brand-300 hover:bg-brand-50'}`}
            >
              <div className={`text-3xl font-extrabold ${length === o.id ? 'text-brand-600' : 'text-ink-900'}`}>{o.count}</div>
              <div className="mt-1 text-sm font-semibold text-ink-900">{o.label}</div>
              <div className="mt-1 text-xs text-ink-500">{o.desc}</div>
            </button>
          ))}
        </div>
      </section>

      {/* Mode */}
      <section className="card p-5">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-ink-500">Mode</h3>
        <div className="grid gap-3 md:grid-cols-2">
          {MODES.map((m) => (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className={`rounded-xl border p-4 text-left transition
                ${mode === m.id
                  ? 'border-brand-500 bg-brand-50 ring-2 ring-brand-200'
                  : 'border-ink-200 bg-white hover:border-brand-300 hover:bg-brand-50'}`}
            >
              <div className="flex items-center justify-between">
                <div className="font-semibold text-ink-900">{m.label}</div>
                {m.id === 'survival' && <span className="pill-red">3 lives</span>}
                {m.id === 'focus' && <span className="pill-blue">weak topics</span>}
                {m.id === 'drill' && <span className="pill-amber">rapid-fire</span>}
              </div>
              <div className="mt-1 text-xs text-ink-500">{m.desc}</div>
            </button>
          ))}
        </div>
        {isFocusMode && focusTopics.length === 0 && (
          <p className="mt-3 rounded-lg border border-amber-300 bg-amber-50 p-2 text-xs text-amber-700">
            No weak/medium topics yet — try a few standard practice quizzes first; Focus Mode will then narrow in.
          </p>
        )}
      </section>

      {/* Topic + adaptive */}
      <section className="card p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-ink-500">Topic Focus</h3>
            <p className="mt-1 text-xs text-ink-500">Select a single topic, or leave on All for adaptive selection.</p>
          </div>
          <select
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="input-base max-w-xs"
            disabled={isFocusMode}
          >
            {topics.map((t) => (
              <option key={t} value={t}>{t === 'all' ? 'All topics (recommended)' : t}</option>
            ))}
          </select>
        </div>

        <label className="mt-5 flex cursor-pointer items-center gap-4">
          <span className="relative inline-flex h-6 w-11">
            <input
              type="checkbox"
              className="peer absolute h-0 w-0 opacity-0"
              checked={adaptive}
              onChange={(e) => setAdaptive(e.target.checked)}
              disabled={topic !== 'all' || isFocusMode}
            />
            <span className="absolute inset-0 rounded-full bg-ink-200 transition peer-checked:bg-brand-500 peer-disabled:opacity-50" />
            <span className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition peer-checked:translate-x-5" />
          </span>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-ink-900">Adaptive selection</span>
            <span className="text-xs text-ink-500">
              {topic !== 'all'
                ? 'Disabled in single-topic mode.'
                : isFocusMode
                ? 'Focus / Drill modes already restrict to weak topics.'
                : adaptiveActive
                ? `Weighting: ${pct(TARGET_DISTRIBUTION.weak)} weak · ${pct(TARGET_DISTRIBUTION.medium)} medium · ${pct(TARGET_DISTRIBUTION.strong)} strong`
                : `Activates after ${MIN_ATTEMPTS_FOR_ADAPTIVE} answered questions (you have ${totalAttempts}).`}
            </span>
          </div>
        </label>
      </section>

      {/* Plan preview */}
      <PlanPreview
        plan={preview}
        length={lengthForMode}
        adaptiveActive={adaptiveActive}
        cls={cls}
        recs={recs}
        mode={mode}
      />

      <div className="flex flex-wrap gap-3">
        <button className="btn-primary" onClick={handleStart}>Start quiz →</button>
        <button className="btn-ghost" onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}

function pct(v) { return `${Math.round(v * 100)}%`; }

function PlanPreview({ plan, length, adaptiveActive, cls, recs, mode }) {
  const t = plan?.targetCounts || { weak: 0, medium: 0, strong: 0, fill: 0 };
  const used = plan?.usedTopics || {};
  const usedTopicCount = Object.keys(used).length;
  const fill = Math.max(0, length - (t.weak + t.medium + t.strong));

  return (
    <section className="card p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="section-title">Quiz plan</h3>
        <span className={`pill ${adaptiveActive ? 'pill-blue' : ''}`}>
          {adaptiveActive ? '⚡ Adaptive' : 'Balanced random'}
          {mode !== 'practice' && <span className="ml-1 opacity-70">· {mode}</span>}
        </span>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="space-y-3">
          <Bar label="Weak" count={t.weak} total={length} kind="weak" />
          <Bar label="Medium" count={t.medium} total={length} kind="medium" />
          <Bar label="Strong" count={t.strong} total={length} kind="strong" />
          {fill > 0 && <Bar label="Mix / fill" count={fill} total={length} kind="fill" />}
        </div>

        <div className="space-y-3">
          {usedTopicCount > 0 && (
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-ink-500">Sample plan</div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {Object.entries(used)
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 8)
                  .map(([topic, n]) => (
                    <span key={topic} className="pill">
                      {topic}<span className="opacity-60">·{n}</span>
                    </span>
                  ))}
              </div>
            </div>
          )}
          {recs.length > 0 && (
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-ink-500">Recommended focus</div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {recs.map((r) => (
                  <span
                    key={r.topic}
                    className={`pill ${r.reason === 'weak' ? 'pill-red' : r.reason === 'review' ? 'pill-amber' : r.reason === 'strong' ? 'pill-green' : ''}`}
                  >
                    {r.topic}
                    <span className="text-[10px] opacity-70">{r.attempts > 0 ? `${r.accuracy}%` : 'new'}</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {(cls.weak.length + cls.medium.length + cls.strong.length) > 0 && adaptiveActive && (
        <details className="mt-4 rounded-lg border border-ink-100 bg-ink-50 p-3 text-xs">
          <summary className="cursor-pointer font-semibold text-ink-700">View topic classification</summary>
          <div className="mt-2 space-y-1">
            {[
              ['Weak', cls.weak,   'text-bad-600'],
              ['Medium', cls.medium, 'text-amber-700'],
              ['Strong', cls.strong, 'text-good-600'],
            ].map(([label, list, color]) => list.length > 0 ? (
              <div key={label} className="flex flex-wrap gap-2">
                <span className={`w-16 ${color} font-semibold uppercase tracking-wider`}>{label}</span>
                <span className="text-ink-700">{list.join(', ')}</span>
              </div>
            ) : null)}
          </div>
        </details>
      )}
    </section>
  );
}

function Bar({ label, count, total, kind }) {
  const pctVal = total > 0 ? Math.round((count / total) * 100) : 0;
  const colors = {
    weak: 'bg-bad-500',
    medium: 'bg-amber-500',
    strong: 'bg-good-500',
    fill: 'bg-ink-300',
  };
  return (
    <div>
      <div className="flex items-baseline justify-between text-xs uppercase tracking-wider text-ink-500">
        <span>{label}</span>
        <span><span className="text-base font-bold text-ink-900">{count}</span> · {pctVal}%</span>
      </div>
      <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-ink-100">
        <div className={`h-full rounded-full ${colors[kind]} transition-all duration-500`} style={{ width: `${pctVal}%` }} />
      </div>
    </div>
  );
}
