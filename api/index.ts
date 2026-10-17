/**
 * Vercel serverless function entry. Auto-discovered by Vercel at
 *   api/index.ts  →  serves all requests at `/api/*`
 * because Hono handles its own internal routing once `app.fetch` is wired
 * to the incoming Request.
 *
 * Vercel ignores files starting with `_` (the `_lib/` directory), so the
 * shared backend code lives there without being mistaken for a separate
 * serverless function.
 */
import { app } from './_lib/app';

export default async function handler(request: Request): Promise<Response> {
  return app.fetch(request);
}
