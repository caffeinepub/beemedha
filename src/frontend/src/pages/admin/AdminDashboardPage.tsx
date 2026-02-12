import { Link } from '@tanstack/react-router';
import { Section, Container, BrandCard } from '../../components/brand/BrandPrimitives';
import { usePageMeta } from '../../hooks/usePageMeta';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { Package, Newspaper, Settings, Image, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { isOwnerPrincipal } from '../../config/owner';

export default function AdminDashboardPage() {
  usePageMeta('Web Owner Dashboard', 'Manage your Beemedha products and content.');

  const { identity } = useInternetIdentity();
  const userPrincipal = identity?.getPrincipal().toString();
  const isOwner = isOwnerPrincipal(userPrincipal);

  return (
    <div>
      <Section className="bg-muted/30 py-12">
        <Container>
          <div className="text-center space-y-4">
            <h1 className="text-5xl md:text-6xl font-serif font-bold">
              Web Owner Dashboard
            </h1>
            <p className="text-xl text-muted-foreground">
              Manage your products, news updates, and content.
            </p>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Link to="/admin/products">
              <BrandCard className="p-8 hover:shadow-premium transition-all cursor-pointer group h-full">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Package className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-serif font-bold mb-2 group-hover:text-primary transition-colors">
                      Manage Products
                    </h2>
                    <p className="text-muted-foreground">
                      Add, edit, and manage your honey products, pricing, and availability.
                    </p>
                  </div>
                  <Button className="mt-4 bg-primary hover:bg-primary/90">
                    Go to Products
                  </Button>
                </div>
              </BrandCard>
            </Link>

            <Link to="/admin/news">
              <BrandCard className="p-8 hover:shadow-premium transition-all cursor-pointer group h-full">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                    <Newspaper className="h-8 w-8 text-accent" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-serif font-bold mb-2 group-hover:text-primary transition-colors">
                      Manage News
                    </h2>
                    <p className="text-muted-foreground">
                      Create and manage news updates, announcements, and offers.
                    </p>
                  </div>
                  <Button className="mt-4 bg-primary hover:bg-primary/90">
                    Go to News
                  </Button>
                </div>
              </BrandCard>
            </Link>

            <Link to="/admin/logo">
              <BrandCard className="p-8 hover:shadow-premium transition-all cursor-pointer group h-full">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center group-hover:bg-secondary/20 transition-colors">
                    <Image className="h-8 w-8 text-secondary" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-serif font-bold mb-2 group-hover:text-primary transition-colors">
                      Manage Logo
                    </h2>
                    <p className="text-muted-foreground">
                      Upload and customize your site logo that appears in the header.
                    </p>
                  </div>
                  <Button className="mt-4 bg-primary hover:bg-primary/90">
                    Go to Logo
                  </Button>
                </div>
              </BrandCard>
            </Link>

            {isOwner ? (
              <Link to="/admin/access">
                <BrandCard className="p-8 hover:shadow-premium transition-all cursor-pointer group h-full">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                      <Shield className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-serif font-bold mb-2 group-hover:text-primary transition-colors">
                        Admin Access
                      </h2>
                      <p className="text-muted-foreground">
                        Manage administrator principals and access control.
                      </p>
                    </div>
                    <Button className="mt-4 bg-primary hover:bg-primary/90">
                      Manage Access
                    </Button>
                  </div>
                </BrandCard>
              </Link>
            ) : (
              <BrandCard className="p-8 h-full opacity-50 cursor-not-allowed">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center">
                    <Shield className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-serif font-bold mb-2">
                      Admin Access
                    </h2>
                    <p className="text-muted-foreground text-sm">
                      Owner-only access. Manage administrator principals and access control.
                    </p>
                  </div>
                  <Button disabled className="mt-4">
                    Owner Only
                  </Button>
                </div>
              </BrandCard>
            )}
          </div>

          <div className="mt-12 max-w-2xl mx-auto">
            <BrandCard className="p-6 bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
              <div className="flex items-start gap-4">
                <Settings className="h-6 w-6 text-amber-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">Admin Access</h3>
                  <p className="text-sm text-muted-foreground">
                    You are logged in as an administrator. Only authorized users can access this area. 
                    All changes you make will be immediately visible to customers on the public website.
                  </p>
                </div>
              </div>
            </BrandCard>
          </div>
        </Container>
      </Section>
    </div>
  );
}
