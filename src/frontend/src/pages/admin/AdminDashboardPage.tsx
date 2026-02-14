import { useNavigate } from '@tanstack/react-router';
import { Section, Container, BrandCard } from '../../components/brand/BrandPrimitives';
import { usePageMeta } from '../../hooks/usePageMeta';
import { Button } from '@/components/ui/button';
import { Package, Newspaper, Image, Settings, Package2 } from 'lucide-react';

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  usePageMeta('Web Owner Dashboard', 'Manage your website content and settings');

  const dashboardCards = [
    {
      title: 'Products',
      description: 'Manage your product catalog',
      icon: Package,
      path: '/admin/products',
      color: 'text-blue-600',
    },
    {
      title: 'News & Updates',
      description: 'Create and manage product updates',
      icon: Newspaper,
      path: '/admin/news',
      color: 'text-green-600',
    },
    {
      title: 'Logo',
      description: 'Update your brand logo',
      icon: Image,
      path: '/admin/logo',
      color: 'text-purple-600',
    },
    {
      title: 'Site Settings',
      description: 'Manage site content and configuration',
      icon: Settings,
      path: '/admin/settings',
      color: 'text-orange-600',
    },
    {
      title: 'Orders',
      description: 'View and manage customer orders',
      icon: Package2,
      path: '/admin/orders',
      color: 'text-red-600',
    },
  ];

  return (
    <Section className="py-12">
      <Container>
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-serif font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your website content and settings
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dashboardCards.map((card) => {
              const Icon = card.icon;
              return (
                <BrandCard
                  key={card.path}
                  className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => navigate({ to: card.path })}
                >
                  <div className="space-y-4">
                    <div className={`p-3 rounded-lg bg-muted w-fit ${card.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-serif font-semibold text-xl mb-2">
                        {card.title}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        {card.description}
                      </p>
                    </div>
                    <Button variant="outline" className="w-full">
                      Manage
                    </Button>
                  </div>
                </BrandCard>
              );
            })}
          </div>
        </div>
      </Container>
    </Section>
  );
}
