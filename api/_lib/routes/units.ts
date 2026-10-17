import { Hono } from 'hono';
import { getSql } from '../db';

export const unitsRoutes = new Hono();

unitsRoutes.get('/', async (c) => {
  const sql = getSql();
  const rows = await sql<
    Array<{ wing: string; flat: string; is_committee: boolean }>
  >`
    SELECT wing, flat, is_committee
    FROM units
    ORDER BY wing, flat
  `;
  return c.json(
    rows.map((r) => ({
      wing: r.wing,
      flat: r.flat,
      label: `${r.wing}-${r.flat}`,
      is_committee: r.is_committee,
    }))
  );
});
