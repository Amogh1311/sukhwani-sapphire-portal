import { useEffect, useState } from 'react';
import { useUnit } from '../auth/UnitContext';
import {
  createAnnouncement,
  deleteAnnouncement,
  fetchAnnouncements,
  type Announcement,
  type AnnouncementInput,
} from '../api/client';

/**
 * Convert a Canva share URL into an embed URL.
 *   https://www.canva.com/design/DAFxxx/view
 * → https://www.canva.com/design/DAFxxx/view?embed
 */
function toCanvaEmbed(url: string): string {
  try {
    const u = new URL(url);
    if (!u.searchParams.has('embed')) u.searchParams.set('embed', '');
    return u.toString();
  } catch {
    return url;
  }
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

export function AnnouncementsPage() {
  const { unit, isCommittee } = useUnit();
  const [items, setItems] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<AnnouncementInput>({
    title: '',
    body: '',
    canva_url: '',
  });

  async function load() {
    setLoading(true);
    setError(null);
    try {
      setItems(await fetchAnnouncements(unit));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unit]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!unit) return;
    setError(null);
    try {
      const created = await createAnnouncement(unit, form);
      setItems((prev) => [created, ...prev]);
      setForm({ title: '', body: '', canva_url: '' });
    } catch (err) {
      setError((err as Error).message);
    }
  }

  async function onDelete(id: number) {
    if (!unit) return;
    if (!confirm('Delete this announcement?')) return;
    try {
      await deleteAnnouncement(unit, id);
      setItems((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      setError((err as Error).message);
    }
  }

  return (
    <div className="max-w-3xl space-y-4">
      <div className="surface p-6">
        <h2 className="font-display text-2xl font-semibold">Announcements</h2>
        <p className="text-sm text-muted">
          Society updates, festival notices, and Canva designs.
        </p>

        {error && (
          <div className="mt-3 rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-800">
            {error}
          </div>
        )}

        {!unit && (
          <p className="mt-4 text-sm text-muted">
            Select your wing + flat to load announcements.
          </p>
        )}

        {unit && loading && (
          <p className="mt-4 text-sm text-muted">Loading…</p>
        )}

        {unit && !loading && items.length === 0 && (
          <p className="mt-4 text-sm text-muted">No announcements yet.</p>
        )}

        <ul className="mt-4 space-y-4">
          {items.map((a) => (
            <li key={a.id} className="rounded-xl border border-white/60 bg-white/60 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-display text-lg font-semibold">{a.title}</h3>
                  <p className="text-xs text-muted">
                    Posted by {a.posted_by_unit} · {formatDate(a.posted_at)}
                  </p>
                </div>
                {isCommittee && (
                  <button
                    onClick={() => onDelete(a.id)}
                    className="text-xs text-red-700 hover:underline"
                  >
                    delete
                  </button>
                )}
              </div>
              <p className="mt-2 whitespace-pre-wrap text-sm">{a.body}</p>
              {a.canva_url && (
                <div className="mt-3 overflow-hidden rounded-lg border border-white/60">
                  <iframe
                    src={toCanvaEmbed(a.canva_url)}
                    title={a.title}
                    className="h-[500px] w-full"
                    allowFullScreen
                    loading="lazy"
                  />
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>

      {unit ? (
        <form onSubmit={onSubmit} className="surface p-6">
          <h3 className="font-display text-xl font-semibold">New announcement</h3>
          <p className="text-sm text-muted">
            Posting as <strong>{unit}</strong>. Paste a Canva share link to
            embed the design below the body.
            {!isCommittee && (
              <>
                {' '}
                The committee is notified and can moderate this post.
              </>
            )}
          </p>
          <div className="mt-4 space-y-3">
            <label className="block text-sm">
              <span className="block text-xs text-muted">Title</span>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
                maxLength={120}
                className="mt-1 w-full rounded-md border border-white/60 bg-white/80 px-2 py-1.5 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </label>
            <label className="block text-sm">
              <span className="block text-xs text-muted">Body</span>
              <textarea
                value={form.body}
                onChange={(e) => setForm({ ...form, body: e.target.value })}
                required
                rows={5}
                maxLength={4000}
                className="mt-1 w-full rounded-md border border-white/60 bg-white/80 px-2 py-1.5 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </label>
            <label className="block text-sm">
              <span className="block text-xs text-muted">
                Canva share URL (optional)
              </span>
              <input
                type="url"
                value={form.canva_url ?? ''}
                onChange={(e) => setForm({ ...form, canva_url: e.target.value })}
                placeholder="https://www.canva.com/design/…/view"
                className="mt-1 w-full rounded-md border border-white/60 bg-white/80 px-2 py-1.5 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </label>
          </div>
          <div className="mt-4 flex justify-end">
            <button type="submit" className="btn-primary">
              Post announcement
            </button>
          </div>
        </form>
      ) : (
        <div className="surface mt-4 p-4 text-sm text-muted">
          Select your wing + flat in the top bar to post.
        </div>
      )}
    </div>
  );
}
