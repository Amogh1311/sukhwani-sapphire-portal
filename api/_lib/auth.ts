import type { Context, MiddlewareHandler } from 'hono';
import { getSql } from './db';

export type UnitContext = {
  /** Selected wing-flat in 'X-NNN' format. null if no/invalid header. */
  unit: string | null;
  /** True iff the selected unit is marked as committee in `units`. */
  isCommittee: boolean;
};

const UNIT_RE = /^([A-D])-(\d{3})$/;

/**
 * Middleware: parse X-Unit header, look up committee status, attach to
 * context. Missing/invalid header → unit=null, isCommittee=false (no
 * rejection at this layer; routes decide what to do).
 */
export const unitMiddleware: MiddlewareHandler = async (
  c: Context,
  next
) => {
  const raw = c.req.header('x-unit');
  let unit: string | null = null;
  let isCommittee = false;

  if (raw && UNIT_RE.test(raw)) {
    const m = UNIT_RE.exec(raw)!;
    const wing = m[1];
    const flat = m[2];
    const label = `${wing}-${flat}`;
    try {
      const rows = await getSql<{ is_committee: boolean }[]>`
        SELECT is_committee FROM units WHERE wing = ${wing} AND flat = ${flat}
      `;
      if (rows.length > 0) {
        unit = label;
        isCommittee = rows[0].is_committee;
      }
    } catch {
      // DB hiccup — fail closed: treat as no unit, no committee.
      unit = null;
      isCommittee = false;
    }
  }

  c.set('unitCtx', { unit, isCommittee });
  await next();
};

/** Gate for write endpoints. Returns a Response if blocked, otherwise null. */
export function requireCommittee(c: Context): Response | null {
  const ctx = c.get('unitCtx');
  if (!ctx.unit) {
    return c.json(
      { error: { code: 'FORBIDDEN', message: 'X-Unit header missing or invalid.' } },
      403
    );
  }
  if (!ctx.isCommittee) {
    return c.json(
      {
        error: {
          code: 'FORBIDDEN',
          message: `Unit ${ctx.unit} is not authorized to make changes.`,
        },
      },
      403
    );
  }
  return null;
}
