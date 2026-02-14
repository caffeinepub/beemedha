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
  X,
} from 'lucide-react';
import { useAdminSession } from '../../../hooks/useAdminSession';
import { toast } from 'sonner';

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
    <div className="flex flex-col h-full bg-card">
      <div className="p-6">
        <h2 className="text-2xl font-serif font-bold text-foreground">Admin Dashboard</h2>
        <p className="text-sm text-muted-foreground mt-1">Manage your store</p>
      </div>
      <Separator />
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <Button
                key={item.id}
                variant={isActive ? 'secondary' : 'ghost'}
                className={`w-full justify-start ${
                  isActive
                    ? 'bg-primary/10 text-primary font-semibold'
                    : 'text-foreground/80 hover:text-primary hover:bg-primary/5'
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
      <Separator />
      <div className="p-4">
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={handleLogout}
        >
          <LogOut className="mr-3 h-5 w-5" />
          Logout
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 border-r border-border/40">
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden border-b border-border/40 bg-card">
          <div className="flex items-center justify-between p-4">
            <h1 className="text-xl font-serif font-bold">Admin</h1>
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <div className="relative h-full">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setMobileMenuOpen(false)}
                    className="absolute top-4 right-4 h-8 w-8 rounded-full z-10"
                    aria-label="Close menu"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                  <SidebarContent />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-hidden bg-muted/20">
          <ScrollArea className="h-full">
            <div className="p-6 md:p-8">
              {children}
            </div>
          </ScrollArea>
        </main>
      </div>
    </div>
  );
}
