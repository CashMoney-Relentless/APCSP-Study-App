import React, { useState } from 'react';
import BinaryRush from './games/BinaryRush.jsx';
import AlgorithmOrder from './games/AlgorithmOrder.jsx';
import BugHunt from './games/BugHunt.jsx';
import LogicGate from './games/LogicGate.jsx';

const GAMES = [
  { id: 'binaryRush',     title: 'Binary Rush',     desc: 'Convert decimal ↔ binary against the clock.',     skill: 'Binary',         component: BinaryRush },
  { id: 'algorithmOrder', title: 'Algorithm Order', desc: 'Reorder shuffled pseudocode steps.',              skill: 'Algorithms',     component: AlgorithmOrder },
  { id: 'bugHunt',        title: 'Bug Hunt',        desc: 'Find the line that breaks the program.',           skill: 'Procedures',     component: BugHunt },
  { id: 'logicGate',      title: 'Logic Gate',      desc: 'Pick the operator that satisfies a truth pattern.', skill: 'Boolean logic', component: LogicGate },
];

export default function MiniGames({ stats, onHome, onRefresh }) {
  const [active, setActive] = useState(null);

  if (active) {
    const game = GAMES.find((g) => g.id === active);
    const Game = game.component;
    return (
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <button className="btn-ghost" onClick={() => { setActive(null); onRefresh && onRefresh(); }}>← All games</button>
          <h2 className="section-title">{game.title}</h2>
          <span className="pill-blue">{game.skill}</span>
          <span className="ml-auto text-sm text-ink-500">
            High score: <strong>{stats.gameHighScores?.[game.id] || 0}</strong>
          </span>
        </div>
        <Game onExit={() => { setActive(null); onRefresh && onRefresh(); }} />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-up">
      <header>
        <h2 className="section-title">Mini Games</h2>
        <p className="mt-2 text-sm text-ink-500">
          Each game targets a specific AP CSP skill. High scores are saved on this device.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {GAMES.map((g) => (
          <button
            key={g.id}
            onClick={() => setActive(g.id)}
            className="group card flex flex-col items-start gap-3 p-6 text-left transition hover:-translate-y-0.5 hover:shadow-pop"
          >
            <span className="pill-blue">{g.skill}</span>
            <h3 className="text-lg font-bold text-ink-900">{g.title}</h3>
            <p className="text-sm text-ink-500">{g.desc}</p>
            <div className="mt-auto flex w-full items-center justify-between">
              <span className="text-xs text-ink-400">
                High score: {stats.gameHighScores?.[g.id] || 0}
              </span>
              <span className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600 transition-transform group-hover:translate-x-0.5">
                Play →
              </span>
            </div>
          </button>
        ))}
      </div>

      <div className="text-center text-xs text-ink-400">
        <button className="btn-ghost" onClick={onHome}>Back to dashboard</button>
      </div>
    </div>
  );
}
