import React from 'react';

function gradeFor(pct) {
  if (pct >= 90) return { label: 'Master', color: 'grade-master', emoji: '🏆' };
  if (pct >= 75) return { label: 'Strong', color: 'grade-strong', emoji: '💪' };
  if (pct >= 60) return { label: 'Needs Practice', color: 'grade-mid', emoji: '📘' };
  return { label: 'Review Needed', color: 'grade-low', emoji: '🛠️' };
}

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

export default function Results({ result, onRetry, onHome }) {
  const { score, correct, total, accuracy, history, mode, plan } = result;
  const grade = gradeFor(accuracy);
  const missed = history.filter((h) => !h.isCorrect);

  return (
    <section className="results">
      <div className={`results-hero ${grade.color}`}>
        <div className="results-emoji">{grade.emoji}</div>
        <div className="results-grade">{grade.label}</div>
        <div className="results-score">{score} pts</div>
        <div className="results-meta">
          {correct} / {total} correct · {accuracy}% accuracy
        </div>
      </div>

      <div className="results-actions">
        <button className="primary-btn" onClick={onRetry}>
          {mode === 'daily' ? 'Back to daily' : 'Try another quiz'}
        </button>
        <button className="ghost-btn" onClick={onHome}>
          Home
        </button>
      </div>

      {plan && plan.adaptive && plan.usedTopics && (
        <div className="plan-card">
          <div className="plan-head">
            <span className="plan-mode on">Adaptive plan used</span>
            <span className="plan-reason">
              Targeted {plan.targetCounts.weak} weak · {plan.targetCounts.medium} medium · {plan.targetCounts.strong} strong
            </span>
          </div>
          <div className="class-row">
            <span className="class-label">Topics</span>
            <div className="class-tags">
              {Object.entries(plan.usedTopics)
                .sort((a, b) => b[1] - a[1])
                .map(([t, n]) => (
                  <span key={t} className="class-tag">
                    {t} · {n}
                  </span>
                ))}
            </div>
          </div>
        </div>
      )}

      <div className="review-section">
        <h3 className="section-title">Review</h3>
        {history.length === 0 && <p>No questions answered.</p>}

        <div className="review-list">
          {history.map((h, idx) => {
            const q = h.question;
            return (
              <div
                key={q.id + idx}
                className={`review-item ${h.isCorrect ? 'good' : 'bad'}`}
              >
                <div className="review-head">
                  <span className="review-num">Q{idx + 1}</span>
                  <span className="topic-chip">{q.topic}</span>
                  <span className={`difficulty-chip diff-${q.difficulty}`}>
                    {q.difficulty}
                  </span>
                  <span className="review-status">
                    {h.isCorrect ? `✅ +${h.points}` : '❌'}
                  </span>
                </div>
                <div className="review-q">{q.question}</div>
                {q.codeSnippet && (
                  <pre className="code-block small">
                    <code>{q.codeSnippet}</code>
                  </pre>
                )}
                <div className="review-answers">
                  <div>
                    <strong>Correct:</strong>{' '}
                    <span className="answer-good">
                      {LETTERS[q.correctAnswer]}. {q.choices[q.correctAnswer]}
                    </span>
                  </div>
                  {!h.isCorrect && h.selected != null && (
                    <div>
                      <strong>Your answer:</strong>{' '}
                      <span className="answer-bad">
                        {LETTERS[h.selected]}. {q.choices[h.selected]}
                      </span>
                    </div>
                  )}
                </div>
                <div className="review-explain">{q.explanation}</div>
              </div>
            );
          })}
        </div>
      </div>

      {missed.length > 0 && (
        <div className="missed-summary">
          <h3 className="section-title">Topics to revisit</h3>
          <div className="topic-tag-row">
            {Array.from(new Set(missed.map((m) => m.question.topic))).map((t) => (
              <span key={t} className="topic-chip large">{t}</span>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
