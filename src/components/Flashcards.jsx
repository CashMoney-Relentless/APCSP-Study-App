import React, { useMemo, useState } from 'react';
import { flashcards as deck } from '../data/flashcards.js';
import { shuffle } from '../utils/seededRandom.js';
import {
  loadState, toggleKnownFlashcard, clearKnownFlashcards,
} from '../utils/storage.js';

export default function Flashcards({ onHome }) {
  const [order, setOrder] = useState(() => deck.map((_, i) => i));
  const [pos, setPos] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState(() => new Set(loadState().knownFlashcards));
  const [focusUnknown, setFocusUnknown] = useState(false);

  // Active deck respects "focus unknown".
  const activeOrder = useMemo(() => {
    if (!focusUnknown) return order;
    const filtered = order.filter((idx) => !known.has(deck[idx].id));
    return filtered.length > 0 ? filtered : order;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order, focusUnknown, known]);

  const card = deck[activeOrder[Math.min(pos, activeOrder.length - 1)]];
  const total = deck.length;
  const knownCount = known.size;
  const masteryPct = Math.round((knownCount / total) * 100);

  function next() { setFlipped(false); setPos((p) => (p + 1) % activeOrder.length); }
  function prev() { setFlipped(false); setPos((p) => (p - 1 + activeOrder.length) % activeOrder.length); }
  function reshuffle() {
    setOrder(shuffle(deck.map((_, i) => i)));
    setPos(0); setFlipped(false);
  }
  function markKnown() {
    const updated = toggleKnownFlashcard(card.id);
    setKnown(new Set(updated.knownFlashcards));
  }
  function resetKnown() {
    const updated = clearKnownFlashcards();
    setKnown(new Set(updated.knownFlashcards));
  }

  const isKnown = known.has(card.id);

  return (
    <div className="space-y-4 animate-fade-up">
      <div className="card flex flex-wrap items-center gap-3 px-5 py-4">
        <div>
          <div className="text-xs uppercase tracking-wider text-ink-400">Mastery</div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-ink-900">{masteryPct}%</span>
            <span className="text-xs text-ink-500">{knownCount} of {total} known</span>
          </div>
          <div className="mt-1.5 h-1.5 w-48 overflow-hidden rounded-full bg-ink-100">
            <div className="h-full rounded-full bg-brand-500 transition-all duration-500" style={{ width: `${masteryPct}%` }} />
          </div>
        </div>

        <div className="ml-auto flex flex-wrap items-center gap-2">
          <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-ink-700">
            <input
              type="checkbox"
              checked={focusUnknown}
              onChange={(e) => { setFocusUnknown(e.target.checked); setPos(0); setFlipped(false); }}
              className="h-4 w-4 rounded border-ink-300"
            />
            Focus on unknown
          </label>
          <button className="btn-ghost" onClick={reshuffle}>🔀 Shuffle</button>
          <button className="btn-ghost" onClick={resetKnown}>↺ Reset known</button>
          <button className="btn-ghost" onClick={onHome}>Home</button>
        </div>
      </div>

      <div
        className="relative h-72 w-full cursor-pointer perspective sm:h-80"
        onClick={() => setFlipped((f) => !f)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); setFlipped((f) => !f); }
          else if (e.key === 'ArrowRight') next();
          else if (e.key === 'ArrowLeft') prev();
        }}
        aria-label="Flashcard. Click to flip."
        style={{ perspective: '1200px' }}
      >
        <div
          className="relative h-full w-full transition-transform duration-700"
          style={{
            transformStyle: 'preserve-3d',
            transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          }}
        >
          <Face front>
            <div className="pill-blue">{card.topic}</div>
            <div className="mt-3 text-3xl font-extrabold leading-tight text-ink-900 sm:text-4xl">
              {card.term}
            </div>
            <div className="mt-auto text-[11px] uppercase tracking-wider text-ink-400">tap to flip</div>
          </Face>
          <Face back>
            <div className="pill-blue">{card.topic}</div>
            <div className="mt-3 text-base leading-relaxed text-ink-900">
              {card.definition}
            </div>
            {card.example && (
              <div className="mt-4 rounded-xl border border-ink-100 bg-ink-50 p-3 text-xs text-ink-700">
                <span className="font-semibold">Example:</span> <code>{card.example}</code>
              </div>
            )}
          </Face>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <button className="btn-ghost" onClick={prev}>← Back</button>
        <button
          className={isKnown ? 'pill-green px-4 py-2 text-sm' : 'btn-ghost'}
          onClick={markKnown}
        >
          {isKnown ? '✓ Marked Known' : 'Mark as Known'}
        </button>
        <button className="btn-ghost" onClick={next}>Next →</button>
      </div>
    </div>
  );
}

function Face({ front, back, children }) {
  return (
    <div
      className={`absolute inset-0 flex flex-col rounded-2xl border border-ink-100 bg-white p-7 shadow-card sm:p-8`}
      style={{
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
        transform: back ? 'rotateY(180deg)' : 'rotateY(0deg)',
      }}
    >
      {children}
    </div>
  );
}
