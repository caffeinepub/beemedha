import { useEffect, useState } from 'react';

export default function GlobalNeonBackground() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return (
    <div className="global-neon-background">
      <div className={`global-neon-animated-bg ${prefersReducedMotion ? 'reduced-motion' : ''}`}>
        <div className="global-neon-gradient-layer" />
        <div className="global-neon-particles-layer" />
        <div className="global-neon-shapes-layer">
          <div className="global-neon-shape global-neon-shape-1" />
          <div className="global-neon-shape global-neon-shape-2" />
          <div className="global-neon-shape global-neon-shape-3" />
          <div className="global-neon-shape global-neon-shape-4" />
        </div>
      </div>
    </div>
  );
}
