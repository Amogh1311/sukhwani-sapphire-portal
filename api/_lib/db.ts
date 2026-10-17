import postgres from 'postgres';

/**
 * Postgres client. Uses the DATABASE_URL env var. We instantiate lazily so
 * Vercel serverless cold-start doesn't try to connect during build.
 */
let _sql: ReturnType<typeof postgres> | null = null;

export function getSql() {
  if (!_sql) {
    const url = process.env.DATABASE_URL;
    if (!url) {
      throw new Error('DATABASE_URL env var is not set');
    }
    _sql = postgres(url, {
      max: 1, // Vercel serverless: one connection per function instance
      idle_timeout: 20,
      prepare: false, // Neon: disable prepared statements for compatibility
    });
  }
  return _sql;
}
