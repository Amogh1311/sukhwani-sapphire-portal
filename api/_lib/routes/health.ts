import { Hono } from 'hono';
import { getSql } from '../db';

export const healthRoutes = new Hono();

healthRoutes.get('/', async (c) => {
  try {
    const sql = getSql();
    await sql`SELECT 1`;
    return c.json({ ok: true, db: 'up' });
  } catch (e) {
    return c.json(
      { ok: false, db: 'down', error: String(e) },
      503
    );
  }
});
