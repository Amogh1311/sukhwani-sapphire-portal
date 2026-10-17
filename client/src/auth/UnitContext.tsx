import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { fetchUnits, type Unit } from '../api/client';

type UnitState = {
  unit: string | null;
  isCommittee: boolean;
};

type UnitContextValue = UnitState & {
  setUnit: (label: string | null) => void;
  units: Unit[];
  committeeUnits: string[]; // labels, for quick lookup
};

const UnitContext = createContext<UnitContextValue | null>(null);

export function UnitProvider({ children }: { children: ReactNode }) {
  // Re-pick every visit: starts null on every page load.
  const [unit, setUnitState] = useState<string | null>(null);
  const [units, setUnits] = useState<Unit[]>([]);

  // Pull the canonical unit list (with is_committee flags) on mount.
  useEffect(() => {
    let cancelled = false;
    fetchUnits(null)
      .then((u) => {
        if (!cancelled) setUnits(u);
      })
      .catch((e) => console.error('failed to load units', e));
    return () => {
      cancelled = true;
    };
  }, []);

  const setUnit = useCallback((label: string | null) => {
    setUnitState(label);
  }, []);

  const committeeUnits = useMemo(
    () => units.filter((u) => u.is_committee).map((u) => u.label),
    [units]
  );

  const isCommittee = unit !== null && committeeUnits.includes(unit);

  const value: UnitContextValue = useMemo(
    () => ({ unit, isCommittee, setUnit, units, committeeUnits }),
    [unit, isCommittee, setUnit, units, committeeUnits]
  );

  return <UnitContext.Provider value={value}>{children}</UnitContext.Provider>;
}

export function useUnit(): UnitContextValue {
  const ctx = useContext(UnitContext);
  if (!ctx) throw new Error('useUnit must be used inside <UnitProvider>');
  return ctx;
}
