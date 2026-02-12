import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { AlertCircle, LogIn, Shield } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { isOwnerPrincipal } from '../../config/owner';

export default function OwnerOnlyRouteGuard({ children }: { children: React.ReactNode }) {
  const { identity, login, loginStatus } = useInternetIdentity();

  const isAuthenticated = !!identity;
  const userPrincipal = identity?.getPrincipal().toString();
  const isOwner = isOwnerPrincipal(userPrincipal);

  // Not logged in - prompt login
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <Alert>
            <LogIn className="h-4 w-4" />
            <AlertTitle>Login Required</AlertTitle>
            <AlertDescription>
              Please log in with your Internet Identity to access this page.
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
            <p className="mt-4 text-sm text-muted-foreground">
              You can use Google sign-in within the Internet Identity flow
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Logged in but not the owner - show access denied
  if (!isOwner) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto space-y-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Access Denied</AlertTitle>
            <AlertDescription>
              This page is restricted to the smart contract owner only. Only the owner can manage administrator access.
            </AlertDescription>
          </Alert>

          <div className="bg-card border rounded-lg p-6 space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="h-6 w-6 text-destructive" />
              <h3 className="font-semibold text-lg">Owner-Only Access</h3>
            </div>
            
            <p className="text-sm text-muted-foreground">
              The Admin Access Management page allows adding and removing administrators. 
              For security reasons, only the smart contract owner can perform these operations.
            </p>

            <div className="mt-6 pt-4 border-t">
              <p className="text-xs text-muted-foreground">
                <strong>Note:</strong> If you believe you should have access to this page, 
                please contact the smart contract owner directly.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Owner - render children
  return <>{children}</>;
}
