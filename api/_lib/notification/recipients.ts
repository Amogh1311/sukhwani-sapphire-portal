import { getSql } from '../db';
import type { EventType } from './events';

export type Recipient = {
  id: number;
  unit_label: string | null;
  phone: string;
  name: string | null;
  channels: string[];
};

/**
 * Resolve active recipients for an event, optionally excluding the poster
 * so they don't notify themselves.
 */
export async function resolveRecipients(
  eventType: EventType,
  excludeUnit: string | null
): Promise<Recipient[]> {
  const sql = getSql();
  // Postgres: ANY(event_types) checks array membership. Cast eventType to
  // text so the comparison works (postgres.js sends parameters as text by
  // default; arrays are passed as PG array literals via the helper).
  const rows = await sql<Array<{
    id: number;
    unit_label: string | null;
    phone: string;
    name: string | null;
    channels: string[];
  }>>`
    SELECT id, unit_label, phone, name, channels
    FROM notification_recipients
    WHERE is_active = TRUE
      AND (unit_label IS NULL OR unit_label <> ${excludeUnit ?? ''})
      AND ${eventType} = ANY(event_types)
  `;
  return rows;
}
