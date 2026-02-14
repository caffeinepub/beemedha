import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  Menu,
  LogOut,
  Store,
} from 'lucide-react';
import { useAdminSession } from '../../../hooks/useAdminSession';
import { toast } from 'sonner';
import NeonSurface from '../../brand/NeonSurface';
import DrawerCloseButton from '../../common/DrawerCloseButton';

type Section = 'dashboard' | 'store-settings' | 'products' | 'orders' | 'customers';

const navItems = [
  { id: 'dashboard' as Section, label: 'Dashboard', icon: LayoutDashboard },
  { id: 'store-settings' as Section, label: 'Store Settings', icon: Store },
  { id: 'products' as Section, label: 'Products', icon: Package },
  { id: 'orders' as Section, label: 'Orders', icon: ShoppingCart },
  { id: 'customers' as Section, label: 'Customers', icon: Users },
];

interface AdminShellProps {
  activeSection: Section;
  onSectionChange: (section: Section) => void;
  children: React.ReactNode;
}

export default function AdminShell({ activeSection, onSectionChange, children }: AdminShellProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { logout } = useAdminSession();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
  };

  const handleSectionChange = (section: Section) => {
    onSectionChange(section);
    setMobileMenuOpen(false);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-6">
        <h2 className="text-2xl font-serif font-bold neon-text-glow">Admin Dashboard</h2>
        <p className="text-sm neon-text-muted mt-1">Manage your store</p>
      </div>
      <Separator className="neon-separator" />
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <Button
                key={item.id}
                variant={isActive ? 'secondary' : 'ghost'}
                className={`w-full justify-start ${
                  isActive ? 'neon-nav-active' : 'neon-nav-link'
                }`}
                onClick={() => handleSectionChange(item.id)}
              >
                <Icon className="mr-3 h-5 w-5" />
                {item.label}
              </Button>
            );
          })}
        </nav>
      </ScrollArea>
      <Separator className="neon-separator" />
      <div className="p-4">
        <Button
          variant="outline"
          className="w-full justify-start neon-button-outline"
          onClick={handleLogout}
        >
          <LogOut className="mr-3 h-5 w-5" />
          Logout
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 border-r border-border/40">
        <NeonSurface className="w-full">
          <SidebarContent />
        </NeonSurface>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden border-b border-border/40">
          <NeonSurface>
            <div className="flex items-center justify-between p-4">
              <h1 className="text-xl font-serif font-bold neon-text-glow">Admin</h1>
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="neon-button-ghost">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-64 p-0 border-0">
                  <NeonSurface className="h-full">
                    <DrawerCloseButton onClose={() => setMobileMenuOpen(false)} />
                    <SidebarContent />
                  </NeonSurface>
                </SheetContent>
              </Sheet>
            </div>
          </NeonSurface>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-hidden">
          <NeonSurface className="h-full">
            <ScrollArea className="h-full">
              <div className="p-6 md:p-8">
                {children}
              </div>
            </ScrollArea>
          </NeonSurface>
        </main>
      </div>
    </div>
  );
}
