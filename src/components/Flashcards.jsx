import React, { useMemo, useState } from 'react';
import { flashcards as deck } from '../data/flashcards.js';
import { shuffle } from '../utils/random.js';
import { loadState, toggleKnownFlashcard } from '../utils/storage.js';

export default function Flashcards({ onHome }) {
  const [order, setOrder] = useState(() => deck.map((_, i) => i));
  const [pos, setPos] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState(() => new Set(loadState().knownFlashcards));

  const card = deck[order[pos]];
  const total = deck.length;
  const knownCount = known.size;

  function next() {
    setFlipped(false);
    setPos((p) => (p + 1) % total);
  }
  function prev() {
    setFlipped(false);
    setPos((p) => (p - 1 + total) % total);
  }
  function reshuffle() {
    setOrder(shuffle(deck.map((_, i) => i)));
    setPos(0);
    setFlipped(false);
  }
  function toggleKnown() {
    const updated = toggleKnownFlashcard(card.id);
    setKnown(new Set(updated.knownFlashcards));
  }
  function resetKnown() {
    const ls = loadState();
    let s = ls;
    for (const id of [...ls.knownFlashcards]) {
      s = toggleKnownFlashcard(id);
    }
    setKnown(new Set(s.knownFlashcards));
  }

  const isKnown = known.has(card.id);

  return (
    <section className="flashcards">
      <div className="flash-topbar">
        <div className="flash-progress">
          Card <strong>{pos + 1}</strong> / {total}
        </div>
        <div className="flash-known">
          ✅ Known: <strong>{knownCount}</strong> / {total}
        </div>
      </div>

      <div
        className={`flashcard ${flipped ? 'flipped' : ''}`}
        onClick={() => setFlipped((f) => !f)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            setFlipped((f) => !f);
          } else if (e.key === 'ArrowRight') next();
          else if (e.key === 'ArrowLeft') prev();
        }}
        aria-label="Flashcard. Click or press space to flip."
      >
        <div className="flash-inner">
          <div className="flash-face flash-front">
            <div className="flash-topic">{card.topic}</div>
            <div className="flash-term">{card.term}</div>
            <div className="flash-hint">tap to flip</div>
          </div>
          <div className="flash-face flash-back">
            <div className="flash-topic">{card.topic}</div>
            <div className="flash-def">{card.definition}</div>
            {card.example && (
              <div className="flash-example">
                <strong>Example:</strong> <code>{card.example}</code>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flash-actions">
        <button className="ghost-btn" onClick={prev}>← Back</button>
        <button
          className={`pill-btn ${isKnown ? 'on' : ''}`}
          onClick={toggleKnown}
        >
          {isKnown ? '✓ Marked Known' : 'Mark as Known'}
        </button>
        <button className="ghost-btn" onClick={next}>Next →</button>
      </div>

      <div className="flash-actions secondary">
        <button className="ghost-btn small" onClick={reshuffle}>🔀 Shuffle</button>
        <button className="ghost-btn small" onClick={resetKnown}>↺ Reset known</button>
        <button className="ghost-btn small" onClick={onHome}>Home</button>
      </div>
    </section>
  );
}
