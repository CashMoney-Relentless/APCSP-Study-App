import React from 'react';
import { questions } from '../data/questions.js';
import { flashcards } from '../data/flashcards.js';
import { todaySeedString } from '../utils/random.js';

export default function Home({ stats, onStartPractice, onDaily, onFlashcards, onStats }) {
  const accuracy =
    stats.totalQuestions > 0
      ? Math.round((stats.totalCorrect / stats.totalQuestions) * 100)
      : 0;

  const today = todaySeedString();
  const dailyDone = stats.lastDailyDate === today;

  return (
    <section className="home">
      <div className="hero-card">
        <div className="hero-text">
          <div className="hero-eyebrow">
            <span className="dot" /> Welcome back
          </div>
          <h1 className="hero-title">
            Master <span className="accent">AP CSP</span><br />
            one question at a time.
          </h1>
          <p className="hero-sub">
            <span className="code-tag">&lt;study/&gt;</span> Practice quizzes, daily challenges,
            and flashcards built around the official AP Computer Science Principles topics.
          </p>
          <div className="hero-actions">
            <button className="primary-btn" onClick={onStartPractice}>
              Start Practice
            </button>
            <button className="link-btn" onClick={onDaily}>
              {dailyDone ? "Today's daily — done ✓" : "Today's daily challenge →"}
            </button>
          </div>
        </div>
        <div className="hero-side" aria-hidden="true">
          <div className="hero-glyph">
            <pre>{`PROCEDURE Study()\n{\n  WHILE (curious)\n  {\n    learn()\n    practice()\n  }\n}`}</pre>
          </div>
        </div>
      </div>

      <div className="metrics-row">
        <Metric value={`${stats.bestScore}`} label="Best Score" />
        <Metric value={`${stats.totalQuestions}`} label="Questions Answered" />
        <Metric value={`${accuracy}%`} label="Avg Accuracy" />
        <Metric value={`${stats.dailyStreak}`} label="Day Streak" highlight />
      </div>

      <div className="services">
        <div className="services-head">
          <h2 className="services-title">Study Modes</h2>
          <span className="services-meta">
            {questions.length} questions · {flashcards.length} cards
          </span>
        </div>

        <div className="services-grid">
          <ServiceCard
            tag="01"
            title="Practice Quizzes"
            desc="Choose 5, 10, or 20 questions. Question order and answer choices randomize every attempt so you never just memorize the position."
            cta="Start Practice"
            onClick={onStartPractice}
          />
          <ServiceCard
            tag="02"
            title="Daily Challenge"
            desc="Five questions, seeded by today's date. Build a streak by completing one each day. Same set worldwide on the same date."
            cta={dailyDone ? "Replay today" : "Begin today"}
            onClick={onDaily}
          />
          <ServiceCard
            tag="03"
            title="Flashcards"
            desc="Vocabulary review with flip animation, shuffle, and a known counter. Perfect quick warm-up before a quiz."
            cta="Open deck"
            onClick={onFlashcards}
          />
          <ServiceCard
            tag="04"
            title="Stats & Mastery"
            desc="Track best score, accuracy, total questions answered, and per-topic mastery. All saved locally — no backend."
            cta="View stats"
            onClick={onStats}
          />
        </div>
      </div>

      <div className="footnote">
        Easily expand the question bank in <code>src/data/questions.js</code>.
      </div>
    </section>
  );
}

function Metric({ value, label, highlight }) {
  return (
    <div className={`metric ${highlight ? 'metric-highlight' : ''}`}>
      <div className="metric-value">{value}</div>
      <div className="metric-label">{label}</div>
    </div>
  );
}

function ServiceCard({ tag, title, desc, cta, onClick }) {
  return (
    <article className="service-card">
      <div className="service-tag">{tag}</div>
      <h3 className="service-title">{title}</h3>
      <p className="service-desc">{desc}</p>
      <button className="service-cta" onClick={onClick}>
        {cta} <span aria-hidden="true">→</span>
      </button>
    </article>
  );
}
