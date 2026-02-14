/**
 * Safe navigation helper that prevents repeated navigations to the same path
 * and logs warnings for rapid same-path navigation attempts.
 */

let lastNavigationPath: string | null = null;
let lastNavigationTime = 0;
const NAVIGATION_DEBOUNCE_MS = 100;

export function safeNavigate(
  navigate: (opts: any) => void,
  to: string,
  options?: Record<string, any>
) {
  const now = Date.now();
  
  // Check if we're already at the target path (via window.location)
  const currentPath = window.location.hash.replace('#', '') || '/';
  if (currentPath === to) {
    if (now - lastNavigationTime < NAVIGATION_DEBOUNCE_MS && lastNavigationPath === to) {
      console.warn(`[safeNavigate] Prevented repeated navigation to ${to} (already at target)`);
    }
    return;
  }
  
  // Check for rapid repeated navigation attempts
  if (lastNavigationPath === to && now - lastNavigationTime < NAVIGATION_DEBOUNCE_MS) {
    console.warn(`[safeNavigate] Debounced rapid navigation attempt to ${to}`);
    return;
  }
  
  lastNavigationPath = to;
  lastNavigationTime = now;
  
  navigate({ to: to as any, ...options });
}
