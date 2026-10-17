import { getChannel } from './channels';
import { resolveRecipients, type Recipient } from './recipients';
import { formatMessage } from './text';
import { logAttempt } from './log';
import type { EventPayload } from './events';

const PER_CHANNEL_TIMEOUT_MS = 3000;
const ALWAYS_LOG = true; // log channel runs unconditionally

/**
 * Fire-and-forget notification. Resolves recipients from the DB, tries
 * each recipient's channel preference list in order, logs every attempt.
 * Never throws.
 *
 * Trigger sites (in routes/announcements.ts, routes/expenses.ts):
 *   const promise = notify(payload);
 *   if (c.executionCtx?.waitUntil) c.executionCtx.waitUntil(promise);
 *   else promise.catch(console.error);
 */
export async function notify(payload: EventPayload): Promise<void> {
  let recipients: Recipient[];
  try {
    recipients = await resolveRecipients(
      payload.kind,
      'posted_by_unit' in payload
        ? payload.posted_by_unit
        : payload.created_by_unit
    );
  } catch (e) {
    console.error('notify: failed to resolve recipients', e);
    return;
  }

  if (recipients.length === 0) return;

  const message = formatMessage(payload);

  await Promise.all(
    recipients.map((recipient) => deliverToRecipient(payload.kind, recipient, message))
  );
}

async function deliverToRecipient(
  eventType: EventPayload['kind'],
  recipient: Recipient,
  message: string
): Promise<void> {
  // Log channel always runs so we have a record even if all real channels fail.
  if (ALWAYS_LOG) {
    const result = await logChannel.send(message, recipient);
    await logAttempt({
      eventType,
      recipientId: recipient.id,
      channel: 'log',
      payload: { message, recipient: recipient.phone },
      status: result.ok ? 'sent' : 'skipped',
      error: result.error,
    });
  }

  // Try each configured channel in order until one succeeds.
  for (const channelName of recipient.channels) {
    const channel = getChannel(channelName);
    if (!channel || !channel.isConfigured()) {
      await logAttempt({
        eventType,
        recipientId: recipient.id,
        channel: channelName,
        payload: { message },
        status: 'skipped',
        error: 'channel not configured',
      });
      continue;
    }

    let result;
    try {
      result = await Promise.race([
        channel.send(message, recipient),
        timeout(PER_CHANNEL_TIMEOUT_MS),
      ]);
    } catch (e) {
      result = { ok: false, error: `exception: ${String(e)}` };
    }

    await logAttempt({
      eventType,
      recipientId: recipient.id,
      channel: channelName,
      payload: { message },
      status: result.ok ? 'sent' : 'failed',
      error: result.error,
    });

    if (result.ok) return; // success — don't try next channel
  }
}

function timeout(ms: number): Promise<{ ok: false; error: string }> {
  return new Promise((resolve) =>
    setTimeout(() => resolve({ ok: false, error: `timeout after ${ms}ms` }), ms)
  );
}
