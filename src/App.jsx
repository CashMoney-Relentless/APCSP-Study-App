import React, { useEffect, useState } from 'react';
import Home from './components/Home.jsx';
import QuizSetup from './components/QuizSetup.jsx';
import Quiz from './components/Quiz.jsx';
import Results from './components/Results.jsx';
import DailyChallenge from './components/DailyChallenge.jsx';
import Flashcards from './components/Flashcards.jsx';
import Stats from './components/Stats.jsx';
import { loadState } from './utils/storage.js';

const VIEWS = {
  HOME: 'home',
  SETUP: 'setup',
  QUIZ: 'quiz',
  RESULTS: 'results',
  DAILY: 'daily',
  FLASHCARDS: 'flashcards',
  STATS: 'stats',
};

export default function App() {
  const [view, setView] = useState(VIEWS.HOME);
  const [stats, setStats] = useState(loadState());
  const [quizConfig, setQuizConfig] = useState(null);
  const [lastResult, setLastResult] = useState(null);

  useEffect(() => {
    if (view === VIEWS.HOME || view === VIEWS.STATS) {
      setStats(loadState());
    }
  }, [view]);

  function startPractice(config) {
    setQuizConfig({ ...config, mode: 'practice' });
    setView(VIEWS.QUIZ);
  }

  function finishQuiz(result) {
    setLastResult(result);
    setStats(loadState());
    setView(VIEWS.RESULTS);
  }

  return (
    <div className="app-shell">
      <Header onHome={() => setView(VIEWS.HOME)} showHome={view !== VIEWS.HOME} />

      <main className="app-main">
        {view === VIEWS.HOME && (
          <Home
            stats={stats}
            onStartPractice={() => setView(VIEWS.SETUP)}
            onDaily={() => setView(VIEWS.DAILY)}
            onFlashcards={() => setView(VIEWS.FLASHCARDS)}
            onStats={() => setView(VIEWS.STATS)}
          />
        )}

        {view === VIEWS.SETUP && (
          <QuizSetup onStart={startPractice} onCancel={() => setView(VIEWS.HOME)} />
        )}

        {view === VIEWS.QUIZ && quizConfig && (
          <Quiz
            config={quizConfig}
            onFinish={finishQuiz}
            onQuit={() => setView(VIEWS.HOME)}
          />
        )}

        {view === VIEWS.RESULTS && lastResult && (
          <Results
            result={lastResult}
            onRetry={() => {
              if (lastResult.mode === 'daily') {
                setView(VIEWS.DAILY);
              } else {
                setView(VIEWS.SETUP);
              }
            }}
            onHome={() => setView(VIEWS.HOME)}
          />
        )}

        {view === VIEWS.DAILY && (
          <DailyChallenge onFinish={finishQuiz} onHome={() => setView(VIEWS.HOME)} />
        )}

        {view === VIEWS.FLASHCARDS && <Flashcards onHome={() => setView(VIEWS.HOME)} />}

        {view === VIEWS.STATS && (
          <Stats
            stats={stats}
            onHome={() => setView(VIEWS.HOME)}
            onReset={() => setStats(loadState())}
          />
        )}
      </main>

      <footer className="app-footer">
        <span>AP CSP Study Arena · built for studying · no backend</span>
      </footer>
    </div>
  );
}

function Header({ onHome, showHome }) {
  return (
    <header className="app-header">
      <div
        className="brand"
        onClick={onHome}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') onHome();
        }}
      >
        <div className="brand-mark" aria-hidden="true">AP</div>
        <div className="brand-text">
          <div className="brand-title">AP CSP Study Arena</div>
          <div className="brand-sub">Practice · Daily · Flashcards</div>
        </div>
      </div>
      {showHome && (
        <button className="ghost-btn" onClick={onHome}>
          ← Home
        </button>
      )}
    </header>
  );
}
