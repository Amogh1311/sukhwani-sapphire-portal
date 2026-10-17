import type {
  Announcement,
  AnnouncementInput,
  ApiError,
  Expense,
  ExpenseInput,
  Unit,
} from './types';

const BASE: string =
  (import.meta.env.VITE_API_BASE as string | undefined) ?? '/api';

type FetchOpts = {
  unit?: string | null;
  method?: 'GET' | 'POST' | 'DELETE';
  body?: unknown;
};

async function request<T>(path: string, opts: FetchOpts = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (opts.unit) headers['X-Unit'] = opts.unit;

  const res = await fetch(`${BASE}${path}`, {
    method: opts.method ?? 'GET',
    headers,
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });

  if (res.status === 204) return undefined as T;

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const err = (data as ApiError | null)?.error ?? {
      code: 'INTERNAL' as const,
      message: `HTTP ${res.status}`,
    };
    throw Object.assign(new Error(err.message), { code: err.code, status: res.status });
  }
  return data as T;
}

// ---------- Units ----------
export function fetchUnits(unit: string | null): Promise<Unit[]> {
  return request<Unit[]>('/units', { unit });
}

// ---------- Expenses ----------
export function fetchExpenses(unit: string | null): Promise<Expense[]> {
  return request<Expense[]>('/expenses', { unit });
}

export function createExpense(
  unit: string,
  input: ExpenseInput
): Promise<Expense> {
  return request<Expense>('/expenses', { unit, method: 'POST', body: input });
}

export function deleteExpense(unit: string, id: number): Promise<void> {
  return request<void>(`/expenses/${id}`, { unit, method: 'DELETE' });
}

// ---------- Announcements ----------
export function fetchAnnouncements(unit: string | null): Promise<Announcement[]> {
  return request<Announcement[]>('/announcements', { unit });
}

export function createAnnouncement(
  unit: string,
  input: AnnouncementInput
): Promise<Announcement> {
  return request<Announcement>('/announcements', {
    unit,
    method: 'POST',
    body: input,
  });
}

export function deleteAnnouncement(unit: string, id: number): Promise<void> {
  return request<void>(`/announcements/${id}`, { unit, method: 'DELETE' });
}
