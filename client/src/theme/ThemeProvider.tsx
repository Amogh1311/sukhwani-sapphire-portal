import { createContext, useContext, useEffect, useMemo, type ReactNode } from 'react';
import { FESTIVALS } from '../config/festivals';
import { FALLBACK_THEME } from '../config/theme';
import { getActiveFestival, type ActiveFestival } from './festivalEngine';

type ThemeContextValue = ActiveFestival | null;

const ThemeContext = createContext<ThemeContextValue>(null);

/**
 * Reads the current festival on mount, writes its theme tokens into CSS
 * variables on <html>, and exposes the active-festival info via context so
 * children can render banners or accents.
 *
 * If no festival is in the 10-day window, falls back to a calm default
 * theme (saffron-on-cream with a mandala background) — never blank.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const active = useMemo(() => getActiveFestival(new Date(), FESTIVALS), []);

  useEffect(() => {
    const root = document.documentElement;
    if (active) {
      const t = active.festival.theme;
      root.style.setProperty('--color-primary', t.primary);
      root.style.setProperty('--color-bg', t.bg);
      root.style.setProperty('--bg-image-url', `url('${t.imageUrl}')`);
      root.style.setProperty('--overlay-tone', t.overlay);
    } else {
      root.style.setProperty('--color-primary', FALLBACK_THEME.primary);
      root.style.setProperty('--color-bg', FALLBACK_THEME.bg);
      root.style.setProperty('--bg-image-url', `url('${FALLBACK_THEME.imageUrl}')`);
      root.style.setProperty('--overlay-tone', FALLBACK_THEME.overlay);
    }
  }, [active]);

  return (
    <ThemeContext.Provider value={active}>{children}</ThemeContext.Provider>
  );
}

export function useActiveFestival(): ActiveFestival | null {
  return useContext(ThemeContext);
}
