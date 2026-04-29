import React, { useMemo, useState } from 'react';
import { recordGameScore } from '../../utils/storage.js';
import { POINTS } from '../../utils/scoring.js';

// Given a truth-table-like input pattern and an expected output, pick which
// operator (AND, OR, XOR, NAND, NOR) produces the output.

const OPS = [
  { id: 'AND', label: 'AND', fn: (a, b) => a && b },
  { id: 'OR',  label: 'OR',  fn: (a, b) => a || b },
  { id: 'XOR', label: 'XOR', fn: (a, b) => a !== b },
  { id: 'NAND',label: 'NAND',fn: (a, b) => !(a && b) },
  { id: 'NOR', label: 'NOR', fn: (a, b) => !(a || b) },
];

function buildPuzzle(round) {
  // Generate a random correct op, then 4 input rows. Difficulty grows by
  // increasing the number of distractor ops shown (3 -> 5).
  const correct = OPS[Math.floor(Math.random() * OPS.length)];
  const rows = Array.from({ length: 4 }, () => {
    const a = Math.random() < 0.5;
    const b = Math.random() < 0.5;
    return { a, b, out: correct.fn(a, b) };
  });
  // Ensure the rows actually distinguish the correct op (otherwise re-roll once).
  const ambiguous = OPS.filter((op) => op.id !== correct.id)
    .some((op) => rows.every((r) => op.fn(r.a, r.b) === r.out));
  if (ambiguous && round < 50) return buildPuzzle(round + 0.5);

  const choiceCount = Math.min(5, 3 + Math.floor(round / 4));
  const distractors = OPS.filter((op) => op.id !== correct.id)
    .sort(() => Math.random() - 0.5)
    .slice(0, choiceCount - 1);
  const choices = [correct, ...distractors].sort(() => Math.random() - 0.5);
  return { rows, correct, choices };
}

export default function LogicGate({ onExit }) {
  const [phase, setPhase] = useState('intro');
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [lives, setLives] = useState(3);
  const [feedback, setFeedback] = useState(null);

  const puzzle = useMemo(() => buildPuzzle(round), [round]);

  function pick(opId) {
    if (feedback) return;
    if (opId === puzzle.correct.id) {
      const earn = POINTS.CORRECT + POINTS.GAME_BONUS;
      const nextStreak = streak + 1;
      const bonus = nextStreak % 5 === 0 ? POINTS.STREAK_5_BONUS
                  : nextStreak % 3 === 0 ? POINTS.STREAK_3_BONUS : 0;
      setScore((s) => s + earn + bonus);
      setStreak(nextStreak);
      setFeedback('correct');
      setTimeout(next, 600);
    } else {
      setLives((l) => l - 1);
      setStreak(0);
      setFeedback('wrong');
      setTimeout(() => {
        setFeedback(null);
        if (lives - 1 <= 0) {
          recordGameScore('logicGate', score);
          setPhase('over');
        }
      }, 700);
    }
  }

  function next() {
    setFeedback(null);
    setRound((r) => r + 1);
  }

  if (phase === 'intro') {
    return (
      <div className="card mx-auto max-w-xl p-8 text-center">
        <div className="text-3xl">🔌</div>
        <h3 className="mt-2 text-xl font-bold text-ink-900">Logic Gate</h3>
        <p className="mt-2 text-sm text-ink-500">
          Read the truth pattern and pick the operator that produces those outputs.
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
        <p className="mt-2 text-sm text-ink-500">Final score: <strong>{score}</strong> across <strong>{round + 1}</strong> rounds.</p>
        <div className="mt-6 flex justify-center gap-3">
          <button className="btn-primary" onClick={() => { setRound(0); setScore(0); setStreak(0); setLives(3); setPhase('playing'); }}>Play again</button>
          <button className="btn-ghost" onClick={onExit}>Back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="card flex flex-wrap items-center gap-4 px-5 py-4">
        <div className="flex-1 min-w-[160px]">
          <div className="text-base font-bold text-ink-900">Find the operator</div>
          <div className="text-xs uppercase tracking-wider text-ink-400">Round {round + 1}</div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="pill-red">{'❤'.repeat(lives)}{'🤍'.repeat(3 - lives)}</span>
          <span className="pill"><span className="text-ink-400">pts</span> <span className="text-base font-bold text-brand-700">{score}</span></span>
          <span className={`pill ${streak >= 3 ? 'pill-amber' : ''}`}>🔥 {streak}</span>
          <button className="btn-ghost" onClick={onExit}>Quit</button>
        </div>
      </div>

      <div className="card p-6">
        <div className="text-xs uppercase tracking-wider text-ink-400">A op B = output</div>
        <table className="mt-3 w-full font-mono text-sm">
          <thead>
            <tr className="text-left text-ink-500">
              <th className="px-2 py-1">A</th>
              <th className="px-2 py-1">B</th>
              <th className="px-2 py-1">Output</th>
            </tr>
          </thead>
          <tbody>
            {puzzle.rows.map((r, i) => (
              <tr key={i} className="border-t border-ink-100">
                <td className="px-2 py-1.5">{r.a ? 'true' : 'false'}</td>
                <td className="px-2 py-1.5">{r.b ? 'true' : 'false'}</td>
                <td className={`px-2 py-1.5 font-bold ${r.out ? 'text-good-600' : 'text-bad-600'}`}>
                  {r.out ? 'true' : 'false'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {puzzle.choices.map((op) => (
            <button
              key={op.id}
              onClick={() => pick(op.id)}
              className={`choice justify-center text-base font-bold
                ${feedback === 'correct' && op.id === puzzle.correct.id ? 'is-correct' : ''}`}
            >
              {op.label}
            </button>
          ))}
        </div>

        {feedback && (
          <div className={`mt-4 text-sm font-semibold ${feedback === 'correct' ? 'text-good-600' : 'text-bad-600'}`}>
            {feedback === 'correct' ? '✅ Correct!' : `❌ Operator was ${puzzle.correct.label}`}
          </div>
        )}
      </div>
    </div>
  );
}
