import React, { useEffect, useState } from 'react';
import Sidebar from './components/Sidebar.jsx';
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

const TITLES = {
  home: 'Overview',
  setup: 'Practice',
  quiz: 'Practice',
  results: 'Results',
  daily: 'Daily Challenge',
  flashcards: 'Flashcards',
  stats: 'Stats',
};

export default function App() {
  const [view, setView] = useState(VIEWS.HOME);
  const [stats, setStats] = useState(loadState());
  const [quizConfig, setQuizConfig] = useState(null);
  const [lastResult, setLastResult] = useState(null);
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    setStats(loadState());
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

  function handleNav(target) {
    if (target === 'home') setView(VIEWS.HOME);
    else if (target === 'setup') setView(VIEWS.SETUP);
    else if (target === 'daily') setView(VIEWS.DAILY);
    else if (target === 'flashcards') setView(VIEWS.FLASHCARDS);
    else if (target === 'stats') setView(VIEWS.STATS);
  }

  return (
    <div className="layout">
      <Sidebar
        view={view}
        onNavigate={handleNav}
        stats={stats}
        open={navOpen}
        onClose={() => setNavOpen(false)}
      />

      <div className="content">
        <Topbar
          title={TITLES[view]}
          onMenu={() => setNavOpen((o) => !o)}
          onHome={() => setView(VIEWS.HOME)}
          showHome={view !== VIEWS.HOME}
        />

        <main className="content-main">
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
                if (lastResult.mode === 'daily') setView(VIEWS.DAILY);
                else setView(VIEWS.SETUP);
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

        <footer className="content-foot">
          AP CSP Study Arena · saved locally · no backend
        </footer>
      </div>
    </div>
  );
}

function Topbar({ title, onMenu, onHome, showHome }) {
  return (
    <header className="topbar">
      <button className="menu-btn" onClick={onMenu} aria-label="Open navigation">
        <span /><span /><span />
      </button>
      <div className="topbar-title">
        <span className="topbar-eyebrow">AP CSP</span>
        <span className="topbar-h">{title}</span>
      </div>
      {showHome && (
        <button className="ghost-btn small" onClick={onHome}>
          ← Overview
        </button>
      )}
    </header>
  );
}
