import React, { useEffect, useMemo, useState } from 'react';
import Layout from './components/Layout.jsx';
import Dashboard from './components/Dashboard.jsx';
import QuizSetup from './components/QuizSetup.jsx';
import Quiz from './components/Quiz.jsx';
import Results from './components/Results.jsx';
import DailyChallenge from './components/DailyChallenge.jsx';
import ExamSimulation from './components/ExamSimulation.jsx';
import Flashcards from './components/Flashcards.jsx';
import Stats from './components/Stats.jsx';
import MiniGames from './components/MiniGames.jsx';
import { loadState } from './utils/storage.js';

const VIEWS = {
  HOME: 'home',
  PRACTICE_SETUP: 'practice-setup',
  QUIZ: 'quiz',
  RESULTS: 'results',
  DAILY: 'daily',
  EXAM: 'exam',
  FLASHCARDS: 'flashcards',
  STATS: 'stats',
  GAMES: 'games',
};

const TITLES = {
  home: 'Dashboard',
  'practice-setup': 'Practice Setup',
  quiz: 'Quiz',
  results: 'Results',
  daily: 'Daily Challenge',
  exam: 'Exam Simulation',
  flashcards: 'Flashcards',
  stats: 'Stats',
  games: 'Mini Games',
};

export default function App() {
  const [view, setView] = useState(VIEWS.HOME);
  const [stats, setStats] = useState(loadState());
  const [quizConfig, setQuizConfig] = useState(null);
  const [lastResult, setLastResult] = useState(null);

  // Refresh stats whenever we land on a view that displays them.
  useEffect(() => {
    if ([VIEWS.HOME, VIEWS.STATS, VIEWS.FLASHCARDS, VIEWS.GAMES, VIEWS.RESULTS].includes(view)) {
      setStats(loadState());
    }
  }, [view]);

  const navItems = useMemo(
    () => [
      { id: VIEWS.HOME,            label: 'Dashboard', icon: '◇' },
      { id: VIEWS.PRACTICE_SETUP,  label: 'Practice',  icon: '◎' },
      { id: VIEWS.DAILY,           label: 'Daily',     icon: '✦' },
      { id: VIEWS.EXAM,            label: 'Exam Sim',  icon: '⌛' },
      { id: VIEWS.FLASHCARDS,      label: 'Flashcards',icon: '▤' },
      { id: VIEWS.GAMES,           label: 'Mini Games',icon: '⚡' },
      { id: VIEWS.STATS,           label: 'Stats',     icon: '◢' },
    ],
    []
  );

  function startQuiz(config) {
    setQuizConfig({ ...config, mode: config.mode || 'practice' });
    setView(VIEWS.QUIZ);
  }

  function finishQuiz(result) {
    setLastResult(result);
    setStats(loadState());
    setView(VIEWS.RESULTS);
  }

  function handleNavigate(target, payload) {
    if (target === VIEWS.QUIZ && payload) {
      startQuiz(payload);
      return;
    }
    setView(target);
  }

  return (
    <Layout
      navItems={navItems}
      activeId={mapViewToNav(view)}
      onNavigate={handleNavigate}
      title={TITLES[view]}
      stats={stats}
    >
      {view === VIEWS.HOME && (
        <Dashboard
          stats={stats}
          onNavigate={handleNavigate}
        />
      )}

      {view === VIEWS.PRACTICE_SETUP && (
        <QuizSetup onStart={startQuiz} onCancel={() => setView(VIEWS.HOME)} />
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
            else if (lastResult.mode === 'exam') setView(VIEWS.EXAM);
            else setView(VIEWS.PRACTICE_SETUP);
          }}
          onHome={() => setView(VIEWS.HOME)}
          onPractice={() => setView(VIEWS.PRACTICE_SETUP)}
          onGames={() => setView(VIEWS.GAMES)}
        />
      )}

      {view === VIEWS.DAILY && (
        <DailyChallenge onFinish={finishQuiz} onHome={() => setView(VIEWS.HOME)} />
      )}

      {view === VIEWS.EXAM && (
        <ExamSimulation onFinish={finishQuiz} onHome={() => setView(VIEWS.HOME)} />
      )}

      {view === VIEWS.FLASHCARDS && <Flashcards onHome={() => setView(VIEWS.HOME)} />}

      {view === VIEWS.STATS && (
        <Stats
          stats={stats}
          onHome={() => setView(VIEWS.HOME)}
          onReset={() => setStats(loadState())}
          onPractice={() => setView(VIEWS.PRACTICE_SETUP)}
          onGames={() => setView(VIEWS.GAMES)}
        />
      )}

      {view === VIEWS.GAMES && (
        <MiniGames stats={stats} onHome={() => setView(VIEWS.HOME)} onRefresh={() => setStats(loadState())} />
      )}
    </Layout>
  );
}

function mapViewToNav(view) {
  if (view === 'quiz') return 'practice-setup';
  if (view === 'results') return 'home';
  return view;
}
