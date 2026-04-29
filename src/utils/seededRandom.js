// Deterministic seeded RNG (mulberry32) and helpers used across quizzes
// and the daily challenge. Exposed under a consistent name so any module
// can swap Math.random for a seeded RNG when reproducibility matters.

export function mulberry32(seed) {
  let t = seed >>> 0;
  return function rand() {
    t = (t + 0x6d2b79f5) >>> 0;
    let r = t;
    r = Math.imul(r ^ (r >>> 15), r | 1);
    r ^= r + Math.imul(r ^ (r >>> 7), r | 61);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

// xfnv1a hash → 32-bit unsigned int seed
export function hashStringToSeed(str) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function todayDateString(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function shuffle(array, rng = Math.random) {
  const a = array.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function sampleN(array, n, rng = Math.random) {
  return shuffle(array, rng).slice(0, Math.min(n, array.length));
}

export function randInt(min, maxInclusive, rng = Math.random) {
  return Math.floor(rng() * (maxInclusive - min + 1)) + min;
}

// Produces a new question object whose answer choices are shuffled and
// whose correctAnswer index is updated accordingly. Pure: returns new obj.
export function randomizeQuestion(q, rng = Math.random) {
  const indexed = q.choices.map((text, idx) => ({ text, idx }));
  const shuffled = shuffle(indexed, rng);
  const correctIndex = shuffled.findIndex((c) => c.idx === q.correctAnswer);
  return {
    ...q,
    choices: shuffled.map((c) => c.text),
    correctAnswer: correctIndex,
  };
}
