import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useIsCallerAdmin } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { AlertCircle, LogIn, Copy, Check } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { toast } from 'sonner';
import { useState } from 'react';

export default function AdminRouteGuard({ children }: { children: React.ReactNode }) {
  const { identity, login, loginStatus } = useInternetIdentity();
  const { data: isAdmin, isLoading: isCheckingAdmin } = useIsCallerAdmin();
  const [copied, setCopied] = useState(false);

  const isAuthenticated = !!identity;
  const userPrincipal = identity?.getPrincipal().toString();

  const handleCopyPrincipal = async () => {
    if (!userPrincipal) return;
    
    try {
      await navigator.clipboard.writeText(userPrincipal);
      setCopied(true);
      toast.success('Principal copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy principal');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <Alert>
            <LogIn className="h-4 w-4" />
            <AlertTitle>Login Required</AlertTitle>
            <AlertDescription>
              Please log in with your Internet Identity to access the admin panel.
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
        <div className="max-w-2xl mx-auto space-y-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Access Denied</AlertTitle>
            <AlertDescription>
              You do not have permission to access the admin panel. Only authorized administrators can access this area.
            </AlertDescription>
          </Alert>

          <div className="bg-card border rounded-lg p-6 space-y-4">
            <h3 className="font-semibold text-lg">How to Request Admin Access</h3>
            <ol className="list-decimal list-inside space-y-3 text-sm">
              <li className="text-foreground">
                <strong>Step 1:</strong> Copy your Internet Identity principal using the button below
              </li>
              <li className="text-foreground">
                <strong>Step 2:</strong> Contact an existing administrator and send them your principal
              </li>
              <li className="text-foreground">
                <strong>Step 3:</strong> The administrator can add you from the Admin Access page
              </li>
            </ol>

            <div className="mt-6 space-y-3">
              <label className="text-sm font-medium block">Your Internet Identity Principal:</label>
              <div className="flex gap-2">
                <div className="flex-1 bg-muted px-3 py-2 rounded-md font-mono text-xs break-all">
                  {userPrincipal}
                </div>
                <Button
                  onClick={handleCopyPrincipal}
                  variant="outline"
                  size="icon"
                  className="flex-shrink-0"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <Button
                onClick={handleCopyPrincipal}
                variant="secondary"
                className="w-full"
              >
                <Copy className="mr-2 h-4 w-4" />
                {copied ? 'Copied!' : 'Copy Full Principal'}
              </Button>
            </div>

            <div className="mt-6 pt-4 border-t">
              <p className="text-xs text-muted-foreground">
                <strong>Note:</strong> Admin access is controlled by Internet Identity principals. 
                You can create an Internet Identity using Google sign-in or other authentication methods 
                supported by Internet Identity.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
