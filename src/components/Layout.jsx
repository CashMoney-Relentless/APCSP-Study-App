import React, { useState } from 'react';

export default function Layout({ navItems, activeId, onNavigate, title, stats, children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-ink-900">
      <Sidebar
        navItems={navItems}
        activeId={activeId}
        onNavigate={onNavigate}
        stats={stats}
        open={open}
        onClose={() => setOpen(false)}
      />

      <div className="lg:pl-64">
        <Topbar title={title} onMenu={() => setOpen((v) => !v)} stats={stats} onHome={() => onNavigate('home')} />
        <main className="mx-auto w-full max-w-6xl px-4 py-8 lg:px-8">
          {children}
        </main>
        <footer className="border-t border-ink-100 bg-white py-6 text-center text-xs text-ink-400">
          AP CSP Mastery Lab · saved locally · no backend
        </footer>
      </div>
    </div>
  );
}

function Sidebar({ navItems, activeId, onNavigate, stats, open, onClose }) {
  return (
    <>
      <aside
        className={`fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r border-ink-100 bg-ink-900 text-ink-100 transition-transform duration-300
          ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
      >
        <div className="flex items-center gap-3 border-b border-ink-700 px-5 py-5">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand-500 text-sm font-bold text-white shadow-soft">
            ML
          </div>
          <div>
            <div className="text-sm font-bold tracking-tight text-white">Mastery Lab</div>
            <div className="text-[11px] uppercase tracking-[0.18em] text-ink-300">AP CSP</div>
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4 scroll-thin">
          {navItems.map((item) => {
            const active = item.id === activeId;
            return (
              <button
                key={item.id}
                onClick={() => { onNavigate(item.id); onClose(); }}
                className={`relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition
                  ${active
                    ? 'bg-brand-500 text-white shadow-pop'
                    : 'text-ink-200 hover:bg-ink-700 hover:text-white'}`}
              >
                <span className="grid h-6 w-6 place-items-center text-base">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="border-t border-ink-700 p-4">
          <SidebarSummary stats={stats} />
        </div>
      </aside>
      {open && (
        <div
          className="fixed inset-0 z-20 bg-black/40 backdrop-blur-[1px] lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
    </>
  );
}

function SidebarSummary({ stats }) {
  const accuracy =
    stats.totalQuestions > 0
      ? Math.round((stats.totalCorrect / stats.totalQuestions) * 100)
      : 0;

  return (
    <div className="space-y-3">
      <div className="rounded-xl bg-ink-700/60 p-3">
        <div className="text-[11px] uppercase tracking-[0.16em] text-ink-300">Mastery</div>
        <div className="mt-1 text-2xl font-bold text-white">{accuracy}%</div>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-ink-600">
          <div
            className="h-full rounded-full bg-brand-400 transition-all duration-500"
            style={{ width: `${accuracy}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-lg bg-ink-700/60 p-2 text-center">
          <div className="text-base font-bold text-white">{stats.dailyStreak}</div>
          <div className="text-[10px] uppercase tracking-wider text-ink-300">Streak 🔥</div>
        </div>
        <div className="rounded-lg bg-ink-700/60 p-2 text-center">
          <div className="text-base font-bold text-brand-300">{stats.totalPoints}</div>
          <div className="text-[10px] uppercase tracking-wider text-ink-300">Points</div>
        </div>
      </div>
    </div>
  );
}

function Topbar({ title, onMenu, stats, onHome }) {
  const accuracy =
    stats.totalQuestions > 0
      ? Math.round((stats.totalCorrect / stats.totalQuestions) * 100)
      : 0;
  return (
    <header className="sticky top-0 z-10 flex items-center gap-3 border-b border-ink-100 bg-white/80 px-4 py-3 backdrop-blur lg:px-8">
      <button
        onClick={onMenu}
        className="grid h-9 w-9 place-items-center rounded-lg border border-ink-200 text-ink-700 lg:hidden"
        aria-label="Open menu"
      >
        <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor"><path d="M3 5h14v2H3zM3 9h14v2H3zM3 13h14v2H3z"/></svg>
      </button>
      <div className="flex flex-col">
        <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-400">AP CSP</span>
        <button onClick={onHome} className="text-base font-bold text-ink-900 hover:text-brand-600">
          {title}
        </button>
      </div>
      <div className="ml-auto hidden items-center gap-3 md:flex">
        <div className="pill">
          <span className="text-ink-400">Mastery</span>
          <span className="font-semibold text-ink-900">{accuracy}%</span>
        </div>
        <div className="pill-blue">
          <span>Points</span>
          <span>{stats.totalPoints}</span>
        </div>
        <div className="pill">
          <span>🔥</span>
          <span className="font-semibold">{stats.dailyStreak}</span>
        </div>
      </div>
    </header>
  );
}
