import { useUnit } from './UnitContext';
import type { ReactNode } from 'react';

/**
 * Renders children only if the selected unit is committee. Otherwise shows
 * a small "select your unit" hint. The server still re-validates every
 * write — this is just for UX.
 */
export function RequireCommittee({ children }: { children: ReactNode }) {
  const { unit, isCommittee } = useUnit();

  if (isCommittee) return <>{children}</>;

  return (
    <div className="surface mt-4 p-4 text-sm text-muted">
      {unit ? (
        <>
          Unit <strong>{unit}</strong> is read-only. Committee units can post
          updates.
        </>
      ) : (
        <>Select your wing + flat in the top bar to continue.</>
      )}
    </div>
  );
}
