import React from 'react';

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

export default function QuestionCard({
  question,
  index,
  total,
  selectedIndex,
  isLocked,
  showFeedback = true,
  onSelect,
}) {
  return (
    <div className="card animate-fade-up p-6 sm:p-8">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="pill-blue">{question.topic}</span>
        <span className={`pill ${diffClass(question.difficulty)}`}>{question.difficulty}</span>
        {question.section && <span className="pill">{question.section}</span>}
        <span className="ml-auto text-xs uppercase tracking-wider text-ink-400">
          Q {index + 1} / {total}
        </span>
      </div>

      <div className="text-lg font-semibold leading-relaxed text-ink-900">
        {question.question}
      </div>

      {question.codeSnippet && (
        <pre className="code-block mt-4">
          <code>{question.codeSnippet}</code>
        </pre>
      )}

      <div className="mt-5 grid grid-cols-1 gap-2.5">
        {question.choices.map((choice, i) => {
          const cls = ['choice'];
          const isCorrect = i === question.correctAnswer;
          const isPicked = i === selectedIndex;
          if (isLocked && showFeedback) {
            if (isCorrect) cls.push('is-correct');
            else if (isPicked) cls.push('is-wrong');
            else cls.push('is-faded');
          } else if (isPicked) {
            cls.push('is-selected');
          }
          return (
            <button
              key={i}
              className={cls.join(' ')}
              disabled={isLocked}
              onClick={() => onSelect(i)}
            >
              <span className="choice-letter">{LETTERS[i]}</span>
              <span className="flex-1 text-sm">{choice}</span>
            </button>
          );
        })}
      </div>

      {isLocked && showFeedback && (
        <div
          className={`mt-4 animate-fade-up rounded-xl border p-3 text-sm leading-relaxed
            ${selectedIndex === question.correctAnswer
              ? 'border-good-500/30 bg-good-500/10 text-good-600'
              : 'border-bad-500/30 bg-bad-500/10 text-bad-600'}`}
        >
          <strong className="font-semibold">
            {selectedIndex === question.correctAnswer ? '✅ Correct!' : '❌ Not quite.'}
          </strong>{' '}
          <span className="text-ink-800">{question.explanation}</span>
        </div>
      )}
    </div>
  );
}

function diffClass(d) {
  if (d === 'easy')   return 'pill-green';
  if (d === 'hard')   return 'pill-red';
  return 'pill-amber';
}
