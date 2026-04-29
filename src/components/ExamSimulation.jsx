import React, { useEffect, useMemo, useRef, useState } from 'react';
import { questions as bank, allSections } from '../data/questions.js';
import { sampleN, shuffle, randomizeQuestion } from '../utils/seededRandom.js';
import { recordExamFinish } from '../utils/storage.js';
import { recordAnswer } from '../utils/adaptiveLearning.js';
import { POINTS, scoreAnswer, gradeFor } from '../utils/scoring.js';

const DEFAULT_LENGTH = 70;
const DEFAULT_MINUTES = 60;

export default function ExamSimulation({ onFinish, onHome }) {
  const [phase, setPhase] = useState('config'); // 'config' | 'live'
  const [examLength, setExamLength] = useState(DEFAULT_LENGTH);
  const [minutes, setMinutes] = useState(DEFAULT_MINUTES);

  if (phase === 'config') {
    return (
      <ExamConfig
        examLength={examLength} setExamLength={setExamLength}
        minutes={minutes} setMinutes={setMinutes}
        onCancel={onHome}
        onStart={() => setPhase('live')}
      />
    );
  }

  return (
    <LiveExam
      examLength={examLength}
      minutes={minutes}
      onFinish={onFinish}
      onAbort={() => setPhase('config')}
    />
  );
}

