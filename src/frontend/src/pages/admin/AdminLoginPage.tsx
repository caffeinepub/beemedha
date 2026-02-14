import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, LogIn } from 'lucide-react';
import { useAdminSession } from '../../hooks/useAdminSession';
import { toast } from 'sonner';
import { usePageMeta } from '../../hooks/usePageMeta';
import { safeNavigate } from '../../utils/safeNavigate';

export default function AdminLoginPage() {
  usePageMeta('Admin Login', 'Admin dashboard login');
  const navigate = useNavigate();
  const { isAuthenticated, isValidating, isLoggingIn, login } = useAdminSession();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Redirect if already authenticated
  useEffect(() => {
    if (!isValidating && isAuthenticated) {
      safeNavigate(navigate, '/admin', { replace: true });
    }
  }, [isAuthenticated, isValidating, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      toast.error('Please enter both username and password');
      return;
    }

    const success = await login(username, password);
    if (success) {
      toast.success('Login successful');
      safeNavigate(navigate, '/admin', { replace: true });
    } else {
      toast.error('Invalid username or password');
      setPassword('');
    }
  };

  if (isValidating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground">Loading...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md shadow-soft-lg">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 scoped-glow">
            <LogIn className="h-8 w-8 text-primary" />
          </div>
          <div>
            <CardTitle className="text-3xl font-serif">Admin Login</CardTitle>
            <CardDescription className="mt-2">
              Enter your credentials to access the admin dashboard
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-base">Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                disabled={isLoggingIn}
                autoComplete="username"
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-base">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                disabled={isLoggingIn}
                autoComplete="current-password"
                className="h-11"
              />
            </div>
            <Button
              type="submit"
              disabled={isLoggingIn}
              className="w-full h-11 text-base font-semibold scoped-glow"
              size="lg"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Logging in...
                </>
              ) : (
                'Login'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
