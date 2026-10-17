import type { Channel } from './types';

/**
 * SMS via Twilio. Costs ~₹0.20/SMS in India (paid). Set:
 *   SMS_PROVIDER='twilio'
 *   SMS_ACCOUNT_SID
 *   SMS_AUTH_TOKEN
 *   SMS_FROM           — Twilio-provisioned sender number
 *
 * If provider is unset or creds missing the channel is a no-op.
 *
 * (Other providers like MessageBird share the same shape; add a new
 * channel file rather than overloading this one.)
 */
export const smsChannel: Channel = {
  name: 'sms',
  isConfigured: () =>
    process.env.SMS_PROVIDER === 'twilio' &&
    Boolean(
      process.env.SMS_ACCOUNT_SID &&
        process.env.SMS_AUTH_TOKEN &&
        process.env.SMS_FROM
    ),
  send: async (message, recipient) => {
    const sid = process.env.SMS_ACCOUNT_SID;
    const token = process.env.SMS_AUTH_TOKEN;
    const from = process.env.SMS_FROM;
    if (!sid || !token || !from) {
      return { ok: false, skipped: true, error: 'sms not configured' };
    }

    const url = `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`;
    const body = new URLSearchParams({
      To: recipient.phone,
      From: from,
      Body: message,
    });

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Basic ${Buffer.from(`${sid}:${token}`).toString('base64')}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: body.toString(),
      });
      if (!res.ok) {
        const text = await res.text().catch(() => '');
        return { ok: false, error: `sms ${res.status}: ${text.slice(0, 200)}` };
      }
      return { ok: true };
    } catch (e) {
      return { ok: false, error: `sms fetch error: ${String(e)}` };
    }
  },
};
