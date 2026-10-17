/**
 * Theme tokens. The fallback theme is what users see when no festival is
 * active or coming up within the lookahead window — warm saffron on cream
 * with a mandala-pattern background, always-on so the app never looks broken.
 */

export const FALLBACK_THEME = {
  primary: '#b45309', // saffron
  bg: '#fffbeb', // warm cream
  ink: '#1f2937',
  muted: '#6b7280',
  imageUrl:
    'https://images.unsplash.com/photo-1545048702-79362596cdc9?auto=format&fit=crop&w=1920&q=80', // decorative mandala/arch
  overlay: 'light' as const,
};

export type ThemeTokens = typeof FALLBACK_THEME;
