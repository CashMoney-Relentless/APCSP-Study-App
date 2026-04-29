import React, { useEffect, useMemo, useState } from 'react';
import { recordGameScore } from '../../utils/storage.js';
import { POINTS } from '../../utils/scoring.js';

// Pick the line containing the bug. Each puzzle: lines + bugLine (1-indexed).

const BUGS = [
  {
    title: 'Counting positive numbers',
    lines: [
      'count ← 0',
      'FOR EACH x IN list',
      '  IF (x ≥ 0)',
      '    count ← count + 1',
      'RETURN count',
    ],
    bugLine: 3,
    explanation: 'IF (x ≥ 0) wrongly includes 0 as positive. It should be IF (x > 0).',
  },
  {
    title: 'Average of a list',
    lines: [
      'sum ← 0',
      'FOR EACH n IN list',
      '  sum ← sum + n',
      'avg ← sum * LENGTH(list)',
      'RETURN avg',
    ],
    bugLine: 4,
    explanation: 'avg should be sum / LENGTH(list), not multiplied.',
  },
  {
    title: 'Find the maximum',
    lines: [
      'best ← 0',
      'FOR EACH x IN list',
      '  IF (x > best)',
      '    best ← x',
      'RETURN best',
    ],
    bugLine: 1,
    explanation: 'Initializing best to 0 fails for all-negative lists. Use list[1] as the seed.',
  },
  {
    title: 'Linear search',
    lines: [
      'i ← 0',
      'REPEAT UNTIL (i > LENGTH(list))',
      '  IF (list[i] = target)',
      '    RETURN i',
      '  i ← i + 1',
    ],
    bugLine: 1,
    explanation: 'AP CSP lists are 1-indexed. Start i at 1, not 0.',
  },
  {
    title: 'Doubling each element',
    lines: [
      'FOR i ← 1 TO LENGTH(list)',
      '  list[i] ← list[i] + 2',
      'RETURN list',
    ],
    bugLine: 2,
    explanation: 'Adding 2 is not doubling. Should be list[i] ← list[i] * 2.',
  },
  {
    title: 'Even / odd label',
    lines: [
      'IF (n MOD 2 = 1)',
      '  DISPLAY("even")',
      'ELSE',
      '  DISPLAY("odd")',
    ],
    bugLine: 1,
    explanation: 'n MOD 2 = 1 actually identifies odd numbers; the labels are swapped (or the condition should be MOD 2 = 0).',
  },
  {
    title: 'Sum of even numbers',
    lines: [
      'total ← 0',
      'FOR EACH x IN list',
      '  IF (x MOD 2 = 0)',
      '    total ← x',
      'RETURN total',
    ],
    bugLine: 4,
    explanation: 'total ← x overwrites instead of summing. Should be total ← total + x.',
  },
];

