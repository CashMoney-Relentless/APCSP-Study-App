# AP CSP Mastery Lab

A polished, single-page study platform for **AP Computer Science Principles** built
with **React + Vite + Tailwind CSS**. It blends Quizlet-style flashcards, Kahoot-style
quizzes, Wordle-style daily challenges, and a small set of skill-building mini games.

**No backend.** All progress is saved on this device via `localStorage`.

## Highlights

- **Adaptive engine** that *actually* changes the questions you see — weighted toward
  the topics you're weakest in (60% weak / 30% medium / 10% strong).
- **Spaced repetition** (Leitner-style boxes) so missed questions reappear sooner.
- **Exam Simulation** mode: 35 / 50 / 70 questions, timed, no instant feedback,
  per-section breakdown (Programming / Data / Algorithms / Internet).
- **Mini games** that target specific AP CSP skills:
  - Binary Rush (decimal ↔ binary against a clock)
  - Algorithm Order (reorder pseudocode steps)
  - Bug Hunt (find the buggy line)
  - Logic Gate (pick the operator that produces a truth pattern)
- **Quiz modes**: Standard, Survival (3 lives), Focus Mode (weak topics only),
  Mixed Review, Weakness Drill (rapid-fire).
- **Daily Challenge** seeded by today's date so everyone gets the same 5 questions.
- **Flashcards** with flip animation, shuffle, mark-known, and "focus on unknown".
- **Stats** with per-topic mastery, per-difficulty performance, and game high scores.
- **Modern UI**: white base, soft shadows, rounded cards, single bright-blue accent,
  responsive layout, no neon/rainbow gradients.

## How to run

You need Node.js 18+ (Node 20 recommended).

```bash
npm install
npm run dev          # http://localhost:5173
```

Production build & preview:

```bash
npm run build
npm run preview      # http://localhost:4173
```

## Project structure

```
index.html
tailwind.config.js
postcss.config.js
vite.config.js
src/
  main.jsx
  App.jsx
  styles.css                       # Tailwind layers + component classes
  components/
    Layout.jsx                     # sidebar + topbar + main shell
    Dashboard.jsx                  # hero, mode grid, recommendations
    QuizSetup.jsx                  # length, mode, topic, adaptive toggle, plan preview
    Quiz.jsx                       # practice / survival / focus / drill
    QuestionCard.jsx
    Results.jsx                    # grade label, missed review, recommendations
    DailyChallenge.jsx
    ExamSimulation.jsx             # 70-question timed exam + section breakdown
    Flashcards.jsx
    Stats.jsx
    MiniGames.jsx                  # game hub
    games/
      BinaryRush.jsx
      AlgorithmOrder.jsx
      BugHunt.jsx
      LogicGate.jsx
  data/
    questions.js                   # 180+ AP CSP questions (edit / append)
    flashcards.js                  # 55 vocabulary cards (edit / append)
  utils/
    seededRandom.js                # mulberry32 RNG, shuffle, randomizeQuestion
    storage.js                     # localStorage wrapper, per-topic + spaced-rep
    scoring.js                     # POINTS table, scoreAnswer, gradeFor
    adaptiveLearning.js            # the engine that picks questions
scripts/
  simulate-adaptive.mjs            # node script that verifies 60/30/10 distribution
```

## Adaptive engine (in `src/utils/adaptiveLearning.js`)

Every answer updates a per-topic record:

```ts
{
  attempts, correct, incorrect, accuracy,
  recentIncorrectCount, lastPracticed,
  recentResults: number[],         // last 20 answers as 0/1
  byDifficulty: { easy, medium, hard }   // per-difficulty performance
}
```

When a quiz is built:

1. **Read** topic stats from localStorage.
2. **Classify** each topic with ≥ 3 attempts:
   - `0–50%` → **weak**
   - `51–75%` → **medium**
   - `76–100%` → **strong**
3. **Compute target counts** as 60% weak / 30% medium / 10% strong of `length`.
   Buckets that have no topics collapse and their share is redistributed.
