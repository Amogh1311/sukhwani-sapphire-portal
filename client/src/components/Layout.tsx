import { NavLink, Outlet } from 'react-router-dom';
import { ThemeBackground } from './ThemeBackground';
import { useActiveFestival } from '../theme/ThemeProvider';
import { UnitSelector } from '../auth/UnitSelector';
import { useUnit } from '../auth/UnitContext';

const NAV = [
  { to: '/', label: 'Home', end: true },
  { to: '/members', label: 'Members' },
  { to: '/expenses', label: 'Expenses' },
  { to: '/announcements', label: 'Announcements' },
];

export function Layout() {
  const active = useActiveFestival();
  const { unit, isCommittee } = useUnit();

  return (
    <>
      <ThemeBackground />
      <div className="min-h-full">
        <header className="surface mx-3 mt-3 px-4 py-3 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="text-2xl">🪷</div>
            <div>
              <h1 className="font-display text-xl font-semibold leading-tight">
                Sukhwani Sapphire
              </h1>
              <p className="text-xs text-muted">Cultural Portal</p>
            </div>
          </div>
          <nav className="flex flex-wrap items-center gap-1">
            {NAV.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.end}
                className={({ isActive }) =>
                  `btn-ghost text-sm ${isActive ? '!bg-primary !text-white' : ''}`
                }
              >
                {n.label}
              </NavLink>
            ))}
            <div className="ml-2 pl-2 border-l border-white/40">
              <UnitSelector />
            </div>
            {unit && isCommittee && (
              <span className="ml-2 rounded-full bg-primary/15 px-2 py-0.5 text-xs text-primary">
                committee
              </span>
            )}
          </nav>
        </header>

        {active && (
          <div className="mx-3 mt-3 surface px-4 py-2 text-sm flex items-center gap-2">
            <span className="text-lg" aria-hidden>
              {active.festival.emoji}
            </span>
            <strong className="font-display">{active.festival.name}</strong>
            <span className="text-muted">·</span>
            {active.mode === 'active' ? (
              <span>
                Day {active.daysInto} of {active.totalDays} · {active.festival.tagline}
              </span>
            ) : (
              <span>
                starts in {active.daysUntilStart} day
                {active.daysUntilStart === 1 ? '' : 's'} · {active.festival.tagline}
              </span>
            )}
          </div>
        )}

        <main className="mx-3 my-3">
          <Outlet />
        </main>
      </div>
    </>
  );
}
