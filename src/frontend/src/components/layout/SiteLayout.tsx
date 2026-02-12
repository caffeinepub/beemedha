import { Outlet } from '@tanstack/react-router';
import Header from './Header';
import Footer from './Footer';
import { Toaster } from '@/components/ui/sonner';

export default function SiteLayout() {
  return (
    <div className="min-h-screen flex flex-col relative">
      <div className="fixed inset-0 honeycomb-pattern pointer-events-none z-0" />
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
      <Toaster />
    </div>
  );
}
