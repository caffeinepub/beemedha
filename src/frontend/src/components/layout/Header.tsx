import { useState } from 'react';
import { useNavigate, useLocation } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, ShoppingCart, User, LogIn, X } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import CartSheet from '../cart/CartSheet';
import CustomerLoginDialog from '../auth/CustomerLoginDialog';
import { useCustomerSession } from '../../hooks/useCustomerSession';
import { useQuery } from '@tanstack/react-query';
import { useActor } from '../../hooks/useActor';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const { getItemCount } = useCart();
  const { isAuthenticated } = useCustomerSession();
  const { actor } = useActor();

  const itemCount = getItemCount();

  // Fetch logo
  const { data: logo } = useQuery({
    queryKey: ['logo'],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getLogo();
    },
    enabled: !!actor,
  });

  const logoUrl = logo
    ? URL.createObjectURL(new Blob([new Uint8Array(logo.data)], { type: logo.mimeType }))
    : null;

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Products', path: '/products' },
    { label: 'News', path: '/news' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="container mx-auto px-4">
          <div className="flex h-20 items-center justify-between">
            {/* Logo */}
            <button
              onClick={() => navigate({ to: '/' })}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              {logoUrl ? (
                <img src={logoUrl} alt="Logo" className="h-12 w-auto object-contain" />
              ) : (
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-2xl">🍯</span>
                  </div>
                  <span className="text-2xl font-serif font-bold text-foreground">BeeMedha</span>
                </div>
              )}
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Button
                  key={link.path}
                  variant="ghost"
                  onClick={() => navigate({ to: link.path })}
                  className={`text-base font-medium transition-colors ${
                    isActive(link.path)
                      ? 'text-primary bg-primary/5'
                      : 'text-foreground/80 hover:text-primary hover:bg-primary/5'
                  }`}
                >
                  {link.label}
                </Button>
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setLoginOpen(true)}
                className="relative scoped-glow rounded-full"
                aria-label={isAuthenticated ? 'My Account' : 'Login'}
              >
                {isAuthenticated ? <User className="h-5 w-5" /> : <LogIn className="h-5 w-5" />}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCartOpen(true)}
                className="relative scoped-glow rounded-full"
                aria-label="Shopping Cart"
              >
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate({ to: '/admin/login' })}
                className="scoped-glow ml-2"
              >
                Admin
              </Button>
            </div>

            {/* Mobile Menu Trigger */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden scoped-glow rounded-full"
                  aria-label="Open menu"
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 p-0">
                <div className="flex flex-col h-full bg-card">
                  {/* Mobile Menu Header */}
                  <div className="flex items-center justify-between p-6 border-b border-border/40">
                    <h2 className="text-xl font-serif font-bold">Menu</h2>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setMobileMenuOpen(false)}
                      className="h-8 w-8 rounded-full"
                      aria-label="Close menu"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>

                  {/* Mobile Navigation */}
                  <nav className="flex-1 overflow-y-auto p-4">
                    <div className="space-y-1">
                      {navLinks.map((link) => (
                        <Button
                          key={link.path}
                          variant="ghost"
                          onClick={() => {
                            navigate({ to: link.path });
                            setMobileMenuOpen(false);
                          }}
                          className={`w-full justify-start text-base font-medium ${
                            isActive(link.path)
                              ? 'text-primary bg-primary/10'
                              : 'text-foreground/80 hover:text-primary hover:bg-primary/5'
                          }`}
                        >
                          {link.label}
                        </Button>
                      ))}
                    </div>

                    <div className="mt-6 pt-6 border-t border-border/40 space-y-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setLoginOpen(true);
                          setMobileMenuOpen(false);
                        }}
                        className="w-full justify-start scoped-glow"
                      >
                        {isAuthenticated ? (
                          <>
                            <User className="mr-3 h-5 w-5" />
                            My Account
                          </>
                        ) : (
                          <>
                            <LogIn className="mr-3 h-5 w-5" />
                            Customer Login
                          </>
                        )}
                      </Button>

                      <Button
                        variant="outline"
                        onClick={() => {
                          setCartOpen(true);
                          setMobileMenuOpen(false);
                        }}
                        className="w-full justify-start scoped-glow"
                      >
                        <ShoppingCart className="mr-3 h-5 w-5" />
                        Cart {itemCount > 0 && `(${itemCount})`}
                      </Button>

                      <Button
                        variant="default"
                        onClick={() => {
                          navigate({ to: '/admin/login' });
                          setMobileMenuOpen(false);
                        }}
                        className="w-full justify-start scoped-glow"
                      >
                        Admin Login
                      </Button>
                    </div>
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <CartSheet open={cartOpen} onOpenChange={setCartOpen} onLoginRequired={() => setLoginOpen(true)} />
      <CustomerLoginDialog open={loginOpen} onOpenChange={setLoginOpen} />
    </>
  );
}
