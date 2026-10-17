import type { Channel } from './types';
import type { Recipient } from '../recipients';

/**
 * Always-on channel. Writes the would-be notification to console and to
 * the notification_log table (handled by the dispatcher). This is the
 * fallback that ensures every event is at least observable, even if no
 * external integrations are configured.
 */
export const logChannel: Channel = {
  name: 'log',
  isConfigured: () => true,
  send: async (message: string, recipient: Recipient): Promise<{ ok: boolean }> => {
    console.log(
      `[notification] would deliver to ${recipient.name ?? recipient.phone}: ${message}`
    );
    return { ok: true };
  },
};
