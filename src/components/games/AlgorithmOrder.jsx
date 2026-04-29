import React, { useEffect, useMemo, useState } from 'react';
import { recordGameScore } from '../../utils/storage.js';
import { POINTS } from '../../utils/scoring.js';
import { shuffle } from '../../utils/seededRandom.js';

// Reorder shuffled pseudocode lines into the correct order.
// Each puzzle = ordered array of 4-6 steps with a short title.

const PUZZLES = [
  {
    title: 'Find the maximum of a list',
    steps: [
      'best ← list[1]',
      'FOR EACH x IN list',
      '  IF (x > best)',
      '    best ← x',
      'RETURN best',
    ],
  },
  {
    title: 'Count even numbers',
    steps: [
      'count ← 0',
      'FOR EACH x IN list',
      '  IF (x MOD 2 = 0)',
      '    count ← count + 1',
      'RETURN count',
    ],
  },
  {
    title: 'Sum of squares',
    steps: [
      'total ← 0',
      'FOR EACH n IN list',
      '  total ← total + (n * n)',
      'DISPLAY(total)',
    ],
  },
  {
    title: 'Linear search',
    steps: [
      'i ← 1',
      'REPEAT UNTIL (i > LENGTH(list))',
      '  IF (list[i] = target)',
      '    RETURN i',
      '  i ← i + 1',
      'RETURN -1',
    ],
  },
  {
    title: 'Reverse a list (in place)',
    steps: [
      'i ← 1',
      'j ← LENGTH(list)',
      'REPEAT UNTIL (i ≥ j)',
      '  tmp ← list[i]; list[i] ← list[j]; list[j] ← tmp',
      '  i ← i + 1; j ← j - 1',
    ],
  },
  {
    title: 'Average of a list',
    steps: [
      'sum ← 0',
      'FOR EACH x IN list',
      '  sum ← sum + x',
      'avg ← sum / LENGTH(list)',
      'RETURN avg',
    ],
  },
  {
    title: 'Greet a user',
    steps: [
      'INPUT name',
      'IF (name ≠ "")',
      '  DISPLAY("Hello, " + name)',
      'ELSE',
      '  DISPLAY("Hello!")',
    ],
  },
];

export default function AlgorithmOrder({ onExit }) {
  const [phase, setPhase] = useState('intro');
  const [puzzleIdx, setPuzzleIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [streak, setStreak] = useState(0);
  const [feedback, setFeedback] = useState(null); // 'correct' | 'wrong'
  const puzzle = PUZZLES[puzzleIdx % PUZZLES.length];
  const [items, setItems] = useState(() => shuffle(puzzle.steps.map((s, i) => ({ id: i, text: s }))));

  useEffect(() => {
    const next = PUZZLES[puzzleIdx % PUZZLES.length];
    setItems(shuffle(next.steps.map((s, i) => ({ id: i, text: s }))));
    setFeedback(null);
  }, [puzzleIdx]);

  function moveUp(i) {
    if (i === 0) return;
    setItems((arr) => {
      const next = arr.slice();
      [next[i - 1], next[i]] = [next[i], next[i - 1]];
      return next;
    });
  }
  function moveDown(i) {
    if (i === items.length - 1) return;
    setItems((arr) => {
      const next = arr.slice();
      [next[i + 1], next[i]] = [next[i], next[i + 1]];
      return next;
    });
  }

  function check() {
    const expected = puzzle.steps;
    const isCorrect = items.every((it, idx) => it.text === expected[idx]);
    if (isCorrect) {
      const earn = POINTS.CORRECT + POINTS.GAME_BONUS;
      const nextStreak = streak + 1;
      const bonus = nextStreak % 5 === 0 ? POINTS.STREAK_5_BONUS
                  : nextStreak % 3 === 0 ? POINTS.STREAK_3_BONUS : 0;
      setScore((s) => s + earn + bonus);
      setStreak(nextStreak);
      setFeedback('correct');
      setTimeout(() => setPuzzleIdx((p) => p + 1), 700);
    } else {
      const livesLeft = lives - 1;
      setLives(livesLeft);
      setStreak(0);
      setFeedback('wrong');
      if (livesLeft <= 0) {
        setTimeout(() => {
          recordGameScore('algorithmOrder', score);
          setPhase('over');
        }, 600);
      }
    }
  }

  if (phase === 'intro') {
    return (
      <div className="card mx-auto max-w-xl p-8 text-center">
        <div className="text-3xl">🧩</div>
        <h3 className="mt-2 text-xl font-bold text-ink-900">Algorithm Order</h3>
        <p className="mt-2 text-sm text-ink-500">
          Reorder the shuffled pseudocode steps. 3 lives. Use ↑/↓ buttons or move items, then check.
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
        <p className="mt-2 text-sm text-ink-500">You scored <strong>{score}</strong> points across <strong>{puzzleIdx}</strong> puzzles.</p>
        <div className="mt-6 flex justify-center gap-3">
          <button className="btn-primary" onClick={() => { setPhase('playing'); setScore(0); setLives(3); setStreak(0); setPuzzleIdx(0); }}>Play again</button>
          <button className="btn-ghost" onClick={onExit}>Back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="card flex flex-wrap items-center gap-4 px-5 py-4">
        <div className="flex-1 min-w-[160px]">
          <div className="text-base font-bold text-ink-900">{puzzle.title}</div>
          <div className="text-xs uppercase tracking-wider text-ink-400">Puzzle {puzzleIdx + 1}</div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="pill-red">{'❤'.repeat(lives)}{'🤍'.repeat(3 - lives)}</span>
          <span className="pill"><span className="text-ink-400">pts</span> <span className="text-base font-bold text-brand-700">{score}</span></span>
          <span className={`pill ${streak >= 3 ? 'pill-amber' : ''}`}>🔥 {streak}</span>
          <button className="btn-ghost" onClick={onExit}>Quit</button>
        </div>
      </div>

      <ul className={`card divide-y divide-ink-100 p-2 ${feedback === 'wrong' ? 'animate-shake' : ''}`}>
        {items.map((it, i) => (
          <li key={it.id} className="flex items-center gap-2 px-3 py-2">
            <span className="grid h-7 w-7 place-items-center rounded-md bg-ink-100 font-mono text-xs font-bold text-ink-500">
              {i + 1}
            </span>
            <code className="flex-1 whitespace-pre font-mono text-sm text-ink-900">{it.text}</code>
            <button onClick={() => moveUp(i)} className="btn-ghost text-xs" disabled={i === 0}>↑</button>
            <button onClick={() => moveDown(i)} className="btn-ghost text-xs" disabled={i === items.length - 1}>↓</button>
          </li>
        ))}
      </ul>

      <div className="flex flex-wrap justify-end gap-2">
        {feedback === 'correct' && <div className="mr-auto text-sm font-semibold text-good-600">✅ Correct! Loading next puzzle…</div>}
        {feedback === 'wrong' && <div className="mr-auto text-sm font-semibold text-bad-600">❌ Try again — order is off.</div>}
        <button className="btn-primary" onClick={check}>Check answer</button>
      </div>
    </div>
  );
}
