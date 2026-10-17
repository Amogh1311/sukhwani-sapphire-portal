import { useEffect, useState } from 'react';

/**
 * Fixed full-viewport background image. Reads --bg-image-url (set by the
 * ThemeProvider) and applies a soft overlay whose tone is also theme-driven
 * so text on top stays readable against any festival photo.
 */
export function ThemeBackground() {
  const [overlay, setOverlay] = useState('rgba(255,255,255,0.55)');

  useEffect(() => {
    const root = document.documentElement;
    const observer = new MutationObserver(() => {
      const tone = root.style.getPropertyValue('--overlay-tone').trim();
      setOverlay(tone === 'dark' ? 'rgba(0,0,0,0.35)' : 'rgba(255,255,255,0.55)');
    });
    observer.observe(root, { attributes: true, attributeFilter: ['style'] });
    // initial read
    const tone = root.style.getPropertyValue('--overlay-tone').trim();
    setOverlay(tone === 'dark' ? 'rgba(0,0,0,0.35)' : 'rgba(255,255,255,0.55)');
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div
        aria-hidden
        className="fixed inset-0 -z-20 bg-cover bg-center transition-[background-image] duration-700"
        style={{ backgroundImage: 'var(--bg-image-url)' }}
      />
      <div
        aria-hidden
        className="fixed inset-0 -z-10 backdrop-blur-[2px] transition-colors duration-700"
        style={{ background: overlay }}
      />
    </>
  );
}
