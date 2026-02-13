import { useAdminSession } from '../../hooks/useAdminSession';
import { useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export default function AdminRouteGuard({ children }: { children: React.ReactNode }) {
  const { isValid, isValidating } = useAdminSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isValidating && !isValid) {
      navigate({ to: '/admin' });
    }
  }, [isValid, isValidating, navigate]);

  // Show loading state while validating
  if (isValidating) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <p className="text-muted-foreground">Checking permissions...</p>
        </div>
      </div>
    );
  }

  // Show access denied if not valid admin session
  if (!isValid) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Admin Login Required</AlertTitle>
            <AlertDescription>
              Please log in with your admin credentials to access this page.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  // Render children if valid admin session
  return <>{children}</>;
}
