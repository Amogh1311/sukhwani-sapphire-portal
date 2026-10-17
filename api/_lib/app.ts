import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { unitMiddleware, type UnitContext } from './auth';
import { expensesRoutes } from './routes/expenses';
import { announcementsRoutes } from './routes/announcements';
import { unitsRoutes } from './routes/units';
import { healthRoutes } from './routes/health';

type Variables = { unitCtx: UnitContext };

export const app = new Hono<{ Variables: Variables }>();

const allowedOrigin = process.env.ALLOWED_ORIGIN ?? '*';

app.use('*', cors({ origin: allowedOrigin, credentials: false }));
app.use('*', unitMiddleware);

app.route('/api/health', healthRoutes);
app.route('/api/units', unitsRoutes);
app.route('/api/expenses', expensesRoutes);
app.route('/api/announcements', announcementsRoutes);

app.notFound((c) =>
  c.json(
    { error: { code: 'NOT_FOUND', message: `No route for ${c.req.method} ${c.req.path}` } },
    404
  )
);

app.onError((err, c) => {
  console.error('unhandled error', err);
  return c.json(
    { error: { code: 'INTERNAL', message: err.message || 'Internal error' } },
    500
  );
});
