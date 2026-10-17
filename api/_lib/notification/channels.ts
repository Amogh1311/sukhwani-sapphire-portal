import { logChannel } from './channels/log';
import { whatsappChannel } from './channels/whatsapp';
import { smsChannel } from './channels/sms';
import { emailChannel } from './channels/email';
import type { Channel } from './channels/types';

const CHANNELS: Record<string, Channel> = {
  log: logChannel,
  whatsapp: whatsappChannel,
  sms: smsChannel,
  email: emailChannel,
};

export function getChannel(name: string): Channel | null {
  return CHANNELS[name] ?? null;
}

export function listChannels(): Channel[] {
  return Object.values(CHANNELS);
}
