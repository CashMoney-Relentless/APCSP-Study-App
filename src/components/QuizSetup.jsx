import React, { useState } from 'react';
import { allTopics } from '../data/questions.js';

const LENGTHS = [
  { id: 'short', label: 'Short', count: 5, desc: '5 questions · quick warm-up' },
  { id: 'medium', label: 'Medium', count: 10, desc: '10 questions · solid review' },
  { id: 'long', label: 'Long', count: 20, desc: '20 questions · full session' },
];

export default function QuizSetup({ onStart, onCancel }) {
  const [selected, setSelected] = useState('medium');
  const [topic, setTopic] = useState('all');
  const topics = ['all', ...allTopics()];

  function handleStart() {
    const choice = LENGTHS.find((l) => l.id === selected);
    onStart({ length: choice.count, topic });
  }

  return (
    <section className="setup">
      <h2 className="section-title">Choose your practice</h2>
      <p className="section-sub">
        Pick a length. Questions and answer choices are randomized every attempt.
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
              {t === 'all' ? 'All topics' : t}
            </option>
          ))}
        </select>
      </div>

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
