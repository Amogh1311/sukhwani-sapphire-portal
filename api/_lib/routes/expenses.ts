import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { getSql } from '../db';
import { requireCommittee } from '../auth';
import { ExpenseCreate } from '../schemas';
import { notify } from '../notification';
import type { ExpenseCreatedPayload } from '../notification/events';

const Params = z.object({ id: z.coerce.number().int().positive() });

export const expensesRoutes = new Hono();

// List expenses — anyone (incl. anonymous) can read.
expensesRoutes.get('/', async (c) => {
  const sql = getSql();
  const rows = await sql<
    Array<{
      id: number;
      occurred_on: string;
      category: string;
      amount_inr: string; // postgres.js returns NUMERIC as string
      description: string;
      created_by_unit: string;
      created_at: string;
    }>
  >`
    SELECT id, occurred_on, category, amount_inr, description,
           created_by_unit, created_at
    FROM expenses
    ORDER BY occurred_on DESC, id DESC
  `;
  return c.json(
    rows.map((r) => ({
      ...r,
      amount_inr: Number(r.amount_inr),
    }))
  );
});

// Create an expense — committee only. Fires notification to recipients.
expensesRoutes.post(
  '/',
  zValidator('json', ExpenseCreate, (result, c) => {
    if (!result.success) {
      return c.json(
        {
          error: {
            code: 'BAD_REQUEST',
            message: result.error.issues
              .map((i) => `${i.path.join('.')}: ${i.message}`)
              .join('; '),
          },
        },
        400
      );
    }
    return undefined;
  }),
  async (c) => {
    const blocked = requireCommittee(c);
    if (blocked) return blocked;
    const ctx = c.get('unitCtx');
    const body = c.req.valid('json');
    const sql = getSql();
    const rows = await sql<
      Array<{
        id: number;
        occurred_on: string;
        category: string;
        amount_inr: string;
        description: string;
        created_by_unit: string;
        created_at: string;
      }>
    >`
      INSERT INTO expenses (occurred_on, category, amount_inr, description, created_by_unit)
      VALUES (${body.occurred_on}, ${body.category}, ${body.amount_inr},
              ${body.description}, ${ctx.unit})
      RETURNING id, occurred_on, category, amount_inr, description,
                created_by_unit, created_at
    `;
    const r = rows[0];
    const created = { ...r, amount_inr: Number(r.amount_inr) };

    const payload: ExpenseCreatedPayload = { kind: 'expense.created', ...created };
    const p = notify(payload);
    if (c.executionCtx?.waitUntil) {
      c.executionCtx.waitUntil(p);
    } else {
      p.catch((e) => console.error('expense notification error', e));
    }

    return c.json(created, 201);
  }
);

// Delete — committee only.
expensesRoutes.delete('/:id', zValidator('param', Params), async (c) => {
  const blocked = requireCommittee(c);
  if (blocked) return blocked;
  const { id } = c.req.valid('param');
  const sql = getSql();
  const rows = await sql`DELETE FROM expenses WHERE id = ${id} RETURNING id`;
  if (rows.length === 0) {
    return c.json(
      { error: { code: 'NOT_FOUND', message: `Expense ${id} not found.` } },
      404
    );
  }
  return c.body(null, 204);
});
