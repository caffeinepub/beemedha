import { useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, ShoppingBag, LogOut, Lock } from 'lucide-react';
import { useGetLogo } from '../../hooks/useQueries';
import { logoToUrl } from '../../utils/logo';
import { useAdminSession } from '../../hooks/useAdminSession';
import { useCustomerSession } from '../../hooks/useCustomerSession';
import CustomerLoginDialog from '../auth/CustomerLoginDialog';
import { toast } from 'sonner';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCustomerLoginOpen, setIsCustomerLoginOpen] = useState(false);
  const navigate = useNavigate();
  const { data: logo } = useGetLogo();
  const { isValid: isAdminLoggedIn, logout: adminLogout } = useAdminSession();
  const { isValid: isCustomerLoggedIn } = useCustomerSession();

  const logoUrl = logo ? logoToUrl(logo) ?? '/assets/image.png' : '/assets/image.png';

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/products', label: 'Products' },
    { to: '/news', label: 'News' },
    { to: '/certifications', label: 'Certifications' },
    { to: '/contact', label: 'Contact' },
  ];

  const handleAdminLogout = async () => {
    try {
      await adminLogout();
      toast.success('Admin logged out successfully');
      navigate({ to: '/admin' });
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout');
    }
  };

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

              {isAdminLoggedIn ? (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate({ to: '/admin/products' })}
                  >
                    <Lock className="h-4 w-4 mr-2" />
                    Admin
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleAdminLogout}
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate({ to: '/admin' })}
                >
                  <Lock className="h-4 w-4 mr-2" />
                  Admin
                </Button>
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

                    {isAdminLoggedIn ? (
                      <>
                        <Button
                          variant="outline"
                          className="w-full justify-start"
                          onClick={() => {
                            setIsOpen(false);
                            navigate({ to: '/admin/products' });
                          }}
                        >
                          <Lock className="h-4 w-4 mr-2" />
                          Admin Panel
                        </Button>
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                          onClick={() => {
                            setIsOpen(false);
                            handleAdminLogout();
                          }}
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Admin Logout
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => {
                          setIsOpen(false);
                          navigate({ to: '/admin' });
                        }}
                      >
                        <Lock className="h-4 w-4 mr-2" />
                        Admin Login
                      </Button>
                    )}
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <CustomerLoginDialog
        open={isCustomerLoginOpen}
        onOpenChange={setIsCustomerLoginOpen}
      />
    </>
  );
}
