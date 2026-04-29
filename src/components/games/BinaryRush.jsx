import React, { useEffect, useMemo, useRef, useState } from 'react';
import { recordGameScore } from '../../utils/storage.js';
import { POINTS } from '../../utils/scoring.js';

// Convert decimal <-> binary against a timer.
// Difficulty scales with score: starts with 4-bit numbers, grows up to 8 bits.
const START_TIME = 30;
const LIVES_START = 3;

export default function BinaryRush({ onExit }) {
  const [phase, setPhase] = useState('intro'); // intro | playing | gameover
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [lives, setLives] = useState(LIVES_START);
  const [time, setTime] = useState(START_TIME);
  const [round, setRound] = useState(0); // count of solved rounds
  const [feedback, setFeedback] = useState(null); // 'correct' | 'wrong' | null
  const tickRef = useRef(null);

  const challenge = useMemo(() => buildChallenge(round), [round]);
  const [input, setInput] = useState('');

  useEffect(() => {
    if (phase !== 'playing') return;
    tickRef.current = setInterval(() => {
      setTime((t) => {
        if (t <= 1) {
          clearInterval(tickRef.current);
          endGame();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(tickRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  function start() {
    setPhase('playing');
    setScore(0); setStreak(0); setLives(LIVES_START); setTime(START_TIME); setRound(0);
    setFeedback(null); setInput('');
  }

  function endGame() {
    setPhase('gameover');
    recordGameScore('binaryRush', score);
  }

  function submit() {
    if (phase !== 'playing') return;
    const ok = String(input).trim() === String(challenge.answer);

    if (ok) {
      const earn = POINTS.CORRECT + POINTS.GAME_BONUS;
      const nextStreak = streak + 1;
      let bonus = 0;
      if (nextStreak > 0 && nextStreak % 5 === 0) bonus = POINTS.STREAK_5_BONUS;
      else if (nextStreak > 0 && nextStreak % 3 === 0) bonus = POINTS.STREAK_3_BONUS;
      setScore((s) => s + earn + bonus);
      setStreak(nextStreak);
      setTime((t) => Math.min(START_TIME + 5, t + 3)); // small time bonus
      setFeedback('correct');
    } else {
      const livesLeft = lives - 1;
      setLives(livesLeft);
      setStreak(0);
      setTime((t) => Math.max(0, t - 3));
      setFeedback('wrong');
      if (livesLeft <= 0) {
        setTimeout(endGame, 400);
        return;
      }
    }
    setTimeout(() => {
      setFeedback(null);
      setInput('');
      setRound((r) => r + 1);
    }, 350);
  }

  function onKeyDown(e) {
    if (e.key === 'Enter') submit();
  }

  if (phase === 'intro') {
    return (
      <div className="card mx-auto max-w-xl p-8 text-center">
        <div className="text-3xl">⚡</div>
        <h3 className="mt-2 text-xl font-bold text-ink-900">Binary Rush</h3>
        <p className="mt-2 text-sm text-ink-500">
          Convert between decimal and binary. Each correct answer adds time;
          each miss costs time and a life. 3 lives. Difficulty grows.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <button className="btn-primary" onClick={start}>Start</button>
          <button className="btn-ghost" onClick={onExit}>Back</button>
        </div>
      </div>
    );
  }

  if (phase === 'gameover') {
    return (
      <div className="card mx-auto max-w-xl p-8 text-center">
        <div className="text-3xl">🏁</div>
        <h3 className="mt-2 text-xl font-bold text-ink-900">Game over</h3>
        <p className="mt-2 text-sm text-ink-500">
          You scored <strong>{score}</strong> points across <strong>{round}</strong> rounds.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <button className="btn-primary" onClick={start}>Play again</button>
          <button className="btn-ghost" onClick={onExit}>Back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="card flex flex-wrap items-center gap-4 px-5 py-4">
        <div className="flex-1 min-w-[180px]">
          <div className="progress-track">
            <div
              className={`h-full rounded-full ${time <= 5 ? 'bg-bad-500' : 'bg-brand-500'} transition-all duration-700`}
              style={{ width: `${Math.round((time / START_TIME) * 100)}%` }}
            />
          </div>
          <div className="mt-1 flex items-center gap-3 text-xs uppercase tracking-wider text-ink-400">
            <span>⏱ {time}s</span>
            <span>Round {round + 1}</span>
            <span>{'❤'.repeat(lives)}{'🤍'.repeat(LIVES_START - lives)}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="pill"><span className="text-ink-400">pts</span> <span className="text-base font-bold text-brand-700">{score}</span></span>
          <span className={`pill ${streak >= 3 ? 'pill-amber' : ''}`}>🔥 {streak}</span>
          <button className="btn-ghost" onClick={onExit}>Quit</button>
        </div>
      </div>

      <div className={`card p-8 text-center ${feedback === 'correct' ? 'ring-2 ring-good-500/40' : feedback === 'wrong' ? 'ring-2 ring-bad-500/40' : ''}`}>
        <div className="text-xs uppercase tracking-wider text-ink-400">{challenge.prompt}</div>
        <div className="mt-3 font-mono text-4xl font-extrabold text-ink-900">{challenge.display}</div>

        {challenge.kind === 'multipleChoice' ? (
          <div className="mt-6 grid gap-2 sm:grid-cols-2">
            {challenge.choices.map((c, i) => (
              <button
                key={i}
                onClick={() => { setInput(c); setTimeout(submit, 0); }}
                className="choice"
              >
                <span className="choice-letter">{String.fromCharCode(65 + i)}</span>
                <span className="flex-1 font-mono text-base">{c}</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="mt-6 flex items-center justify-center gap-2">
            <input
              autoFocus
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              className="input-base max-w-xs text-center font-mono text-lg"
              placeholder={challenge.placeholder}
              inputMode={challenge.kind === 'd2b' ? 'numeric' : 'numeric'}
            />
            <button className="btn-primary" onClick={submit}>Submit</button>
          </div>
        )}

        {feedback === 'correct' && <div className="mt-4 text-sm font-semibold text-good-600">+ {POINTS.CORRECT + POINTS.GAME_BONUS}</div>}
        {feedback === 'wrong' && <div className="mt-4 text-sm font-semibold text-bad-600">Answer: <span className="font-mono">{challenge.answer}</span></div>}
      </div>

      <div className="text-center text-xs text-ink-400">Tip: keyboard Enter to submit.</div>
    </div>
  );
}

function buildChallenge(round) {
  // Bits scale: 4 → 5 → 6 → 7 → 8
  const bits = Math.min(8, 4 + Math.floor(round / 4));
  const max = (1 << bits) - 1;
  const decimal = Math.floor(Math.random() * (max + 1));
  const dirIsB2D = Math.random() < 0.5;

  if (round < 3) {
    // Multiple choice for easier early rounds
    const correct = dirIsB2D ? String(decimal) : decimal.toString(2).padStart(bits, '0');
    const distractors = makeDistractors(dirIsB2D, decimal, bits);
    const choices = shuffleArr([correct, ...distractors]);
    return {
      kind: 'multipleChoice',
      prompt: dirIsB2D ? 'Convert binary to decimal' : 'Convert decimal to binary',
      display: dirIsB2D ? decimal.toString(2).padStart(bits, '0') : String(decimal),
      choices, answer: correct,
    };
  }

  if (dirIsB2D) {
    return {
      kind: 'b2d',
      prompt: 'Convert binary to decimal',
      display: decimal.toString(2).padStart(bits, '0'),
      placeholder: 'decimal',
      answer: String(decimal),
    };
  }
  return {
    kind: 'd2b',
    prompt: 'Convert decimal to binary',
    display: String(decimal),
    placeholder: 'binary digits',
    answer: decimal.toString(2),
  };
}

function makeDistractors(b2d, decimal, bits) {
  const out = new Set();
  while (out.size < 3) {
    const delta = (Math.floor(Math.random() * 8) - 4) || 1;
    const v = Math.max(0, Math.min((1 << bits) - 1, decimal + delta));
    if (b2d) {
      if (v !== decimal) out.add(String(v));
    } else {
      const binV = v.toString(2).padStart(bits, '0');
      if (binV !== decimal.toString(2).padStart(bits, '0')) out.add(binV);
    }
  }
  return Array.from(out);
}

function shuffleArr(a) {
  const arr = a.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
