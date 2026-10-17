import { z } from 'zod';

// ---------- Units ----------
export const UnitLabel = z
  .string()
  .regex(/^[A-D]-\d{3}$/, 'Unit must look like A-101 or D-401');

export const Unit = z.object({
  wing: z.string(),
  flat: z.string(),
  label: UnitLabel,
  is_committee: z.boolean(),
});

// ---------- Expenses ----------
export const ExpenseCreate = z.object({
  occurred_on: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'occurred_on must be YYYY-MM-DD'),
  category: z.string().min(1).max(40),
  amount_inr: z.number().positive().max(10_000_000),
  description: z.string().min(1).max(500),
});

export const Expense = ExpenseCreate.extend({
  id: z.number().int().positive(),
  created_by_unit: UnitLabel,
  created_at: z.string(), // ISO timestamp
});

// ---------- Announcements ----------
export const AnnouncementCreate = z.object({
  title: z.string().min(1).max(120),
  body: z.string().min(1).max(4000),
  canva_url: z
    .string()
    .url()
    .refine((u) => u.includes('canva.com'), 'Must be a canva.com URL')
    .optional()
    .or(z.literal('').transform(() => undefined)),
});

export const Announcement = AnnouncementCreate.extend({
  id: z.number().int().positive(),
  posted_by_unit: UnitLabel,
  posted_at: z.string(),
});

// ---------- Error shape ----------
export const ApiError = z.object({
  error: z.object({
    code: z.enum(['BAD_REQUEST', 'FORBIDDEN', 'NOT_FOUND', 'INTERNAL']),
    message: z.string(),
  }),
});
