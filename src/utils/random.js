// Deterministic seeded RNG (mulberry32) + helpers for shuffling and seeding.

export function mulberry32(seed) {
  let t = seed >>> 0;
  return function () {
    t = (t + 0x6d2b79f5) >>> 0;
    let r = t;
    r = Math.imul(r ^ (r >>> 15), r | 1);
    r ^= r + Math.imul(r ^ (r >>> 7), r | 61);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

// Hash a string into a 32-bit unsigned int (xfnv1a).
export function hashStringToSeed(str) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

// Build a seed from today's date in the user's locale (YYYY-MM-DD).
export function todaySeedString(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// Fisher–Yates shuffle. If rng is provided, results are deterministic.
export function shuffle(array, rng = Math.random) {
  const a = array.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Pick n unique items from array, optionally seeded.
export function sampleN(array, n, rng = Math.random) {
  return shuffle(array, rng).slice(0, Math.min(n, array.length));
}

// Build a randomized variant of a question with shuffled choices and a
// new index for the correct answer. Pure: returns a new object.
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
