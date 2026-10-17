import type { Channel } from './types';

/**
 * Email via Resend. Free tier: 100 emails/day, 3000/month. Set:
 *   EMAIL_PROVIDER='resend'
 *   EMAIL_API_KEY     — from resend.com/api-keys
 *   EMAIL_FROM        — verified sender, e.g. 'Sukhwani Sapphire <hello@yourdomain.in>'
 *
 * We don't store recipients' email addresses yet — the `phone` field is
 * repurposed as the destination when channel='email'. Add a separate
 * `email` column to notification_recipients if you want emails and
 * WhatsApp/SMS to coexist on the same recipient.
 */
export const emailChannel: Channel = {
  name: 'email',
  isConfigured: () =>
    process.env.EMAIL_PROVIDER === 'resend' &&
    Boolean(process.env.EMAIL_API_KEY && process.env.EMAIL_FROM),
  send: async (message, recipient) => {
    const apiKey = process.env.EMAIL_API_KEY;
    const from = process.env.EMAIL_FROM;
    if (!apiKey || !from) {
      return { ok: false, skipped: true, error: 'email not configured' };
    }

    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from,
          to: [recipient.phone], // see note above re: phone-as-email
          subject: 'Sukhwani Sapphire — society update',
          text: message,
        }),
      });
      if (!res.ok) {
        const text = await res.text().catch(() => '');
        return { ok: false, error: `email ${res.status}: ${text.slice(0, 200)}` };
      }
      return { ok: true };
    } catch (e) {
      return { ok: false, error: `email fetch error: ${String(e)}` };
    }
  },
};
