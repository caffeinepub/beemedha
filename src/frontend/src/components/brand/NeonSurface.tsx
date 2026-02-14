import { ReactNode } from 'react';

interface NeonSurfaceProps {
  children: ReactNode;
  className?: string;
}

export default function NeonSurface({ children, className = '' }: NeonSurfaceProps) {
  // Component disabled - organic luxury theme does not use neon surfaces
  // Return children directly without neon wrapper
  return <div className={className}>{children}</div>;
}
