import { useLocation } from '@tanstack/react-router';

/**
 * Hook to detect if the current route is an admin route
 * @returns true if the current pathname starts with /admin
 */
export function useIsAdminRoute(): boolean {
  const location = useLocation();
  return location.pathname.startsWith('/admin');
}
