/**
 * Event types the portal emits. Add new ones here, then implement their
 * message bodies in `formatMessage()` (channels/text.ts).
 */
export type EventType = 'announcement.created' | 'expense.created';

export type AnnouncementCreatedPayload = {
  kind: 'announcement.created';
  id: number;
  title: string;
  body: string;
  canva_url: string | null;
  posted_by_unit: string;
  posted_at: string;
};

export type ExpenseCreatedPayload = {
  kind: 'expense.created';
  id: number;
  occurred_on: string;
  category: string;
  amount_inr: number;
  description: string;
  created_by_unit: string;
  created_at: string;
};

export type EventPayload = AnnouncementCreatedPayload | ExpenseCreatedPayload;
