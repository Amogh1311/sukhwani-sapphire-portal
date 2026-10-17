import type { Recipient } from '../recipients';

export type ChannelResult = { ok: boolean; error?: string; skipped?: boolean };

/**
 * Channels must never throw. All errors are caught and returned as
 * `{ ok: false, error }`. Timeout is enforced by the dispatcher via
 * Promise.race — channels don't manage their own timeouts.
 */
export type Channel = {
  name: string;
  isConfigured: () => boolean;
  send: (message: string, recipient: Recipient) => Promise<ChannelResult>;
};
