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

const LENGTHS = [
  { id: 'short', label: 'Short', count: 5, desc: '5 questions · quick warm-up' },
  { id: 'medium', label: 'Medium', count: 10, desc: '10 questions · solid review' },
  { id: 'long', label: 'Long', count: 20, desc: '20 questions · full session' },
];

export default function QuizSetup({ onStart, onCancel }) {
  const [selected, setSelected] = useState('medium');
  const [topic, setTopic] = useState('all');
  const [adaptive, setAdaptive] = useState(true);

  const topics = ['all', ...allTopics()];

  const stats = useMemo(() => getTopicStats(), []);
  const classification = useMemo(() => classifyTopics(stats), [stats]);
  const totalAttempts = Object.values(stats).reduce((a, s) => a + s.attempts, 0);
  const recs = useMemo(() => getRecommendedTopics(4, stats), [stats]);
  const isAdaptiveActive =
    adaptive && topic === 'all' && totalAttempts >= MIN_ATTEMPTS_FOR_ADAPTIVE;

  const length = LENGTHS.find((l) => l.id === selected).count;

  // Dry-run the engine to preview the plan WITHOUT marking ids as shown.
  const preview = useMemo(() => {
    const r = generateAdaptiveQuiz(undefined, length, {
      adaptive,
      topic,
      markShown: false,
    });
    return r.plan;
  }, [length, adaptive, topic]);

  function handleStart() {
    onStart({ length, topic, adaptive });
  }

  return (
    <section className="setup">
      <h2 className="section-title">Choose your practice</h2>
      <p className="section-sub">
        Pick a length. The adaptive engine picks more questions from the topics you've struggled with.
      </p>

      <div className="length-grid">
        {LENGTHS.map((l) => (
          <button
            key={l.id}
            className={`length-card ${selected === l.id ? 'selected' : ''}`}
            onClick={() => setSelected(l.id)}
          >
            <div className="length-count">{l.count}</div>
            <div className="length-label">{l.label}</div>
            <div className="length-desc">{l.desc}</div>
          </button>
        ))}
      </div>

      <div className="topic-row">
        <label htmlFor="topic-select">Topic focus</label>
        <select
          id="topic-select"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        >
          {topics.map((t) => (
            <option key={t} value={t}>
              {t === 'all' ? 'All topics (recommended)' : t}
            </option>
          ))}
        </select>
      </div>

      <div className="adaptive-row">
        <label className="switch">
          <input
            type="checkbox"
            checked={adaptive}
            onChange={(e) => setAdaptive(e.target.checked)}
            disabled={topic !== 'all'}
          />
          <span className="switch-track" aria-hidden="true">
            <span className="switch-thumb" />
          </span>
          <span className="switch-label">
            <strong>Adaptive selection</strong>
            <span className="switch-sub">
              {topic !== 'all'
                ? 'Disabled for single-topic practice.'
                : isAdaptiveActive
                ? `Weighting: ${pct(TARGET_DISTRIBUTION.weak)} weak / ${pct(TARGET_DISTRIBUTION.medium)} medium / ${pct(TARGET_DISTRIBUTION.strong)} strong`
                : `Will turn on after ${MIN_ATTEMPTS_FOR_ADAPTIVE} answered questions (you have ${totalAttempts}).`}
            </span>
          </span>
        </label>
      </div>

      <PlanPreview
        plan={preview}
        length={length}
        adaptiveActive={isAdaptiveActive}
        classification={classification}
        recs={recs}
      />

      <div className="setup-actions">
        <button className="primary-btn" onClick={handleStart}>
          Start quiz →
        </button>
        <button className="ghost-btn" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </section>
  );
}

function pct(v) {
  return `${Math.round(v * 100)}%`;
}

function PlanPreview({ plan, length, adaptiveActive, classification, recs }) {
  const target = plan?.targetCounts || { weak: 0, medium: 0, strong: 0, fill: 0 };
  const totalTargeted = target.weak + target.medium + target.strong;
  const fill = Math.max(0, length - totalTargeted);

  return (
    <div className="plan-card">
      <div className="plan-head">
        <span className={`plan-mode ${adaptiveActive ? 'on' : 'off'}`}>
          {adaptiveActive ? 'Adaptive plan' : 'Balanced random'}
        </span>
        {!adaptiveActive && plan?.reason && (
          <span className="plan-reason">{humanReason(plan.reason)}</span>
        )}
      </div>

      <div className="plan-bars" aria-label="Planned distribution">
        <Bar label="Weak" count={target.weak} total={length} kind="weak" />
        <Bar label="Medium" count={target.medium} total={length} kind="medium" />
        <Bar label="Strong" count={target.strong} total={length} kind="strong" />
        {fill > 0 && (
          <Bar label="Mix" count={fill} total={length} kind="fill" />
        )}
      </div>

      {adaptiveActive && (
        <div className="plan-classification">
          <ClassRow label="Weak" topics={classification.weak} kind="weak" />
          <ClassRow label="Medium" topics={classification.medium} kind="medium" />
          <ClassRow label="Strong" topics={classification.strong} kind="strong" />
        </div>
      )}

      {recs.length > 0 && (
        <div className="plan-recs">
          <div className="plan-recs-label">Recommended focus</div>
          <div className="plan-recs-row">
            {recs.map((r) => (
              <span key={r.topic} className={`rec-chip rec-${r.reason}`}>
                {r.topic}
                <span className="rec-meta">
                  {r.attempts > 0 ? `${r.accuracy}%` : 'new'}
                </span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function humanReason(reason) {
  if (reason.startsWith('insufficient-history')) {
    return 'Need more practice data to enable adaptive mode.';
  }
  if (reason.startsWith('single-topic')) return 'Single-topic mode';
  if (reason === 'adaptive-disabled') return 'Adaptive turned off';
  return reason;
}

function Bar({ label, count, total, kind }) {
  const pctVal = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className={`plan-bar plan-bar-${kind}`}>
      <div className="plan-bar-head">
        <span>{label}</span>
        <span className="plan-bar-count">
          <strong>{count}</strong>
          <span className="plan-bar-pct">{pctVal}%</span>
        </span>
      </div>
      <div className="plan-bar-track">
        <div className="plan-bar-fill" style={{ width: `${pctVal}%` }} />
      </div>
    </div>
  );
}

function ClassRow({ label, topics, kind }) {
  if (topics.length === 0) return null;
  return (
    <div className={`class-row class-${kind}`}>
      <span className="class-label">{label}</span>
      <div className="class-tags">
        {topics.map((t) => (
          <span key={t} className="class-tag">{t}</span>
        ))}
      </div>
    </div>
  );
}
