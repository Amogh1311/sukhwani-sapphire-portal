import { expandOccurrences, type Festival } from '../config/festivals';

export type ActiveFestival =
  | {
      festival: Festival;
      mode: 'active';
      daysInto: number; // 1-based
      totalDays: number;
      start: Date;
      end: Date;
    }
  | {
      festival: Festival;
      mode: 'upcoming';
      daysUntilStart: number;
      start: Date;
      end: Date;
    };

/**
 * Find the festival whose occurrence either contains `today`
 * or starts within the next `lookaheadDays` days.
 *
 * - Returns mode 'active' if `today` is between start and end (inclusive).
 * - Otherwise returns mode 'upcoming' for the soonest occurrence whose
 *   start is in the future and within `lookaheadDays` days.
 * - Returns null if neither — caller should fall back to the default theme.
 *
 * Pure function: same inputs → same output, no Date.now() inside.
 */
export function getActiveFestival(
  today: Date,
  festivals: Festival[],
  lookaheadDays = 10
): ActiveFestival | null {
  const occurrences = expandOccurrences(festivals);
  const todayStart = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  // Pass 1: currently in progress (a festival spanning today).
  for (const occ of occurrences) {
    if (todayStart >= occ.start && todayStart <= occ.end) {
      const totalDays = Math.round(
        (occ.end.getTime() - occ.start.getTime()) / 86400000
      ) + 1;
      const daysInto =
        Math.round((todayStart.getTime() - occ.start.getTime()) / 86400000) + 1;
      return {
        festival: occ.festival,
        mode: 'active',
        daysInto,
        totalDays,
        start: occ.start,
        end: occ.end,
      };
    }
  }

  // Pass 2: soonest upcoming occurrence within lookahead window.
  for (const occ of occurrences) {
    const diffMs = occ.start.getTime() - todayStart.getTime();
    const diffDays = Math.round(diffMs / 86400000);
    if (diffDays > 0 && diffDays <= lookaheadDays) {
      return {
        festival: occ.festival,
        mode: 'upcoming',
        daysUntilStart: diffDays,
        start: occ.start,
        end: occ.end,
      };
    }
    if (diffDays > lookaheadDays) break; // sorted ascending, can stop
  }

  return null;
}
