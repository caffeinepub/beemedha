import { ReactNode } from 'react';

interface AdminAccessGateProps {
  children: ReactNode;
}

/**
 * @deprecated This component should not be used alongside AdminRouteGuard.
 * AdminRouteGuard provides route-level authentication protection.
 * Using both creates conflicting auth checks that can cause flickering.
 * 
 * If you need inline authentication UI, use AdminRouteGuard at the route level instead.
 */
export default function AdminAccessGate({ children }: AdminAccessGateProps) {
  // This component is deprecated and should not add any auth logic
  // to avoid conflicts with AdminRouteGuard
  return <>{children}</>;
}
