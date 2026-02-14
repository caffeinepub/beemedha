import { ReactNode, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useAdminSession } from '../../hooks/useAdminSession';
import { Loader2 } from 'lucide-react';
import { safeNavigate } from '../../utils/safeNavigate';

interface AdminRouteGuardProps {
  children: ReactNode;
}

export default function AdminRouteGuard({ children }: AdminRouteGuardProps) {
  const { isAuthenticated, isValidating } = useAdminSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isValidating && !isAuthenticated) {
      safeNavigate(navigate, '/admin/login', { replace: true });
    }
  }, [isAuthenticated, isValidating, navigate]);

  // Show loading only during initial validation
  if (isValidating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Validating session...</p>
        </div>
      </div>
    );
  }

  // Don't render null flash - if not authenticated, the redirect will handle it
  // Only render children when authenticated
  return isAuthenticated ? <>{children}</> : null;
}
