import { useState } from 'react';
import { Section, Container } from '../../components/brand/BrandPrimitives';
import { usePageMeta } from '../../hooks/usePageMeta';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useAddAdmin, useRemoveAdmin } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Copy, Check, UserPlus, AlertCircle, Info } from 'lucide-react';
import { toast } from 'sonner';
import { Principal } from '@dfinity/principal';
import { validatePrincipal } from '../../utils/principal';

export default function AdminAccessPage() {
  usePageMeta('Web Owner Dashboard', 'Manage admin access and permissions.');
  
  const { identity } = useInternetIdentity();
  const [newAdminPrincipal, setNewAdminPrincipal] = useState('');
  const [removeAdminPrincipal, setRemoveAdminPrincipal] = useState('');
  const [copied, setCopied] = useState(false);

  const addAdminMutation = useAddAdmin();
  const removeAdminMutation = useRemoveAdmin();

  const currentPrincipal = identity?.getPrincipal().toString() || '';

  const handleCopyPrincipal = async () => {
    if (!currentPrincipal) return;
    
    try {
      await navigator.clipboard.writeText(currentPrincipal);
      setCopied(true);
      toast.success('Principal copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy principal');
    }
  };

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newAdminPrincipal.trim()) {
      toast.error('Please enter a principal');
      return;
    }

    const validation = validatePrincipal(newAdminPrincipal.trim());
    if (!validation.success) {
      toast.error(validation.error || 'Invalid principal format');
      return;
    }

    try {
      const principal = Principal.fromText(newAdminPrincipal.trim());
      await addAdminMutation.mutateAsync(principal);
      toast.success('Admin added successfully');
      setNewAdminPrincipal('');
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to add admin';
      toast.error(errorMessage);
      console.error(error);
    }
  };

  const handleRemoveAdmin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!removeAdminPrincipal.trim()) {
      toast.error('Please enter a principal');
      return;
    }

    const validation = validatePrincipal(removeAdminPrincipal.trim());
    if (!validation.success) {
      toast.error(validation.error || 'Invalid principal format');
      return;
    }

    try {
      const principal = Principal.fromText(removeAdminPrincipal.trim());
      await removeAdminMutation.mutateAsync(principal);
      toast.success('Admin removed successfully');
      setRemoveAdminPrincipal('');
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to remove admin';
      toast.error(errorMessage);
      console.error(error);
    }
  };

  return (
    <div>
      <Section className="bg-muted/30 py-12">
        <Container>
          <div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-2">
              Admin Access
            </h1>
            <p className="text-muted-foreground">
              Manage admin access and permissions.
            </p>
          </div>
        </Container>
      </Section>

      <Section className="py-12">
        <Container>
          <div className="max-w-2xl mx-auto space-y-6">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>About Admin Access</AlertTitle>
              <AlertDescription>
                This page manages Internet Identity-based admin access. The password-based admin login is separate and uses fixed credentials.
              </AlertDescription>
            </Alert>

            <Card>
              <CardHeader>
                <CardTitle className="font-serif">Your Principal</CardTitle>
                <CardDescription>
                  This is your Internet Identity principal ID
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <div className="flex-1 bg-muted px-3 py-2 rounded-md font-mono text-xs break-all">
                    {currentPrincipal || 'Not logged in'}
                  </div>
                  <Button
                    onClick={handleCopyPrincipal}
                    variant="outline"
                    size="icon"
                    className="flex-shrink-0"
                    disabled={!currentPrincipal}
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-serif">Add Admin</CardTitle>
                <CardDescription>
                  Grant admin access to a new Internet Identity principal
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddAdmin} className="space-y-4">
                  <div>
                    <Label htmlFor="newAdmin">Principal ID</Label>
                    <Input
                      id="newAdmin"
                      value={newAdminPrincipal}
                      onChange={(e) => setNewAdminPrincipal(e.target.value)}
                      placeholder="xxxxx-xxxxx-xxxxx-xxxxx-xxx"
                      className="mt-2 font-mono text-sm"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={addAdminMutation.isPending}
                    className="w-full bg-primary hover:bg-primary/90"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    {addAdminMutation.isPending ? 'Adding...' : 'Add Admin'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-serif">Remove Admin</CardTitle>
                <CardDescription>
                  Revoke admin access from an Internet Identity principal
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Warning: Removing admin access cannot be undone. The initial admin principal cannot be removed.
                  </AlertDescription>
                </Alert>
                <form onSubmit={handleRemoveAdmin} className="space-y-4">
                  <div>
                    <Label htmlFor="removeAdmin">Principal ID</Label>
                    <Input
                      id="removeAdmin"
                      value={removeAdminPrincipal}
                      onChange={(e) => setRemoveAdminPrincipal(e.target.value)}
                      placeholder="xxxxx-xxxxx-xxxxx-xxxxx-xxx"
                      className="mt-2 font-mono text-sm"
                    />
                  </div>
                  <Button
                    type="submit"
                    variant="destructive"
                    disabled={removeAdminMutation.isPending}
                    className="w-full"
                  >
                    {removeAdminMutation.isPending ? 'Removing...' : 'Remove Admin'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </Container>
      </Section>
    </div>
  );
}
