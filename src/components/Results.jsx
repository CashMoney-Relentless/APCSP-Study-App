import React from 'react';
import { gradeFor } from '../utils/scoring.js';
import { buildStudyRecommendations, classifyTopics, getTopicStats } from '../utils/adaptiveLearning.js';

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

const TONE_TO_CLASS = {
  mastery: 'from-brand-500/15 to-brand-800/10 border-brand-500/30 text-brand-700',
  strong:  'from-good-500/15 to-good-500/5 border-good-500/30 text-good-600',
  developing: 'from-amber-500/15 to-amber-500/5 border-amber-500/30 text-amber-700',
  review:  'from-bad-500/15 to-bad-500/5 border-bad-500/30 text-bad-600',
};

export default function Results({ result, onRetry, onHome, onPractice, onGames }) {
  const { score, pointsEarned, correct, total, accuracy, history, mode, plan, sectionBreakdown, durationSec, lives } = result;
  const grade = gradeFor(accuracy);
  const missed = history.filter((h) => !h.isCorrect);
  const hero = TONE_TO_CLASS[grade.tone] || TONE_TO_CLASS.developing;

  const topicStats = getTopicStats();
  const cls = classifyTopics(topicStats);
  const advice = buildStudyRecommendations(topicStats, 3);

  return (
    <div className="space-y-6 animate-fade-up">
      <section className={`card border bg-gradient-to-br p-8 text-center ${hero}`}>
        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-500">
          {mode === 'exam' ? 'Exam complete' : mode === 'daily' ? 'Daily challenge complete' : 'Practice complete'}
        </div>
        <div className="mt-2 text-4xl font-extrabold text-ink-900">{score} pts</div>
        <div className="mt-1 text-sm text-ink-600">
          {correct} / {total} correct · {accuracy}% accuracy
          {mode === 'survival' && lives != null && <> · ❤ {Math.max(0, lives)} left</>}
          {durationSec != null && <> · {fmtDuration(durationSec)}</>}
        </div>
        <div className={`mt-4 inline-block rounded-full border bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em]`}>
          {grade.label}
        </div>
        <div className="mt-1 text-xs text-ink-500">
          {gradeBlurb(grade.tone)}
        </div>
        {pointsEarned > 0 && pointsEarned !== score && (
          <div className="mt-3 text-xs text-ink-500">+{pointsEarned} added to your total points</div>
        )}
      </section>

      <div className="flex flex-wrap gap-3">
        <button className="btn-primary" onClick={onRetry}>
          {mode === 'daily' ? 'Back to daily' : mode === 'exam' ? 'New exam' : 'Try another quiz'}
        </button>
        <button className="btn-ghost" onClick={onHome}>Dashboard</button>
        {onGames && <button className="btn-ghost" onClick={onGames}>Try a mini game</button>}
        {onPractice && mode !== 'practice' && <button className="btn-ghost" onClick={onPractice}>Practice setup</button>}
      </div>

      {sectionBreakdown && (
        <section className="card p-6">
          <h3 className="section-title">Section breakdown</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {Object.entries(sectionBreakdown).map(([sec, b]) => {
              const pct = b.total > 0 ? Math.round((b.correct / b.total) * 100) : 0;
              return (
                <div key={sec} className="rounded-xl border border-ink-100 p-4">
                  <div className="flex items-baseline justify-between">
                    <div className="font-semibold text-ink-900">{sec}</div>
                    <div className="text-sm text-ink-500">{b.correct}/{b.total} · {pct}%</div>
                  </div>
                  <div className="progress-track mt-2"><div className="progress-fill" style={{ width: `${pct}%` }} /></div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {plan?.adaptive && plan.usedTopics && (
        <section className="card p-6">
          <h3 className="section-title">Adaptive plan used</h3>
          <p className="mt-2 text-xs text-ink-500">
            Targeted {plan.targetCounts?.weak ?? 0} weak · {plan.targetCounts?.medium ?? 0} medium · {plan.targetCounts?.strong ?? 0} strong
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {Object.entries(plan.usedTopics)
              .sort((a, b) => b[1] - a[1])
              .map(([t, n]) => (
                <span key={t} className="pill">
                  {t}<span className="opacity-60">·{n}</span>
                </span>
              ))}
          </div>
        </section>
      )}

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <h3 className="section-title">Review</h3>
          {history.length === 0 ? (
            <div className="card p-4 text-sm text-ink-500">No questions answered.</div>
          ) : (
            <div className="space-y-3">
              {history.map((h, idx) => {
                const q = h.question;
                return (
                  <div
                    key={q.id + idx}
                    className={`card border-l-4 p-4
                      ${h.isCorrect ? 'border-good-500' : 'border-bad-500'}`}
                  >
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold text-ink-400">Q{idx + 1}</span>
                      <span className="pill-blue">{q.topic}</span>
                      <span className="pill">{q.difficulty}</span>
                      <span className="ml-auto text-sm font-semibold">
                        {h.isCorrect ? `✅ +${h.points}` : '❌'}
                      </span>
                    </div>
                    <div className="font-medium text-ink-900">{q.question}</div>
                    {q.codeSnippet && (
                      <pre className="code-block mt-2 text-[12.5px]"><code>{q.codeSnippet}</code></pre>
                    )}
                    <div className="mt-2 space-y-1 text-sm">
                      <div>
                        <span className="font-semibold text-ink-700">Correct:</span>{' '}
                        <span className="text-good-600">{LETTERS[q.correctAnswer]}. {q.choices[q.correctAnswer]}</span>
                      </div>
                      {!h.isCorrect && h.selected != null && (
                        <div>
                          <span className="font-semibold text-ink-700">Your answer:</span>{' '}
                          <span className="text-bad-600">{LETTERS[h.selected]}. {q.choices[h.selected]}</span>
                        </div>
                      )}
                    </div>
                    <div className="mt-2 text-sm text-ink-500">{q.explanation}</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="space-y-4">
          {missed.length > 0 && (
            <div className="card p-5">
              <h3 className="section-title">Topics to revisit</h3>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {Array.from(new Set(missed.map((m) => m.question.topic))).map((t) => (
                  <span key={t} className="pill-red">{t}</span>
                ))}
              </div>
            </div>
          )}

          {cls.weak.length > 0 && (
            <div className="card p-5">
              <h3 className="section-title">Current weak topics</h3>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {cls.weak.map((t) => <span key={t} className="pill-red">{t}</span>)}
              </div>
            </div>
          )}

          <div className="card p-5">
            <h3 className="section-title">Recommended next step</h3>
            <ul className="mt-3 space-y-3">
              {advice.map((a, i) => (
                <li key={i} className="rounded-xl border border-ink-100 bg-ink-50 p-3 text-sm">
                  <div className="font-semibold text-ink-900">{a.title}</div>
                  <div className="mt-1 text-xs text-ink-500">{a.detail}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}

function gradeBlurb(tone) {
  if (tone === 'mastery') return 'Mastery level — you are exam-ready on this set.';
  if (tone === 'strong') return 'Strong — keep mixing in tougher questions.';
  if (tone === 'developing') return 'Developing — adaptive practice will sharpen your weak areas.';
  return 'Needs review — focus on the weak topics below.';
}

function fmtDuration(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}m ${String(s).padStart(2, '0')}s`;
}
