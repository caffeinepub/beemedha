import { useState, useEffect } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, ShoppingBag } from 'lucide-react';
import { useGetLogo } from '../../hooks/useQueries';
import { logoToUrl } from '../../utils/logo';
import { useCustomerSession } from '../../hooks/useCustomerSession';
import { useIsAdminRoute } from '../../hooks/useIsAdminRoute';
import CustomerLoginDialog from '../auth/CustomerLoginDialog';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCustomerLoginOpen, setIsCustomerLoginOpen] = useState(false);
  const navigate = useNavigate();
  const { data: logo } = useGetLogo();
  const { isValid: isCustomerLoggedIn } = useCustomerSession();
  const isAdminRoute = useIsAdminRoute();

  const logoUrl = logo ? logoToUrl(logo) ?? '/assets/image.png' : '/assets/image.png';

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/products', label: 'Products' },
    { to: '/news', label: 'News' },
    { to: '/certifications', label: 'Certifications' },
    { to: '/contact', label: 'Contact' },
  ];

  // Close customer login dialog when navigating to admin routes
  useEffect(() => {
    if (isAdminRoute && isCustomerLoginOpen) {
      setIsCustomerLoginOpen(false);
    }
  }, [isAdminRoute, isCustomerLoginOpen]);

  // Don't render customer login dialog on admin routes
  const shouldShowCustomerLogin = !isAdminRoute;

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <img
                src={logoUrl}
                alt="Beemedha"
                className="h-10 w-auto object-contain"
                onError={(e) => {
                  e.currentTarget.src = '/assets/image.png';
                }}
              />
              <span className="font-serif text-xl font-bold hidden sm:inline-block">
                Beemedha
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-sm font-medium transition-colors hover:text-primary"
                  activeProps={{
                    className: 'text-primary',
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-2">
              {shouldShowCustomerLogin && (
                <>
                  {isCustomerLoggedIn ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsCustomerLoginOpen(true)}
                    >
                      <ShoppingBag className="h-4 w-4 mr-2" />
                      Account
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsCustomerLoginOpen(true)}
                    >
                      Login
                    </Button>
                  )}
                </>
              )}
            </div>

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col space-y-4 mt-8">
                  {navLinks.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      className="text-lg font-medium transition-colors hover:text-primary"
                      activeProps={{
                        className: 'text-primary',
                      }}
                      onClick={() => setIsOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                  {shouldShowCustomerLogin && (
                    <div className="pt-4 border-t space-y-2">
                      {isCustomerLoggedIn ? (
                        <Button
                          variant="outline"
                          className="w-full justify-start"
                          onClick={() => {
                            setIsOpen(false);
                            setIsCustomerLoginOpen(true);
                          }}
                        >
                          <ShoppingBag className="h-4 w-4 mr-2" />
                          Account
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          className="w-full justify-start"
                          onClick={() => {
                            setIsOpen(false);
                            setIsCustomerLoginOpen(true);
                          }}
                        >
                          Customer Login
                        </Button>
                      )}
                    </div>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {shouldShowCustomerLogin && (
        <CustomerLoginDialog
          open={isCustomerLoginOpen}
          onOpenChange={setIsCustomerLoginOpen}
        />
      )}
    </>
  );
}
