export type Unit = {
  wing: string;
  flat: string;
  label: string; // 'A-101'
  is_committee: boolean;
};

export type Expense = {
  id: number;
  occurred_on: string; // 'YYYY-MM-DD'
  category: string;
  amount_inr: number;
  description: string;
  created_by_unit: string;
  created_at: string;
};

export type ExpenseInput = {
  occurred_on: string;
  category: string;
  amount_inr: number;
  description: string;
};

export type Announcement = {
  id: number;
  title: string;
  body: string;
  canva_url: string | null;
  posted_by_unit: string;
  posted_at: string;
};

export type AnnouncementInput = {
  title: string;
  body: string;
  canva_url?: string;
};

export type ApiError = {
  error: { code: 'BAD_REQUEST' | 'FORBIDDEN' | 'NOT_FOUND' | 'INTERNAL'; message: string };
};
