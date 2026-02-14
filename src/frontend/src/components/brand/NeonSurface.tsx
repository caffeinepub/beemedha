import { ReactNode } from 'react';

interface NeonSurfaceProps {
  children: ReactNode;
  className?: string;
}

export default function NeonSurface({ children, className = '' }: NeonSurfaceProps) {
  return (
    <div className={`neon-surface-wrapper ${className}`}>
      <div className="neon-animated-bg">
        <div className="neon-gradient-layer" />
        <div className="neon-particles-layer" />
        <div className="neon-shapes-layer">
          <div className="neon-shape neon-shape-1" />
          <div className="neon-shape neon-shape-2" />
          <div className="neon-shape neon-shape-3" />
        </div>
      </div>
      <div className="neon-content">
        {children}
      </div>
    </div>
  );
}
