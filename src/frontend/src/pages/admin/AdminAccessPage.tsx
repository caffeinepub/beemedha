import { useState } from 'react';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useListAdmins, useAddAdmin, useRemoveAdmin } from '../../hooks/useQueries';
import { Section, Container, BrandCard } from '../../components/brand/BrandPrimitives';
import { usePageMeta } from '../../hooks/usePageMeta';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Shield, Copy, Trash2, UserPlus, Check, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { validatePrincipal, formatPrincipal } from '../../utils/principal';
import { Principal } from '@dfinity/principal';

export default function AdminAccessPage() {
  usePageMeta('Admin Access Management', 'Manage administrator access and permissions.');

  const { identity } = useInternetIdentity();
  const { data: admins = [], isLoading: loadingAdmins } = useListAdmins();
  const addAdminMutation = useAddAdmin();
  const removeAdminMutation = useRemoveAdmin();

  const [newAdminPrincipal, setNewAdminPrincipal] = useState('');
  const [validationError, setValidationError] = useState('');
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
    setValidationError('');

    const validation = validatePrincipal(newAdminPrincipal);
    
    if (!validation.success) {
      setValidationError(validation.error || 'Invalid principal');
      return;
    }

    if (!validation.principal) {
      setValidationError('Failed to parse principal');
      return;
    }

    try {
      await addAdminMutation.mutateAsync(validation.principal);
      toast.success('Admin added successfully');
      setNewAdminPrincipal('');
      setValidationError('');
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to add admin';
      toast.error(errorMessage);
      setValidationError(errorMessage);
    }
  };

  const handleRemoveAdmin = async (principal: Principal) => {
    try {
      await removeAdminMutation.mutateAsync(principal);
      toast.success('Admin removed successfully');
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to remove admin';
      toast.error(errorMessage);
    }
  };

  const isCurrentUser = (principal: Principal) => {
    return principal.toString() === currentUserPrincipal;
  };

  const currentUserIsAdmin = admins.some(admin => admin.toString() === currentUserPrincipal);

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
            {/* Current User Principal */}
            <BrandCard className="p-6">
              <h2 className="text-2xl font-serif font-bold mb-4">Your Principal</h2>
              <p className="text-sm text-muted-foreground mb-4">
                This is your Internet Identity principal. Share this with other admins if you need them to grant you access.
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
                Enter the Internet Identity principal of the user you want to grant admin access to.
              </p>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="newAdminPrincipal">Principal</Label>
                  <Input
                    id="newAdminPrincipal"
                    type="text"
                    placeholder="Enter principal (e.g., xxxxx-xxxxx-xxxxx-xxxxx-xxx)"
                    value={newAdminPrincipal}
                    onChange={(e) => {
                      setNewAdminPrincipal(e.target.value);
                      setValidationError('');
                    }}
                    className={validationError ? 'border-destructive' : ''}
                  />
                  {validationError && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {validationError}
                    </p>
                  )}
                </div>

                <Button
                  onClick={handleAddAdmin}
                  disabled={addAdminMutation.isPending || !newAdminPrincipal.trim()}
                  className="w-full bg-primary hover:bg-primary/90"
                >
                  {addAdminMutation.isPending ? (
                    <>Adding Admin...</>
                  ) : (
                    <>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Add Admin
                    </>
                  )}
                </Button>
              </div>
            </BrandCard>

            {/* Current Admins List */}
            <BrandCard className="p-6">
              <h2 className="text-2xl font-serif font-bold mb-4">Current Administrators</h2>
              <p className="text-sm text-muted-foreground mb-4">
                {admins.length} {admins.length === 1 ? 'administrator' : 'administrators'} with access to the admin panel.
              </p>

              {loadingAdmins ? (
                <div className="text-center py-8 text-muted-foreground">
                  Loading administrators...
                </div>
              ) : admins.length === 0 ? (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    No administrators found. This shouldn't happen - you should be listed as an admin.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-3">
                  {admins.map((admin) => {
                    const principalText = admin.toString();
                    const isCurrent = isCurrentUser(admin);

                    return (
                      <div
                        key={principalText}
                        className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg border"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="font-mono text-sm break-all">
                            {principalText}
                          </div>
                          {isCurrent && (
                            <div className="text-xs text-primary font-medium mt-1">
                              (You)
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                          <Button
                            onClick={() => handleCopyPrincipal(principalText)}
                            variant="outline"
                            size="icon"
                          >
                            {copiedPrincipal === principalText ? (
                              <Check className="h-4 w-4 text-green-600" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="icon"
                                disabled={isCurrent || removeAdminMutation.isPending}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Remove Administrator</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to remove this administrator? They will lose access to the admin panel immediately.
                                  <div className="mt-4 p-3 bg-muted rounded-md font-mono text-xs break-all">
                                    {formatPrincipal(principalText, 12, 8)}
                                  </div>
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleRemoveAdmin(admin)}
                                  className="bg-destructive hover:bg-destructive/90"
                                >
                                  Remove Admin
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {currentUserIsAdmin && admins.length > 0 && (
                <Alert className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    You cannot remove yourself as an administrator. Another admin must remove you if needed.
                  </AlertDescription>
                </Alert>
              )}
            </BrandCard>
          </div>
        </Container>
      </Section>
    </div>
  );
}
