import type { Channel } from './types';

/**
 * WhatsApp via Meta's Cloud API.
 *   https://developers.facebook.com/docs/whatsapp/cloud-api
 *
 * Free tier: 1000 service conversations / month. Needs Meta Business
 * verification + a WhatsApp Business phone number. Set:
 *   WHATSAPP_TOKEN     — long-lived access token from Meta Business
 *   WHATSAPP_PHONE_ID  — sender phone-number ID from the WhatsApp App
 *
 * If either is missing the channel is a no-op (`isConfigured` returns
 * false) so the dispatcher can skip it.
 */
export const whatsappChannel: Channel = {
  name: 'whatsapp',
  isConfigured: () =>
    Boolean(process.env.WHATSAPP_TOKEN && process.env.WHATSAPP_PHONE_ID),
  send: async (message, recipient) => {
    const token = process.env.WHATSAPP_TOKEN;
    const phoneId = process.env.WHATSAPP_PHONE_ID;
    if (!token || !phoneId) {
      return { ok: false, skipped: true, error: 'whatsapp not configured' };
    }

    const url = `https://graph.facebook.com/v20.0/${phoneId}/messages`;
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: recipient.phone.replace(/[^\d]/g, ''),
          type: 'text',
          text: { body: message },
        }),
      });
      if (!res.ok) {
        const text = await res.text().catch(() => '');
        return { ok: false, error: `whatsapp ${res.status}: ${text.slice(0, 200)}` };
      }
      return { ok: true };
    } catch (e) {
      return { ok: false, error: `whatsapp fetch error: ${String(e)}` };
    }
  },
};
