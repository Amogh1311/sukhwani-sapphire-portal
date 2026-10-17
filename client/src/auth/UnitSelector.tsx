import { useUnit } from './UnitContext';

/**
 * Wing + flat dropdown selector. Lives in the top bar so users can
 * re-select at any time without leaving the page. Per design, the
 * selection is NOT persisted — it resets on every page load.
 */
export function UnitSelector() {
  const { unit, setUnit, units } = useUnit();

  const selected = unit
    ? units.find((u) => u.label === unit)
    : undefined;

  const wings = Array.from(new Set(units.map((u) => u.wing))).sort();
  const flats = selected
    ? units.filter((u) => u.wing === selected.wing).map((u) => u.flat)
    : [];

  function onWingChange(wing: string) {
    // Picking a new wing clears the flat — forces user to pick a flat too.
    setUnit(null);
    if (wing) {
      // Pre-fill with the first flat of the wing so they don't have to click
      // twice if they only care about the wing being correct.
      const firstFlat = units.find((u) => u.wing === wing)?.flat;
      if (firstFlat) setUnit(`${wing}-${firstFlat}`);
    }
  }

  function onFlatChange(flat: string) {
    if (!selected) return;
    setUnit(`${selected.wing}-${flat}`);
  }

  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-muted">Unit</span>
      <select
        value={selected?.wing ?? ''}
        onChange={(e) => onWingChange(e.target.value)}
        className="rounded-md border border-white/60 bg-white/80 px-2 py-1 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        aria-label="Select wing"
      >
        <option value="">Wing…</option>
        {wings.map((w) => (
          <option key={w} value={w}>
            {w}
          </option>
        ))}
      </select>
      <select
        value={selected?.flat ?? ''}
        onChange={(e) => onFlatChange(e.target.value)}
        disabled={!selected}
        className="rounded-md border border-white/60 bg-white/80 px-2 py-1 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
        aria-label="Select flat"
      >
        <option value="">Flat…</option>
        {flats.map((f) => (
          <option key={f} value={f}>
            {f}
          </option>
        ))}
      </select>
      {unit && (
        <button
          onClick={() => setUnit(null)}
          className="text-xs text-muted hover:text-ink"
          title="Clear selection"
        >
          ✕
        </button>
      )}
    </div>
  );
}