4. **Pick topics inside each bucket** with weighted round-robin where weight grows
   with `(100 - accuracy)` and again with each recent miss — so the worst weak topic
   shows up the most.
5. **Difficulty preference per bucket** — weak buckets prefer easy/medium; strong
   buckets prefer hard.
6. **Spaced repetition first**: a few currently-due question ids are pulled in before
   regular bucket selection.
7. **Avoid recent repeats** by skipping ids in the rolling `recentQuestionIds` list.
8. **Fallback**: if the user has fewer than 8 total answered questions, the engine
   returns a balanced random quiz.

Public API:

```ts
getTopicStats()
updateTopicStats(topic, isCorrect, difficulty)
classifyTopics()
generateAdaptiveQuiz(questionBank, length, opts)
getRecommendedTopics(limit)
```

### Verifying the engine

```
$ node scripts/simulate-adaptive.mjs

Classification:
  weak  : Binary, Lists, Procedures
  medium: Cybersecurity, Selection, Variables
  strong: Internet, Iteration

First plan target: { weak: 6, medium: 3, strong: 1 }

Bucket frequency over 200 quizzes (2000 questions):
  weak    1200 (60.0%)
  medium   600 (30.0%)
  strong   200 (10.0%)
```

## Adding more questions

Open `src/data/questions.js` and append:

```js
{
  id: 'unique-id',
  topic: 'Iteration',                 // any topic; section auto-derived
  difficulty: 'easy',                 // 'easy' | 'medium' | 'hard'
  question: 'What is displayed?',
  codeSnippet: 'x ← 5\nDISPLAY(x)',  // optional, AP CSP pseudocode (not JS)
  choices: ['5', '0', 'undefined', 'Error'],
  correctAnswer: 0,                   // INDEX into choices
  explanation: 'x is assigned 5 then displayed. Other choices forget the assignment.'
}
```

Notes:

- The app shuffles both the question order and the answer choices, so put the
  correct answer wherever you want — `correctAnswer` is the index in your `choices`
  array.
- Use AP CSP pseudocode in `codeSnippet`: `←` for assignment, `MOD`,
  `REPEAT n TIMES { ... }`, `FOR EACH x IN list { ... }`, `IF (cond) { ... }`,
  `PROCEDURE Name(p) { RETURN ... }`. Lists are 1-indexed.
- A single explanation should also briefly say why the wrong answers are wrong.

## Adding more flashcards

Open `src/data/flashcards.js` and append:

```js
{ id: 'fc-56', topic: 'Lists', term: 'Index',
  definition: 'The position of an element in a list (1-based in AP CSP pseudocode).',
  example: 'list[1] is the first element.' }
```

## Adding a new mini game

1. Create a component in `src/components/games/MyGame.jsx` exporting a default
   `({ onExit }) => JSX` component.
2. Use `recordGameScore('myGame', score)` from `src/utils/storage.js` to save the
   high score.
3. Register it in `src/components/MiniGames.jsx`:

   ```js
   import MyGame from './games/MyGame.jsx';

   const GAMES = [
     // …existing games
     { id: 'myGame', title: 'My Game', desc: '…', skill: 'Topic', component: MyGame },
   ];
   ```

   Add `myGame: 0` to the default `gameHighScores` in `src/utils/storage.js` if you
   want it to appear in stats from a fresh install.

## Scoring

| Event                   | Points |
| ----------------------- | ------ |
| Correct answer          | +100   |
| Hard question (bonus)   | +50    |
| 3-streak                | +50    |
| 5-streak                | +100   |
| Mini game tick (bonus)  | +25    |
| Daily challenge bonus   | +250   |

Constants live in `src/utils/scoring.js` — change them in one place.

## Important rules followed

- ✅ Runs without errors (`npm run build` succeeds).
- ✅ No backend; every persistent value is in `localStorage` under a single key.
- ✅ Adaptive engine actually changes question selection (verified by simulation).
- ✅ AP CSP pseudocode in code questions (no JavaScript).
- ✅ Easy to extend: questions, flashcards, and games are file-local arrays/components.
