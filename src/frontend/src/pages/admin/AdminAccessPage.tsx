import { useState } from 'react';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useAddAdmin, useRemoveAdmin } from '../../hooks/useQueries';
import { Section, Container, BrandCard } from '../../components/brand/BrandPrimitives';
import { usePageMeta } from '../../hooks/usePageMeta';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Shield, Copy, Check, AlertCircle, UserPlus, Info } from 'lucide-react';
import { toast } from 'sonner';
import { validatePrincipal } from '../../utils/principal';

export default function AdminAccessPage() {
  usePageMeta('Admin Access Management', 'Manage administrator access and permissions.');

  const { identity } = useInternetIdentity();
  const addAdminMutation = useAddAdmin();
  const removeAdminMutation = useRemoveAdmin();

  const [newAdminPrincipal, setNewAdminPrincipal] = useState('');
  const [removeAdminPrincipal, setRemoveAdminPrincipal] = useState('');
  const [copiedPrincipal, setCopiedPrincipal] = useState<string | null>(null);

  const currentUserPrincipal = identity?.getPrincipal().toString();

  const handleCopyPrincipal = async (principalText: string) => {
    try {
      await navigator.clipboard.writeText(principalText);
      setCopiedPrincipal(principalText);
      toast.success('Principal copied to clipboard');
      setTimeout(() => setCopiedPrincipal(null), 2000);
    } catch (error) {
      toast.error('Failed to copy principal');
    }
  };

  const handleAddAdmin = async () => {
    const validation = validatePrincipal(newAdminPrincipal);
    
    if (!validation.success) {
      toast.error(validation.error || 'Invalid principal');
      return;
    }

    if (!validation.principal) {
      toast.error('Failed to parse principal');
      return;
    }

    try {
      await addAdminMutation.mutateAsync(validation.principal);
      toast.success('Administrator added successfully');
      setNewAdminPrincipal('');
    } catch (error: any) {
      console.error('Failed to add admin:', error);
      toast.error(error.message || 'Failed to add administrator');
    }
  };

  const handleRemoveAdmin = async () => {
    const validation = validatePrincipal(removeAdminPrincipal);
    
    if (!validation.success) {
      toast.error(validation.error || 'Invalid principal');
      return;
    }

    if (!validation.principal) {
      toast.error('Failed to parse principal');
      return;
    }

    try {
      await removeAdminMutation.mutateAsync(validation.principal);
      toast.success('Administrator removed successfully');
      setRemoveAdminPrincipal('');
    } catch (error: any) {
      console.error('Failed to remove admin:', error);
      
      // Check for specific error messages from backend
      if (error.message?.includes('Cannot remove the initial admin')) {
        toast.error('Cannot remove the initial admin principal');
      } else if (error.message?.includes('last remaining admin')) {
        toast.error('Cannot remove the last administrator');
      } else {
        toast.error(error.message || 'Failed to remove administrator');
      }
    }
  };

  return (
    <div>
      <Section className="bg-muted/30 py-12">
        <Container>
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3">
              <Shield className="h-12 w-12 text-primary" />
              <h1 className="text-5xl md:text-6xl font-serif font-bold">
                Admin Access
              </h1>
            </div>
            <p className="text-xl text-muted-foreground">
              Manage administrator principals and access control
            </p>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Multi-Admin Mode Notice */}
            <Alert className="border-primary/50 bg-primary/5">
              <Shield className="h-5 w-5 text-primary" />
              <AlertTitle className="text-lg font-semibold">Multi-Admin Mode Enabled</AlertTitle>
              <AlertDescription className="mt-2">
                <p>
                  This application supports multiple administrators. Any admin can add or remove other admins.
                  The system prevents removing the initial admin principal to ensure the canister remains accessible.
                </p>
              </AlertDescription>
            </Alert>

            {/* Current User Principal */}
            <BrandCard className="p-6">
              <h2 className="text-2xl font-serif font-bold mb-4">Your Principal</h2>
              <p className="text-sm text-muted-foreground mb-4">
                This is your Internet Identity principal. Share this with other admins if you need access.
              </p>
              <div className="flex gap-2">
                <div className="flex-1 bg-muted px-4 py-3 rounded-md font-mono text-sm break-all">
                  {currentUserPrincipal}
                </div>
                <Button
                  onClick={() => currentUserPrincipal && handleCopyPrincipal(currentUserPrincipal)}
                  variant="outline"
                  size="icon"
                  className="flex-shrink-0"
                >
                  {copiedPrincipal === currentUserPrincipal ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </BrandCard>

            {/* Add New Admin */}
            <BrandCard className="p-6">
              <h2 className="text-2xl font-serif font-bold mb-4 flex items-center gap-2">
                <UserPlus className="h-6 w-6" />
                Add New Admin
              </h2>
              <p className="text-sm text-muted-foreground mb-4">
                Enter a valid Internet Identity principal to grant admin access.
              </p>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="newAdminPrincipal">Principal</Label>
                  <Input
                    id="newAdminPrincipal"
                    type="text"
                    placeholder="Enter principal (e.g., xxxxx-xxxxx-xxxxx-xxxxx-xxx)"
                    value={newAdminPrincipal}
                    onChange={(e) => setNewAdminPrincipal(e.target.value)}
                    disabled={addAdminMutation.isPending}
                  />
                </div>

                <Button
                  onClick={handleAddAdmin}
                  disabled={!newAdminPrincipal.trim() || addAdminMutation.isPending}
                  className="w-full"
                >
                  {addAdminMutation.isPending ? (
                    <>Adding...</>
                  ) : (
                    <>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Add Admin
                    </>
                  )}
                </Button>
              </div>
            </BrandCard>

            {/* Remove Admin */}
            <BrandCard className="p-6">
              <h2 className="text-2xl font-serif font-bold mb-4 flex items-center gap-2">
                <AlertCircle className="h-6 w-6 text-destructive" />
                Remove Admin
              </h2>
              <p className="text-sm text-muted-foreground mb-4">
                Enter a principal to revoke admin access. The initial admin principal and the last remaining admin cannot be removed.
              </p>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="removeAdminPrincipal">Principal</Label>
                  <Input
                    id="removeAdminPrincipal"
                    type="text"
                    placeholder="Enter principal to remove"
                    value={removeAdminPrincipal}
                    onChange={(e) => setRemoveAdminPrincipal(e.target.value)}
                    disabled={removeAdminMutation.isPending}
                  />
                </div>

                <Button
                  onClick={handleRemoveAdmin}
                  disabled={!removeAdminPrincipal.trim() || removeAdminMutation.isPending}
                  variant="destructive"
                  className="w-full"
                >
                  {removeAdminMutation.isPending ? (
                    <>Removing...</>
                  ) : (
                    <>
                      <AlertCircle className="mr-2 h-4 w-4" />
                      Remove Admin
                    </>
                  )}
                </Button>
              </div>

              <Alert className="mt-4" variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Warning:</strong> Removing an admin will immediately revoke their access to all admin features.
                </AlertDescription>
              </Alert>
            </BrandCard>

            {/* Information Notice */}
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Admin Management</AlertTitle>
              <AlertDescription className="space-y-2">
                <p>
                  As an administrator, you can add new admins by entering their Internet Identity principal above.
                  To remove an admin, enter their principal in the removal section.
                </p>
                <p className="text-xs mt-2">
                  <strong>Note:</strong> The backend prevents removing the initial admin principal (zq4an-uqz34-isqap-u5moy-4rxll-vz3ff-ndqph-gvmn5-hqe6u-o6j3v-yqe) 
                  and the last remaining admin to ensure the canister remains accessible.
                </p>
              </AlertDescription>
            </Alert>
          </div>
        </Container>
      </Section>
    </div>
  );
}
