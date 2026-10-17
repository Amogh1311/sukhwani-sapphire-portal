/**
 * Festival configuration.
 *
 * Hindu/cultural festivals follow a lunar calendar and shift year to year.
 * Dates below are pre-computed Gregorian-equivalent occurrences for 2025
 * and 2026 — curated, not algorithmically derived. Update annually.
 *
 * Each occurrence has an inclusive `date` (start) and `endDate` (last day),
 * so multi-day festivals like Diwali (5 days) and Navratri (9 days) work.
 */

export type FestivalOccurrence = {
  date: string; // 'YYYY-MM-DD'
  endDate: string; // 'YYYY-MM-DD', inclusive
};

export type Festival = {
  id: string;
  name: string;
  emoji: string;
  tagline: string;
  occurrences: FestivalOccurrence[];
  theme: {
    primary: string; // hex
    bg: string; // hex fallback solid color
    imageUrl: string; // curated Unsplash CDN URL
    overlay: 'light' | 'dark';
  };
};

// Unsplash hot-link CDN. These URLs are stable; photo IDs are public.
// Each chosen photo evokes the festival without using copyrighted imagery.
export const FESTIVALS: Festival[] = [
  {
    id: 'makar-sankranti',
    name: 'Makar Sankranti',
    emoji: '🪁',
    tagline: 'Kites, sesame laddoo, and the sun turning north.',
    occurrences: [
      { date: '2025-01-14', endDate: '2025-01-15' },
      { date: '2026-01-14', endDate: '2026-01-15' },
      { date: '2027-01-14', endDate: '2027-01-15' },
    ],
    theme: {
      primary: '#ea580c',
      bg: '#fff7ed',
      imageUrl:
        'https://images.unsplash.com/photo-1604514628550-37477afdf4e3?auto=format&fit=crop&w=1920&q=80',
      overlay: 'light',
    },
  },
  {
    id: 'maha-shivaratri',
    name: 'Maha Shivaratri',
    emoji: '🕉️',
    tagline: 'The night of Shiva — vigil, prayer, and bel leaves.',
    occurrences: [
      { date: '2025-02-26', endDate: '2025-02-27' },
      { date: '2026-02-15', endDate: '2026-02-16' },
      { date: '2027-02-06', endDate: '2027-02-07' },
    ],
    theme: {
      primary: '#7c3aed',
      bg: '#f5f3ff',
      imageUrl:
        'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1920&q=80',
      overlay: 'dark',
    },
  },
  {
    id: 'holi',
    name: 'Holi',
    emoji: '🎨',
    tagline: 'Gulal, gujiya, and the colors of spring.',
    occurrences: [
      { date: '2025-03-14', endDate: '2025-03-15' },
      { date: '2026-03-04', endDate: '2026-03-05' },
      { date: '2027-03-22', endDate: '2027-03-23' },
    ],
    theme: {
      primary: '#dc2626',
      bg: '#fef2f2',
      imageUrl:
        'https://images.unsplash.com/photo-1610903120820-7b5b9e4b9b6e?auto=format&fit=crop&w=1920&q=80',
      overlay: 'light',
    },
  },
  {
    id: 'ram-navami',
    name: 'Ram Navami',
    emoji: '🏹',
    tagline: 'The birth of Rama — processions and bhajans.',
    occurrences: [
      { date: '2025-04-06', endDate: '2025-04-06' },
      { date: '2026-03-27', endDate: '2026-03-27' },
      { date: '2027-04-15', endDate: '2027-04-15' },
    ],
    theme: {
      primary: '#b91c1c',
      bg: '#fff1f2',
      imageUrl:
        'https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=1920&q=80',
      overlay: 'light',
    },
  },
  {
    id: 'janmashtami',
    name: 'Janmashtami',
    emoji: '🦚',
    tagline: 'Krishna\'s birthday — dahi handi and midnight chants.',
    occurrences: [
      { date: '2025-08-16', endDate: '2025-08-16' },
      { date: '2026-09-04', endDate: '2026-09-04' },
      { date: '2027-08-25', endDate: '2027-08-25' },
    ],
    theme: {
      primary: '#1d4ed8',
      bg: '#eff6ff',
      imageUrl:
        'https://images.unsplash.com/photo-1623091410901-00e2d268901f?auto=format&fit=crop&w=1920&q=80',
      overlay: 'dark',
    },
  },
  {
    id: 'ganesh-chaturthi',
    name: 'Ganesh Chaturthi',
    emoji: '🐘',
    tagline: 'Ganesh ji comes home — modaks and mandaps.',
    occurrences: [
      { date: '2025-08-27', endDate: '2025-09-06' },
      { date: '2026-09-04', endDate: '2026-09-14' },
      { date: '2027-08-24', endDate: '2027-09-03' },
    ],
    theme: {
      primary: '#d97706',
      bg: '#fffbeb',
      imageUrl:
        'https://images.unsplash.com/photo-1605654456927-7e6c1d4b1b3e?auto=format&fit=crop&w=1920&q=80',
      overlay: 'light',
    },
  },
  {
    id: 'navratri',
    name: 'Navratri',
    emoji: '🪷',
    tagline: 'Nine nights of durga, dandiya, and devotion.',
    occurrences: [
      { date: '2025-09-22', endDate: '2025-10-01' },
      { date: '2026-10-11', endDate: '2026-10-19' },
      { date: '2027-09-30', endDate: '2027-10-08' },
    ],
    theme: {
      primary: '#be185d',
      bg: '#fdf2f8',
      imageUrl:
        'https://images.unsplash.com/photo-1604429069263-7a3e6d7b1b1f?auto=format&fit=crop&w=1920&q=80',
      overlay: 'dark',
    },
  },
  {
    id: 'dussehra',
    name: 'Dussehra',
    emoji: '🏹',
    tagline: 'Vijayadashami — the victory of good over evil.',
    occurrences: [
      { date: '2025-10-02', endDate: '2025-10-02' },
      { date: '2026-10-20', endDate: '2026-10-20' },
      { date: '2027-10-09', endDate: '2027-10-09' },
    ],
    theme: {
      primary: '#15803d',
      bg: '#f0fdf4',
      imageUrl:
        'https://images.unsplash.com/photo-1606767041004-e5d2e8e0e1a1?auto=format&fit=crop&w=1920&q=80',
      overlay: 'light',
    },
  },
  {
    id: 'diwali',
    name: 'Diwali',
    emoji: '🪔',
    tagline: 'Row of lamps, mithai, and crackers in the courtyard.',
    occurrences: [
      { date: '2025-10-20', endDate: '2025-10-24' },
      { date: '2026-11-08', endDate: '2026-11-12' },
      { date: '2027-10-28', endDate: '2027-11-01' },
    ],
    theme: {
      primary: '#c2410c',
      bg: '#fff7ed',
      imageUrl:
        'https://images.unsplash.com/photo-1605379399642-870262d3d051?auto=format&fit=crop&w=1920&q=80',
      overlay: 'dark',
    },
  },
];

/** Flat lookup of all occurrences sorted by date. */
export function expandOccurrences(festivals: Festival[]): Array<{
  festival: Festival;
  start: Date;
  end: Date;
}> {
  const all: Array<{ festival: Festival; start: Date; end: Date }> = [];
  for (const f of festivals) {
    for (const occ of f.occurrences) {
      all.push({
        festival: f,
        start: new Date(occ.date + 'T00:00:00'),
        end: new Date(occ.endDate + 'T23:59:59'),
      });
    }
  }
  all.sort((a, b) => a.start.getTime() - b.start.getTime());
  return all;
}
