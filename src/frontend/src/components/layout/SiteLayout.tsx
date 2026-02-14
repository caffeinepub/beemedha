import { ReactNode } from 'react';
import { useGetSiteSettings } from '../../hooks/useQueries';
import { useIsAdminRoute } from '../../hooks/useIsAdminRoute';
import Header from './Header';
import Footer from './Footer';

interface SiteLayoutProps {
  children: ReactNode;
}

export default function SiteLayout({ children }: SiteLayoutProps) {
  const { data: settings } = useGetSiteSettings();
  const isAdminRoute = useIsAdminRoute();

  const backgroundStyle = settings?.backgroundImage 
    ? { backgroundImage: `url(${settings.backgroundImage})` }
    : {};

  // Admin routes get a minimal layout without public header/footer
  if (isAdminRoute) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <main className="flex-1">
          {children}
        </main>
      </div>
    );
  }

  // Public routes get the full site layout
  return (
    <div 
      className="min-h-screen flex flex-col bg-honeycomb bg-cover bg-fixed bg-center"
      style={backgroundStyle}
    >
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
