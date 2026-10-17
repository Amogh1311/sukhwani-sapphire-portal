/**
 * Local development entry. Run with `npm run dev`. Starts the Hono app
 * on a plain Node HTTP server at PORT (default 8787). Not used in
 * production — Vercel uses api/index.ts.
 */
import { serve } from '@hono/node-server';
import { app } from './_lib/app';

const port = Number(process.env.PORT ?? 8787);
serve({ fetch: app.fetch, port }, (info) => {
  console.log(`API listening on http://localhost:${info.port}`);
});
