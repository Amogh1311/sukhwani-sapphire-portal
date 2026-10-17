import { useMemo, useState } from 'react';
import { WhatsAppIcon } from './WhatsAppIcon';
import type { Member, MemberRole } from '../data/members';

type Props = { members: Member[] };

const ROLE_STYLES: Record<MemberRole, string> = {
  Owner: 'bg-emerald-100 text-emerald-800',
  Tenant: 'bg-amber-100 text-amber-800',
  Committee: 'bg-primary/15 text-primary',
};

export function MembersTable({ members }: Props) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return members;
    return members.filter((m) =>
      [m.name, m.unit, m.phone, m.role, m.email ?? ''].some((s) =>
        s.toLowerCase().includes(q)
      )
    );
  }, [members, query]);

  return (
    <div className="surface overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/40 px-4 py-3">
        <div>
          <h2 className="font-display text-2xl font-semibold">Members</h2>
          <p className="text-sm text-muted">
            {filtered.length} of {members.length} residents ·{' '}
            {members.filter((m) => m.role === 'Committee').length} committee
          </p>
        </div>
        <input
          type="search"
          placeholder="Search name, unit, phone…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full max-w-xs rounded-lg border border-white/60 bg-white/80 px-3 py-2 text-sm outline-none placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {/* Desktop table */}
      <div className="hidden md:block">
        <table className="w-full text-sm">
          <thead className="bg-white/50 text-left text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Unit</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Email</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/40">
            {filtered.map((m) => (
              <tr key={m.id} className="hover:bg-white/40">
                <td className="px-4 py-3 font-medium">{m.name}</td>
                <td className="px-4 py-3 font-mono text-xs">{m.unit}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${ROLE_STYLES[m.role]}`}
                  >
                    {m.role}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs">{m.phone}</span>
                    <WhatsAppIcon phone={m.phone} name={m.name} />
                  </div>
                </td>
                <td className="px-4 py-3 text-muted">{m.email ?? '—'}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted">
                  No members match "{query}".
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden divide-y divide-white/40">
        {filtered.map((m) => (
          <div key={m.id} className="flex items-start justify-between gap-3 px-4 py-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="truncate font-medium">{m.name}</span>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-xs ${ROLE_STYLES[m.role]}`}
                >
                  {m.role}
                </span>
              </div>
              <div className="mt-0.5 text-xs text-muted">
                Unit {m.unit} ·{' '}
                <span className="font-mono">{m.phone}</span>
              </div>
              {m.email && (
                <div className="mt-0.5 truncate text-xs text-muted">{m.email}</div>
              )}
            </div>
            <WhatsAppIcon phone={m.phone} name={m.name} className="shrink-0" />
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="px-4 py-8 text-center text-muted">
            No members match "{query}".
          </div>
        )}
      </div>
    </div>
  );
}
