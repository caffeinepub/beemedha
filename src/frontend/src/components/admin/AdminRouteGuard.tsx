import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useIsCallerAdmin } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { AlertCircle, LogIn } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function AdminRouteGuard({ children }: { children: React.ReactNode }) {
  const { identity, login, loginStatus } = useInternetIdentity();
  const { data: isAdmin, isLoading: isCheckingAdmin } = useIsCallerAdmin();

  const isAuthenticated = !!identity;

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <Alert>
            <LogIn className="h-4 w-4" />
            <AlertTitle>Login Required</AlertTitle>
            <AlertDescription>
              Please log in to access the admin panel.
            </AlertDescription>
          </Alert>
          <div className="mt-6 text-center">
            <Button
              onClick={login}
              disabled={loginStatus === 'logging-in'}
              className="bg-primary hover:bg-primary/90"
            >
              {loginStatus === 'logging-in' ? 'Logging in...' : 'Login with Internet Identity'}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (isCheckingAdmin) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <p className="text-muted-foreground">Checking permissions...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Access Denied</AlertTitle>
            <AlertDescription>
              You do not have permission to access the admin panel. Only authorized administrators can access this area.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
