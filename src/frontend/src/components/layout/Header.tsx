import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, User } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '../../hooks/useCart';
import { useCustomerSession } from '../../hooks/useCustomerSession';
import { useIsAdminRoute } from '../../hooks/useIsAdminRoute';
import CartSheet from '../cart/CartSheet';
import CustomerLoginDialog from '../auth/CustomerLoginDialog';
import PlaceOrderDialog from '../orders/PlaceOrderDialog';
import NeonSurface from '../brand/NeonSurface';
import DrawerCloseButton from '../common/DrawerCloseButton';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [checkoutDialogOpen, setCheckoutDialogOpen] = useState(false);
  const { getItemCount } = useCart();
  const { isAuthenticated } = useCustomerSession();
  const isAdminRoute = useIsAdminRoute();

  const itemCount = getItemCount();

  if (isAdminRoute) {
    return null;
  }

  const handleCheckout = () => {
    setCheckoutDialogOpen(true);
  };

  const handleLoginRequired = () => {
    setLoginDialogOpen(true);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3">
              <img 
                src="/assets/image-1.png" 
                alt="Beemedha logo" 
                className="h-10 w-10 object-contain"
              />
              <span className="text-2xl font-serif font-bold text-primary">
                Beemedha
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link
                to="/"
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                Home
              </Link>
              <Link
                to="/products"
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                Products
              </Link>
              <Link
                to="/news"
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                News
              </Link>
            </nav>

            {/* Actions */}
            <div className="flex items-center space-x-2">
              <CartSheet
                onCheckout={handleCheckout}
                onLoginRequired={handleLoginRequired}
                isAuthenticated={isAuthenticated}
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setLoginDialogOpen(true)}
                className="hidden md:flex"
              >
                <User className="h-5 w-5" />
              </Button>

              {/* Mobile Menu */}
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild className="md:hidden">
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] p-0 border-0 z-[60]">
                  <NeonSurface className="h-full">
                    <DrawerCloseButton onClose={() => setMobileMenuOpen(false)} />
                    <nav className="flex flex-col space-y-4 p-8 mt-8">
                      <Link
                        to="/"
                        className="text-lg font-medium transition-colors neon-nav-link"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Home
                      </Link>
                      <Link
                        to="/products"
                        className="text-lg font-medium transition-colors neon-nav-link"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Products
                      </Link>
                      <Link
                        to="/news"
                        className="text-lg font-medium transition-colors neon-nav-link"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        News
                      </Link>
                      <Button
                        variant="outline"
                        className="justify-start neon-button-outline"
                        onClick={() => {
                          setMobileMenuOpen(false);
                          setLoginDialogOpen(true);
                        }}
                      >
                        <User className="h-5 w-5 mr-2" />
                        {isAuthenticated ? 'My Account' : 'Login'}
                      </Button>
                    </nav>
                  </NeonSurface>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      <CustomerLoginDialog
        open={loginDialogOpen}
        onOpenChange={setLoginDialogOpen}
      />

      <PlaceOrderDialog
        open={checkoutDialogOpen}
        onOpenChange={setCheckoutDialogOpen}
        onLoginRequired={handleLoginRequired}
      />
    </>
  );
}
