import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { getSql } from '../db';
import { requireCommittee } from '../auth';
import { AnnouncementCreate } from '../schemas';
import { notify } from '../notification';
import type { AnnouncementCreatedPayload } from '../notification/events';

const Params = z.object({ id: z.coerce.number().int().positive() });

export const announcementsRoutes = new Hono();

announcementsRoutes.get('/', async (c) => {
  const sql = getSql();
  const rows = await sql<
    Array<{
      id: number;
      title: string;
      body: string;
      canva_url: string | null;
      posted_by_unit: string;
      posted_at: string;
    }>
  >`
    SELECT id, title, body, canva_url, posted_by_unit, posted_at
    FROM announcements
    ORDER BY posted_at DESC, id DESC
  `;
  return c.json(rows);
});

// POST is open to any selected unit (residents submit queries). The
// committee gate was deliberately removed — see plan. Committee can still
// DELETE to moderate.
announcementsRoutes.post(
  '/',
  zValidator('json', AnnouncementCreate, (result, c) => {
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
    const ctx = c.get('unitCtx');
    if (!ctx.unit) {
      return c.json(
        {
          error: {
            code: 'FORBIDDEN',
            message: 'Select your wing + flat to post.',
          },
        },
        403
      );
    }
    const body = c.req.valid('json');
    const sql = getSql();
    const rows = await sql<
      Array<{
        id: number;
        title: string;
        body: string;
        canva_url: string | null;
        posted_by_unit: string;
        posted_at: string;
      }>
    >`
      INSERT INTO announcements (title, body, canva_url, posted_by_unit)
      VALUES (${body.title}, ${body.body}, ${body.canva_url ?? null}, ${ctx.unit})
      RETURNING id, title, body, canva_url, posted_by_unit, posted_at
    `;
    const created = rows[0];

    // Fire-and-forget notification. Use Vercel's waitUntil when available
    // so the user's POST returns fast; otherwise fire-and-forget locally.
    const payload: AnnouncementCreatedPayload = { kind: 'announcement.created', ...created };
    const p = notify(payload);
    if (c.executionCtx?.waitUntil) {
      c.executionCtx.waitUntil(p);
    } else {
      p.catch((e) => console.error('announcement notification error', e));
    }

    return c.json(created, 201);
  }
);

announcementsRoutes.delete('/:id', zValidator('param', Params), async (c) => {
  const blocked = requireCommittee(c);
  if (blocked) return blocked;
  const { id } = c.req.valid('param');
  const sql = getSql();
  const rows = await sql`DELETE FROM announcements WHERE id = ${id} RETURNING id`;
  if (rows.length === 0) {
    return c.json(
      { error: { code: 'NOT_FOUND', message: `Announcement ${id} not found.` } },
      404
    );
  }
  return c.body(null, 204);
});
