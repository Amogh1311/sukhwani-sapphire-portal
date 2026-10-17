import type { EventPayload, EventType } from './events';

/**
 * One line per event type. Channels consume this string — keep it short
 * because SMS has a 160-char limit and WhatsApp truncates around 1024.
 */
export function formatMessage(p: EventPayload): string {
  switch (p.kind) {
    case 'announcement.created':
      return [
        `📢 New announcement from ${p.posted_by_unit}`,
        `"${p.title}"`,
        '',
        p.body.length > 200 ? p.body.slice(0, 200) + '…' : p.body,
        '',
        `Posted: ${new Date(p.posted_at).toLocaleString('en-IN')}`,
      ].join('\n');
    case 'expense.created':
      return [
        `💰 New expense logged by ${p.created_by_unit}`,
        `${p.category} · ₹${p.amount_inr.toLocaleString('en-IN')} · ${p.occurred_on}`,
        p.description,
      ].join('\n');
  }
}

export function eventTypeOf(p: EventPayload): EventType {
  return p.kind;
}
