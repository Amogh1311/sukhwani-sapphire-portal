import { useEffect, useState } from 'react';
import { useUnit } from '../auth/UnitContext';
import { RequireCommittee } from '../auth/RequireCommittee';
import {
  createExpense,
  deleteExpense,
  fetchExpenses,
  type Expense,
  type ExpenseInput,
} from '../api/client';

const CATEGORIES = [
  'Festival',
  'Maintenance',
  'Utilities',
  'Security',
  'Cleaning',
  'Events',
  'Other',
];

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function ExpensesPage() {
  const { unit, isCommittee } = useUnit();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<ExpenseInput>({
    occurred_on: todayISO(),
    category: CATEGORIES[0],
    amount_inr: 0,
    description: '',
  });

  async function load() {
    setLoading(true);
    setError(null);
    try {
      setExpenses(await fetchExpenses(unit));
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
      const created = await createExpense(unit, form);
      setExpenses((prev) => [created, ...prev]);
      setForm({ ...form, amount_inr: 0, description: '' });
    } catch (err) {
      setError((err as Error).message);
    }
  }

  async function onDelete(id: number) {
    if (!unit) return;
    if (!confirm('Delete this expense?')) return;
    try {
      await deleteExpense(unit, id);
      setExpenses((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      setError((err as Error).message);
    }
  }

  const total = expenses.reduce((s, e) => s + e.amount_inr, 0);

  return (
    <div className="max-w-5xl space-y-4">
      <div className="surface p-6">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <h2 className="font-display text-2xl font-semibold">Expenses</h2>
            <p className="text-sm text-muted">
              {expenses.length} entries · ₹{total.toLocaleString('en-IN')} total
            </p>
          </div>
          {!unit && (
            <p className="text-sm text-muted">
              Select your wing + flat to load expenses.
            </p>
          )}
        </div>

        {error && (
          <div className="mt-3 rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-800">
            {error}
          </div>
        )}

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-3 py-2">Date</th>
                <th className="px-3 py-2">Category</th>
                <th className="px-3 py-2">Description</th>
                <th className="px-3 py-2 text-right">Amount (₹)</th>
                <th className="px-3 py-2">By</th>
                {isCommittee && <th className="px-3 py-2" />}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/40">
              {loading && (
                <tr>
                  <td colSpan={6} className="px-3 py-6 text-center text-muted">
                    Loading…
                  </td>
                </tr>
              )}
              {!loading && expenses.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-3 py-6 text-center text-muted">
                    No expenses yet.
                  </td>
                </tr>
              )}
              {!loading &&
                expenses.map((e) => (
                  <tr key={e.id} className="hover:bg-white/40">
                    <td className="px-3 py-2 font-mono text-xs">{e.occurred_on}</td>
                    <td className="px-3 py-2">
                      <span className="rounded-full bg-white/70 px-2 py-0.5 text-xs">
                        {e.category}
                      </span>
                    </td>
                    <td className="px-3 py-2">{e.description}</td>
                    <td className="px-3 py-2 text-right font-mono">
                      {e.amount_inr.toLocaleString('en-IN')}
                    </td>
                    <td className="px-3 py-2 text-xs text-muted">{e.created_by_unit}</td>
                    {isCommittee && (
                      <td className="px-3 py-2 text-right">
                        <button
                          onClick={() => onDelete(e.id)}
                          className="text-xs text-red-700 hover:underline"
                        >
                          delete
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      <RequireCommittee>
        <form onSubmit={onSubmit} className="surface p-6">
          <h3 className="font-display text-xl font-semibold">Add expense</h3>
          <p className="text-sm text-muted">
            Posted as <strong>{unit}</strong>.
          </p>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <label className="text-sm">
              <span className="block text-xs text-muted">Date</span>
              <input
                type="date"
                value={form.occurred_on}
                onChange={(e) => setForm({ ...form, occurred_on: e.target.value })}
                required
                className="mt-1 w-full rounded-md border border-white/60 bg-white/80 px-2 py-1.5 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </label>
            <label className="text-sm">
              <span className="block text-xs text-muted">Category</span>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="mt-1 w-full rounded-md border border-white/60 bg-white/80 px-2 py-1.5 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm">
              <span className="block text-xs text-muted">Amount (₹)</span>
              <input
                type="number"
                min={1}
                step="0.01"
                value={form.amount_inr || ''}
                onChange={(e) =>
                  setForm({ ...form, amount_inr: Number(e.target.value) })
                }
                required
                className="mt-1 w-full rounded-md border border-white/60 bg-white/80 px-2 py-1.5 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </label>
            <label className="text-sm sm:col-span-2 lg:col-span-1">
              <span className="block text-xs text-muted">Description</span>
              <input
                type="text"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                required
                maxLength={500}
                className="mt-1 w-full rounded-md border border-white/60 bg-white/80 px-2 py-1.5 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </label>
          </div>
          <div className="mt-4 flex justify-end">
            <button type="submit" className="btn-primary">
              Add expense
            </button>
          </div>
        </form>
      </RequireCommittee>
    </div>
  );
}
