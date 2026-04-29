# AP CSP Study Arena

A polished, single-page study app for **AP Computer Science Principles** that
mixes the energy of Quizlet, Kahoot, and Wordle. Built with React + Vite.
**No backend** — everything runs in the browser and progress is saved to
`localStorage`.

## Features

- **Home Dashboard** — best score, daily streak, total questions answered, average accuracy.
- **Practice Mode** — pick **Short (5)**, **Medium (10)**, or **Long (20)** quizzes; questions and answer choices are randomized every attempt; topic focus selector.
- **Daily Challenge** — 5 questions seeded by the current date so everyone gets the same daily set; tracks a streak.
- **Flashcards** — flip, next/back, shuffle, mark-as-known with persistent counts.
- **Stats Page** — best score, total quizzes, total questions, total correct, average accuracy, daily streak, last daily date, full reset.
- **Live scoring** — `+100` per correct answer, `+50` bonus for hard, `+50` at 3-streak, `+100` at 5-streak.
- **Results screen** — final score, accuracy, grade label (Master / Strong / Needs Practice / Review Needed), missed-question review with explanations, retry button.
- **AP CSP-style pseudocode** in code questions (not JavaScript).
- **Modern dark UI**, rounded cards, smooth transitions, mobile-friendly.

## Run it locally

You need **Node.js 18+** (Node 20 recommended).

```bash
npm install
npm run dev
```

Then open the URL Vite prints (default `http://localhost:5173`).

To build a production bundle:

```bash
npm run build
npm run preview
```

## Project structure

```
index.html
src/
  main.jsx
  App.jsx
  styles.css
  components/
    Home.jsx
    QuizSetup.jsx
    Quiz.jsx
    QuestionCard.jsx
    Results.jsx
    DailyChallenge.jsx
    Flashcards.jsx
    Stats.jsx
  data/
    questions.js      <-- 60+ AP CSP questions (edit / add here)
    flashcards.js     <-- 30 vocab cards (edit / add here)
  utils/
    random.js         <-- seeded RNG, shuffle, randomizeQuestion
    storage.js        <-- localStorage wrapper
```

## Adding more questions

Open `src/data/questions.js` and append a new object to the `questions` array.
Use this shape:

```js
{
  id: 'unique-id-here',
  topic: 'Iteration',                 // any string; topic dropdown auto-updates
  difficulty: 'easy',                 // 'easy' | 'medium' | 'hard'
  question: 'What is displayed?',
  codeSnippet: 'x ← 5\nDISPLAY(x)',  // optional; AP CSP pseudocode (not JS)
  choices: ['5', '0', 'undefined', 'Error'],
  correctAnswer: 0,                   // INDEX into choices
  explanation: 'x is assigned 5 then displayed.'
}
```

Notes:

- The app randomizes both the question order and the answer choices, so put the
  correct answer wherever you want — `correctAnswer` is the index in the
  original `choices` array.
- For pseudocode, prefer AP CSP conventions: `←` for assignment, `MOD`,
  `REPEAT n TIMES { ... }`, `FOR EACH x IN list { ... }`, `IF (cond) { ... }`,
  `PROCEDURE Name(params) { ... RETURN ... }`, lists are 1-indexed.
- IDs only need to be unique within the file.

## Adding more flashcards

Open `src/data/flashcards.js` and append:

```js
{
  id: 'fc-31',
  topic: 'Lists',
  term: 'Index',
  definition: 'The position of an element in a list (1-based in AP CSP pseudocode).',
  example: 'list[1] is the first element.'
}
```

## Scoring

| Event                  | Points |
| ---------------------- | ------ |
| Correct answer         | +100   |
| Hard question (bonus)  | +50    |
| 3-question streak      | +50    |
| 5-question streak      | +100   |
| Incorrect              | 0      |

(Tweak constants at the top of `src/components/Quiz.jsx`.)

## Daily challenge seeding

The daily challenge uses today's local date (`YYYY-MM-DD`) as the seed for a
deterministic RNG (`mulberry32`), so everyone playing on the same day gets the
same 5 questions in the same order with the same answer ordering. Once
completed, replays don't update the streak.

## Data persistence

All data lives in `localStorage` under the key `apcsp_arena_v1`:

- `bestScore`, `totalQuizzes`, `totalQuestions`, `totalCorrect`
- `dailyStreak`, `lastDailyDate`, `lastDailyResult`
- `knownFlashcards` (array of card ids)

Reset everything from the **Stats** page.