export default function BugHunt({ onExit }) {
  const [phase, setPhase] = useState('intro');
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [lives, setLives] = useState(3);
  const [feedback, setFeedback] = useState(null);

  const puzzle = BUGS[idx % BUGS.length];

  function pick(i) {
    if (picked != null) return;
    const isCorrect = i + 1 === puzzle.bugLine;
    setPicked(i);

    if (isCorrect) {
      const earn = POINTS.CORRECT + POINTS.GAME_BONUS;
      const nextStreak = streak + 1;
      const bonus = nextStreak % 5 === 0 ? POINTS.STREAK_5_BONUS
                  : nextStreak % 3 === 0 ? POINTS.STREAK_3_BONUS : 0;
      setScore((s) => s + earn + bonus);
      setStreak(nextStreak);
      setFeedback('correct');
    } else {
      setLives((l) => l - 1);
      setStreak(0);
      setFeedback('wrong');
    }
  }

  function next() {
    if (lives <= 0) {
      recordGameScore('bugHunt', score);
      setPhase('over');
      return;
    }
    setPicked(null);
    setFeedback(null);
    setIdx((i) => i + 1);
  }

  useEffect(() => {
    if (lives <= 0 && picked != null) {
      const id = setTimeout(() => {
        recordGameScore('bugHunt', score);
        setPhase('over');
      }, 700);
      return () => clearTimeout(id);
    }
  }, [lives, picked, score]);

  if (phase === 'intro') {
    return (
      <div className="card mx-auto max-w-xl p-8 text-center">
        <div className="text-3xl">🐛</div>
        <h3 className="mt-2 text-xl font-bold text-ink-900">Bug Hunt</h3>
        <p className="mt-2 text-sm text-ink-500">
          Each puzzle has one buggy line. Click the line you think is wrong.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <button className="btn-primary" onClick={() => setPhase('playing')}>Start</button>
          <button className="btn-ghost" onClick={onExit}>Back</button>
        </div>
      </div>
    );
  }

  if (phase === 'over') {
    return (
      <div className="card mx-auto max-w-xl p-8 text-center">
        <div className="text-3xl">🏁</div>
        <h3 className="mt-2 text-xl font-bold text-ink-900">Game over</h3>
        <p className="mt-2 text-sm text-ink-500">You scored <strong>{score}</strong> across <strong>{idx + 1}</strong> puzzles.</p>
        <div className="mt-6 flex justify-center gap-3">
          <button className="btn-primary" onClick={() => { setIdx(0); setPicked(null); setFeedback(null); setLives(3); setStreak(0); setScore(0); setPhase('playing'); }}>Play again</button>
          <button className="btn-ghost" onClick={onExit}>Back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="card flex flex-wrap items-center gap-4 px-5 py-4">
        <div className="flex-1">
          <div className="text-base font-bold text-ink-900">{puzzle.title}</div>
          <div className="text-xs uppercase tracking-wider text-ink-400">Puzzle {idx + 1}</div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="pill-red">{'❤'.repeat(lives)}{'🤍'.repeat(3 - lives)}</span>
          <span className="pill"><span className="text-ink-400">pts</span> <span className="text-base font-bold text-brand-700">{score}</span></span>
          <span className={`pill ${streak >= 3 ? 'pill-amber' : ''}`}>🔥 {streak}</span>
          <button className="btn-ghost" onClick={onExit}>Quit</button>
        </div>
      </div>

      <div className="card overflow-hidden p-0">
        <div className="border-b border-ink-100 px-5 py-3 text-xs font-semibold uppercase tracking-wider text-ink-500">
          Click the line that contains the bug
        </div>
        <ul className="divide-y divide-ink-100 font-mono text-sm">
          {puzzle.lines.map((line, i) => {
            const isAnswer = picked != null && (i + 1) === puzzle.bugLine;
            const wasPicked = picked === i;
            return (
              <li
                key={i}
                onClick={() => pick(i)}
                className={`flex cursor-pointer items-center gap-3 px-5 py-2.5 transition
                  ${picked == null ? 'hover:bg-brand-50' : ''}
                  ${isAnswer ? 'bg-good-500/10' : ''}
                  ${wasPicked && !isAnswer ? 'bg-bad-500/10' : ''}`}
              >
                <span className="w-8 text-right text-ink-400">{i + 1}</span>
                <code className="whitespace-pre">{line}</code>
                {isAnswer && <span className="ml-auto text-xs font-semibold text-good-600">bug</span>}
                {wasPicked && !isAnswer && <span className="ml-auto text-xs font-semibold text-bad-600">not it</span>}
              </li>
            );
          })}
        </ul>
      </div>

      {picked != null && (
        <div className={`card p-4 ${feedback === 'correct' ? 'border-good-500/40' : 'border-bad-500/40'} border`}>
          <div className="text-sm font-semibold text-ink-900">{feedback === 'correct' ? '✅ Correct!' : '❌ Off by one — see explanation:'}</div>
          <div className="mt-1 text-sm text-ink-600">{puzzle.explanation}</div>
          <div className="mt-3 flex justify-end">
            <button className="btn-primary" onClick={next}>Next puzzle →</button>
          </div>
        </div>
      )}
    </div>
  );
}
