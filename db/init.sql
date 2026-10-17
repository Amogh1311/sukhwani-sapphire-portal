-- Sukhwani Sapphire Cultural Portal — initial schema + seed data.
-- Run once against your Neon database, e.g.:
--   psql "$DATABASE_URL" -f db/init.sql
-- or paste into the Neon SQL editor.
-- Safe to re-run: uses IF NOT EXISTS / ON CONFLICT.

CREATE TABLE IF NOT EXISTS units (
  id           SERIAL PRIMARY KEY,
  wing         TEXT NOT NULL,
  flat         TEXT NOT NULL,
  is_committee BOOLEAN NOT NULL DEFAULT FALSE,
  UNIQUE (wing, flat)
);

CREATE TABLE IF NOT EXISTS expenses (
  id              SERIAL PRIMARY KEY,
  occurred_on     DATE NOT NULL,
  category        TEXT NOT NULL,
  amount_inr      NUMERIC(10, 2) NOT NULL CHECK (amount_inr >= 0),
  description     TEXT NOT NULL,
  created_by_unit TEXT NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS expenses_occurred_on_idx
  ON expenses (occurred_on DESC, id DESC);

CREATE TABLE IF NOT EXISTS announcements (
  id             SERIAL PRIMARY KEY,
  title          TEXT NOT NULL,
  body           TEXT NOT NULL,
  canva_url      TEXT,
  posted_by_unit TEXT NOT NULL,
  posted_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS announcements_posted_at_idx
  ON announcements (posted_at DESC, id DESC);

-- Seed wings + flats. D-401 is the committee unit; flip is_committee=true
-- on other units via SQL to grant additional editors.
INSERT INTO units (wing, flat, is_committee) VALUES
  ('A','101', FALSE), ('A','102', FALSE), ('A','201', FALSE), ('A','202', FALSE),
  ('A','301', FALSE), ('A','302', FALSE), ('A','401', FALSE), ('A','402', FALSE),
  ('B','101', FALSE), ('B','102', FALSE), ('B','201', FALSE), ('B','202', FALSE),
  ('B','301', FALSE), ('B','302', FALSE), ('B','401', FALSE), ('B','402', FALSE),
  ('C','101', FALSE), ('C','102', FALSE), ('C','201', FALSE), ('C','202', FALSE),
  ('C','301', FALSE), ('C','302', FALSE), ('C','401', FALSE), ('C','402', FALSE),
  ('D','101', FALSE), ('D','102', FALSE), ('D','201', FALSE), ('D','202', FALSE),
  ('D','301', FALSE), ('D','401', TRUE),  ('D','402', FALSE)
ON CONFLICT (wing, flat) DO NOTHING;

-- ---------- Notifications ----------

-- Phone numbers (and their delivery preferences) that should receive
-- notifications when society events happen. Recipients are independent of
-- committee status — add anyone (treasurer, security, advisor) without
-- granting them edit access.
CREATE TABLE IF NOT EXISTS notification_recipients (
  id           SERIAL PRIMARY KEY,
  unit_label   TEXT,                                       -- nullable: external person, no unit
  phone        TEXT NOT NULL,                              -- E.164, e.g. '+919545208412'
  name         TEXT,
  channels     TEXT[] NOT NULL DEFAULT '{whatsapp,sms}',   -- ordered preference; tried in order
  event_types  TEXT[] NOT NULL DEFAULT '{announcement.created,expense.created}',
  is_active    BOOLEAN NOT NULL DEFAULT TRUE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- One row per delivery attempt. Lets us see what was sent, what failed,
-- and replay/audit without grepping Vercel logs.
CREATE TABLE IF NOT EXISTS notification_log (
  id              SERIAL PRIMARY KEY,
  event_type      TEXT NOT NULL,
  recipient_id    INTEGER REFERENCES notification_recipients(id) ON DELETE SET NULL,
  channel         TEXT NOT NULL,                            -- 'log' | 'whatsapp' | 'sms' | 'email'
  payload         JSONB NOT NULL,
  status          TEXT NOT NULL,                            -- 'sent' | 'failed' | 'skipped'
  error           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS notification_log_created_at_idx
  ON notification_log (created_at DESC);

-- Seed D-401 (your phone) as the default recipient. Re-running this is a
-- no-op if the row already exists; phone is the natural key for upsert.
INSERT INTO notification_recipients (unit_label, phone, name, channels, event_types)
VALUES ('D-401', '+919545208412', 'Committee (D-401)',
        '{whatsapp,sms,email}',
        '{announcement.created,expense.created}')
ON CONFLICT DO NOTHING;
