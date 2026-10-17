import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useActiveFestival } from '../theme/ThemeProvider';
import { useUnit } from '../auth/UnitContext';
import { fetchAnnouncements, type Announcement } from '../api/client';

export function HomePage() {
  const active = useActiveFestival();
  const { unit } = useUnit();
  const [recent, setRecent] = useState<Announcement[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetchAnnouncements(unit)
      .then((a) => {
        if (!cancelled) setRecent(a.slice(0, 3));
      })
      .catch(() => {
        // swallow — HomePage should still render without announcements
      });
    return () => {
      cancelled = true;
    };
  }, [unit]);

  return (
    <div className="space-y-4 max-w-3xl">
      <div className="surface p-6 md:p-10">
        <p className="text-sm uppercase tracking-widest text-muted">
          Welcome to
        </p>
        <h1 className="font-display text-4xl md:text-5xl font-semibold leading-tight">
          Sukhwani Sapphire
        </h1>
        <p className="mt-2 text-lg text-muted">
          A residential cultural portal for our society's daily life,
          members, expenses, and the festivals that bring us together.
        </p>

        {active ? (
          <div className="mt-6 rounded-xl border border-primary/20 bg-primary/5 p-4">
            <div className="text-2xl">{active.festival.emoji}</div>
            <h2 className="mt-2 font-display text-2xl font-semibold">
              {active.festival.name}
            </h2>
            <p className="mt-1 text-muted">{active.festival.tagline}</p>
            <p className="mt-3 text-sm">
              {active.mode === 'active' ? (
                <>
                  Day {active.daysInto} of {active.totalDays} — running from{' '}
                  {active.start.toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                  })}{' '}
                  to{' '}
                  {active.end.toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                  })}
                  .
                </>
              ) : (
                <>
                  Starts in {active.daysUntilStart} day
                  {active.daysUntilStart === 1 ? '' : 's'} — on{' '}
                  {active.start.toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                  .
                </>
              )}
            </p>
          </div>
        ) : (
          <div className="mt-6 rounded-xl border border-white/60 bg-white/60 p-4">
            <div className="text-2xl">🪷</div>
            <h2 className="mt-2 font-display text-2xl font-semibold">
              No festival in the next 10 days
            </h2>
            <p className="mt-1 text-muted">
              The portal is showing the calm default theme.
            </p>
          </div>
        )}
      </div>

      <div className="surface p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold">Latest updates</h2>
          <Link to="/announcements" className="text-sm text-primary hover:underline">
            See all →
          </Link>
        </div>
        {!unit ? (
          <p className="mt-3 text-sm text-muted">
            Select your wing + flat to see announcements.
          </p>
        ) : recent.length === 0 ? (
          <p className="mt-3 text-sm text-muted">No announcements yet.</p>
        ) : (
          <ul className="mt-3 space-y-3">
            {recent.map((a) => (
              <li key={a.id} className="rounded-lg border border-white/60 bg-white/60 p-3">
                <div className="flex items-baseline justify-between gap-2">
                  <strong className="font-display">{a.title}</strong>
                  <span className="text-xs text-muted">{a.posted_by_unit}</span>
                </div>
                <p className="mt-1 line-clamp-2 text-sm text-muted">{a.body}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