function ExamConfig({ examLength, setExamLength, minutes, setMinutes, onStart, onCancel }) {
  const sections = allSections();
  return (
    <div className="space-y-6 animate-fade-up">
      <header>
        <h2 className="section-title">Exam Simulation</h2>
        <p className="mt-2 max-w-2xl text-sm text-ink-500">
          Realistic AP-style test. No instant feedback during the exam — results and section breakdown appear at the end.
        </p>
      </header>

      <div className="card p-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink-500">Length</label>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {[35, 50, 70].map((n) => (
                <button
                  key={n}
                  onClick={() => setExamLength(n)}
                  className={`rounded-xl border p-3 text-center transition
                    ${examLength === n ? 'border-brand-500 bg-brand-50 ring-2 ring-brand-200' : 'border-ink-200 hover:border-brand-300 hover:bg-brand-50'}`}
                >
                  <div className="text-xl font-bold text-ink-900">{n}</div>
                  <div className="text-[11px] uppercase tracking-wider text-ink-400">questions</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink-500">Time limit</label>
            <div className="mt-2 grid grid-cols-4 gap-2">
              {[20, 40, 60, 90].map((m) => (
                <button
                  key={m}
                  onClick={() => setMinutes(m)}
                  className={`rounded-xl border p-3 text-center transition
                    ${minutes === m ? 'border-brand-500 bg-brand-50 ring-2 ring-brand-200' : 'border-ink-200 hover:border-brand-300 hover:bg-brand-50'}`}
                >
                  <div className="text-lg font-bold text-ink-900">{m}m</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-ink-100 bg-ink-50 p-4 text-sm">
            <div className="font-semibold text-ink-900">Sections covered</div>
            <ul className="mt-2 list-disc pl-5 text-ink-600">
              {sections.map((s) => <li key={s}>{s}</li>)}
            </ul>
          </div>
          <div className="rounded-xl border border-ink-100 bg-ink-50 p-4 text-sm text-ink-600">
            <div className="font-semibold text-ink-900">Rules</div>
            <ul className="mt-2 list-disc pl-5">
              <li>Answer choices and question order are randomized.</li>
              <li>You can navigate Prev / Next freely.</li>
              <li>No feedback shown until the timer ends or you submit.</li>
            </ul>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button className="btn-primary" onClick={onStart}>Begin exam →</button>
          <button className="btn-ghost" onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

function LiveExam({ examLength, minutes, onFinish, onAbort }) {
  const examQuestions = useMemo(() => {
    // Even-ish sample by section so all sections show up.
    const sections = allSections();
    const perSection = Math.floor(examLength / sections.length);
    let extra = examLength - perSection * sections.length;
    const picks = [];
    for (const sec of sections) {
      const pool = bank.filter((q) => q.section === sec);
      const take = perSection + (extra > 0 ? 1 : 0);
      if (extra > 0) extra--;
      picks.push(...sampleN(pool, take));
    }
    // Top up if a section was small.
    if (picks.length < examLength) {
      const leftover = bank.filter((q) => !picks.includes(q));
      picks.push(...sampleN(leftover, examLength - picks.length));
    }
    return shuffle(picks).slice(0, examLength).map((q) => randomizeQuestion(q));
  }, [examLength]);

  const [index, setIndex] = useState(0);
  // Per-question selection: array of indices, null = unanswered.
  const [picks, setPicks] = useState(() => Array(examQuestions.length).fill(null));
  const [submitted, setSubmitted] = useState(false);
  const startedAt = useRef(Date.now());
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const elapsedSec = Math.floor((now - startedAt.current) / 1000);
  const totalSec = minutes * 60;
  const remaining = Math.max(0, totalSec - elapsedSec);

  useEffect(() => {
    if (remaining === 0 && !submitted) {
      handleSubmit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remaining]);

  const current = examQuestions[index];

  function pickAnswer(i) {
    if (submitted) return;
    setPicks((arr) => {
      const next = arr.slice();
      next[index] = i;
      return next;
    });
  }

  function handleSubmit() {
    if (submitted) return;
    setSubmitted(true);

    const history = examQuestions.map((q, i) => {
      const sel = picks[i];
      const isCorrect = sel != null && sel === q.correctAnswer;
      return { question: q, selected: sel, isCorrect, points: 0 };
    });

    let score = 0;
    let prevStreak = 0;
    for (const h of history) {
      const r = scoreAnswer({ isCorrect: h.isCorrect, difficulty: h.question.difficulty, prevStreak });
      h.points = r.earned;
      score += r.earned;
      prevStreak = r.nextStreak;
      // Live updates so the adaptive engine sees these answers.
      recordAnswer({ question: h.question, isCorrect: h.isCorrect, mode: 'exam' });
    }
    const correct = history.filter((h) => h.isCorrect).length;
    const total = history.length;
    const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;

    const sectionBreakdown = {};
    for (const h of history) {
      const sec = h.question.section || 'Other';
      const cur = sectionBreakdown[sec] || { correct: 0, total: 0 };
      sectionBreakdown[sec] = {
        correct: cur.correct + (h.isCorrect ? 1 : 0),
        total: cur.total + 1,
      };
    }

    const durationSec = Math.min(elapsedSec, totalSec);
    recordExamFinish({
      score, correct, total, sectionBreakdown, durationSec, history,
      pointsEarned: score,
    });

    const grade = gradeFor(accuracy);
    onFinish({
      score, pointsEarned: score, correct, total, accuracy, history,
      mode: 'exam', sectionBreakdown, durationSec, grade,
      plan: { adaptive: false, reason: 'exam' },
    });
  }

  const answeredCount = picks.filter((p) => p != null).length;

  return (
    <div className="space-y-4 animate-fade-up">
      <div className="card flex flex-wrap items-center gap-4 px-4 py-3 sm:px-6">
        <div className="flex-1 min-w-[200px]">
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${Math.round((answeredCount / examQuestions.length) * 100)}%` }} />
          </div>
          <div className="mt-1.5 flex items-center justify-between text-xs uppercase tracking-wider text-ink-400">
            <span>Question {index + 1} / {examQuestions.length}</span>
            <span>Answered {answeredCount}</span>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className={`pill ${remaining < 60 ? 'pill-red' : 'pill-blue'}`}>
            ⏱ {fmtSec(remaining)}
          </span>
          <button className="btn-ghost" onClick={onAbort}>Quit</button>
          <button className="btn-primary" onClick={handleSubmit}>Submit exam</button>
        </div>
      </div>

      <div className="card p-6 sm:p-8">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="pill-blue">{current.topic}</span>
          <span className="pill">{current.section}</span>
          <span className="pill">{current.difficulty}</span>
          <span className="ml-auto text-xs uppercase tracking-wider text-ink-400">No instant feedback</span>
        </div>

        <div className="text-lg font-semibold leading-relaxed text-ink-900">
          {current.question}
        </div>

        {current.codeSnippet && (
          <pre className="code-block mt-4"><code>{current.codeSnippet}</code></pre>
        )}

        <div className="mt-5 grid grid-cols-1 gap-2.5">
          {current.choices.map((choice, i) => {
            const isPicked = picks[index] === i;
            return (
              <button
                key={i}
                onClick={() => pickAnswer(i)}
                className={`choice ${isPicked ? 'is-selected' : ''}`}
              >
                <span className="choice-letter">{String.fromCharCode(65 + i)}</span>
                <span className="flex-1 text-sm">{choice}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          className="btn-ghost"
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
          disabled={index === 0}
        >← Prev</button>
        <QuestionGrid
          picks={picks}
          current={index}
          onJump={(i) => setIndex(i)}
        />
        <button
          className="btn-ghost"
          onClick={() => setIndex((i) => Math.min(examQuestions.length - 1, i + 1))}
          disabled={index === examQuestions.length - 1}
        >Next →</button>
      </div>
    </div>
  );
}

function QuestionGrid({ picks, current, onJump }) {
  return (
    <div className="hidden flex-wrap gap-1.5 md:flex">
      {picks.map((p, i) => {
        const answered = p != null;
        const isCurrent = i === current;
        return (
          <button
            key={i}
            onClick={() => onJump(i)}
            className={`grid h-8 w-8 place-items-center rounded-md border text-xs font-semibold transition
              ${isCurrent
                ? 'border-brand-500 bg-brand-500 text-white'
                : answered
                ? 'border-good-500/40 bg-good-500/10 text-good-600'
                : 'border-ink-200 bg-white text-ink-500'}`}
            aria-label={`Question ${i + 1} ${answered ? 'answered' : 'unanswered'}`}
          >
            {i + 1}
          </button>
        );
      })}
    </div>
  );
}

function fmtSec(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}
