import { getSql } from '../db';
import type { EventType } from './events';

export type LogStatus = 'sent' | 'failed' | 'skipped';

export async function logAttempt(args: {
  eventType: EventType;
  recipientId: number | null;
  channel: string;
  payload: unknown;
  status: LogStatus;
  error?: string;
}): Promise<void> {
  try {
    const sql = getSql();
    await sql`
      INSERT INTO notification_log (event_type, recipient_id, channel, payload, status, error)
      VALUES (
        ${args.eventType},
        ${args.recipientId},
        ${args.channel},
        ${sql.json(args.payload as Record<string, unknown>)},
        ${args.status},
        ${args.error ?? null}
      )
    `;
  } catch (e) {
    // Don't let logging failure cascade — fall back to console.
    console.error('notification_log insert failed', e, args);
  }
}
