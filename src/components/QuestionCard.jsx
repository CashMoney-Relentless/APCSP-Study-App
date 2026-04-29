import React from 'react';

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

export default function QuestionCard({
  question,
  index,
  total,
  selectedIndex,
  isLocked,
  onSelect,
}) {
  return (
    <div className="question-card">
      <div className="question-meta">
        <span className="topic-chip">{question.topic}</span>
        <span className={`difficulty-chip diff-${question.difficulty}`}>
          {question.difficulty}
        </span>
        <span className="q-counter">
          Question {index + 1} / {total}
        </span>
      </div>

      <div className="question-text">{question.question}</div>

      {question.codeSnippet && (
        <pre className="code-block" aria-label="AP CSP pseudocode">
          <code>{question.codeSnippet}</code>
        </pre>
      )}

      <div className="choices-grid">
        {question.choices.map((choice, i) => {
          const isCorrect = i === question.correctAnswer;
          const isPicked = i === selectedIndex;

          let cls = 'choice-btn';
          if (isLocked) {
            if (isCorrect) cls += ' choice-correct';
            else if (isPicked) cls += ' choice-wrong';
            else cls += ' choice-faded';
          } else if (isPicked) {
            cls += ' choice-selected';
          }

          return (
            <button
              key={i}
              className={cls}
              disabled={isLocked}
              onClick={() => onSelect(i)}
            >
              <span className="choice-letter">{LETTERS[i]}</span>
              <span className="choice-text">{choice}</span>
            </button>
          );
        })}
      </div>

      {isLocked && (
        <div
          className={`explanation ${
            selectedIndex === question.correctAnswer ? 'good' : 'bad'
          }`}
        >
          <strong>
            {selectedIndex === question.correctAnswer
              ? '✅ Correct!'
              : '❌ Not quite.'}
          </strong>{' '}
          {question.explanation}
        </div>
      )}
    </div>
  );
}
