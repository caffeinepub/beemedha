import { useState } from 'react';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useListAdmins } from '../../hooks/useQueries';
import { Section, Container, BrandCard } from '../../components/brand/BrandPrimitives';
import { usePageMeta } from '../../hooks/usePageMeta';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Shield, Copy, Check, AlertCircle, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { Principal } from '@dfinity/principal';
import { OWNER_PRINCIPAL } from '../../config/owner';

export default function AdminAccessPage() {
  usePageMeta('Admin Access Management', 'Manage administrator access and permissions.');

  const { identity } = useInternetIdentity();
  const { data: admins = [], isLoading: loadingAdmins } = useListAdmins();

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
            {/* Single-Admin Mode Notice */}
            <Alert className="border-primary/50 bg-primary/5">
              <Lock className="h-5 w-5 text-primary" />
              <AlertTitle className="text-lg font-semibold">Single-Admin Mode Enabled</AlertTitle>
              <AlertDescription className="mt-2 space-y-2">
                <p>
                  This application is configured in single-admin mode. Admin access is locked to the owner principal only.
                </p>
                <p className="text-sm">
                  <strong>Owner Principal:</strong>
                </p>
                <div className="flex gap-2 items-center mt-1">
                  <code className="flex-1 bg-background px-3 py-2 rounded-md text-xs break-all border">
                    {OWNER_PRINCIPAL}
                  </code>
                  <Button
                    onClick={() => handleCopyPrincipal(OWNER_PRINCIPAL)}
                    variant="outline"
                    size="icon"
                    className="flex-shrink-0"
                  >
                    {copiedPrincipal === OWNER_PRINCIPAL ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </AlertDescription>
            </Alert>

            {/* Current User Principal */}
            <BrandCard className="p-6">
              <h2 className="text-2xl font-serif font-bold mb-4">Your Principal</h2>
              <p className="text-sm text-muted-foreground mb-4">
                This is your Internet Identity principal.
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

            {/* Add New Admin - Disabled in Single-Admin Mode */}
            <BrandCard className="p-6 opacity-60">
              <h2 className="text-2xl font-serif font-bold mb-4 flex items-center gap-2">
                <Lock className="h-6 w-6" />
                Add New Admin
              </h2>
              <p className="text-sm text-muted-foreground mb-4">
                Adding new administrators is disabled in single-admin mode.
              </p>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="newAdminPrincipal" className="text-muted-foreground">Principal</Label>
                  <Input
                    id="newAdminPrincipal"
                    type="text"
                    placeholder="Disabled in single-admin mode"
                    disabled
                    className="cursor-not-allowed"
                  />
                </div>

                <Button
                  disabled
                  className="w-full cursor-not-allowed"
                >
                  <Lock className="mr-2 h-4 w-4" />
                  Add Admin (Disabled)
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
                    No administrators found. This shouldn't happen - the owner should be listed as an admin.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-3">
                  {admins.map((admin) => {
                    const principalText = admin.toString();
                    const isOwner = principalText === OWNER_PRINCIPAL;
                    const isCurrent = principalText === currentUserPrincipal;

                    return (
                      <div
                        key={principalText}
                        className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg border"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="font-mono text-sm break-all">
                            {principalText}
                          </div>
                          <div className="flex gap-2 mt-1">
                            {isOwner && (
                              <div className="text-xs text-primary font-medium flex items-center gap-1">
                                <Shield className="h-3 w-3" />
                                Owner
                              </div>
                            )}
                            {isCurrent && (
                              <div className="text-xs text-muted-foreground font-medium">
                                (You)
                              </div>
                            )}
                          </div>
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
                          <Button
                            variant="outline"
                            size="icon"
                            disabled
                            className="cursor-not-allowed opacity-50"
                            title="Cannot remove admin in single-admin mode"
                          >
                            <Lock className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <Alert className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  In single-admin mode, the owner principal cannot be removed and no additional administrators can be added.
                </AlertDescription>
              </Alert>
            </BrandCard>
          </div>
        </Container>
      </Section>
    </div>
  );
}
