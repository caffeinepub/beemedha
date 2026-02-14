import { useState } from 'react';
import { useCustomerSession } from '../../hooks/useCustomerSession';
import { useGetDeliveryAddress, useGetCustomerOrders } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, Mail, Phone, LogOut, User, MapPin, Package } from 'lucide-react';
import { toast } from 'sonner';
import type { CustomerIdentifier } from '../../backend';
import DeliveryAddressForm from '../orders/DeliveryAddressForm';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';

interface CustomerLoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function getOrderStatusBadge(status: string) {
  switch (status) {
    case 'pending':
      return <Badge variant="secondary">Pending</Badge>;
    case 'inProgress':
      return <Badge className="bg-blue-500">In Progress</Badge>;
    case 'transit':
      return <Badge className="bg-purple-500">In Transit</Badge>;
    case 'delivered':
      return <Badge className="bg-green-500">Delivered</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
}

export default function CustomerLoginDialog({ open, onOpenChange }: CustomerLoginDialogProps) {
  const { isValid, customerInfo, login, logout } = useCustomerSession();
  const [identifierType, setIdentifierType] = useState<'email' | 'phone'>('email');
  const [identifier, setIdentifier] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'profile' | 'orders'>('profile');

  const addressQuery = useGetDeliveryAddress();
  const ordersQuery = useGetCustomerOrders();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!identifier.trim()) {
      setError(`Please enter your ${identifierType}`);
      return;
    }

    // Basic validation
    if (identifierType === 'email' && !identifier.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    if (identifierType === 'phone' && !/^\d{10}$/.test(identifier.replace(/\D/g, ''))) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    setIsLoading(true);

    try {
      const customerIdentifier: CustomerIdentifier = 
        identifierType === 'email' 
          ? { __kind__: 'email', email: identifier }
          : { __kind__: 'phone', phone: identifier };

      const success = await login(customerIdentifier);
      
      if (success) {
        toast.success('Login successful!');
        setIdentifier('');
        setActiveTab('profile');
      } else {
        setError('Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
    onOpenChange(false);
    setIdentifier('');
    setError('');
  };

  const getIdentifierDisplay = () => {
    if (!customerInfo) return '';
    if (customerInfo.__kind__ === 'email') return customerInfo.email;
    if (customerInfo.__kind__ === 'phone') return customerInfo.phone;
    return '';
  };

  if (isValid && customerInfo) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              My Account
            </DialogTitle>
            <DialogDescription>
              Logged in as {getIdentifierDisplay()}
            </DialogDescription>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'profile' | 'orders')} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="profile">
                <MapPin className="h-4 w-4 mr-2" />
                Profile & Address
              </TabsTrigger>
              <TabsTrigger value="orders">
                <Package className="h-4 w-4 mr-2" />
                My Orders
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-4">
              <div>
                <h3 className="font-semibold mb-3">Delivery Address</h3>
                <DeliveryAddressForm 
                  initialAddress={addressQuery.data || undefined}
                  onSuccess={() => {
                    toast.success('Address saved successfully');
                  }}
                />
              </div>
            </TabsContent>

            <TabsContent value="orders" className="space-y-4">
              <div>
                <h3 className="font-semibold mb-3">Order History</h3>
                {ordersQuery.isLoading ? (
                  <p className="text-sm text-muted-foreground">Loading orders...</p>
                ) : ordersQuery.data && ordersQuery.data.length > 0 ? (
                  <ScrollArea className="h-[400px] pr-4">
                    <div className="space-y-4">
                      {ordersQuery.data.map((order) => (
                        <div key={order.id.toString()} className="border rounded-lg p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-semibold">Order #{order.id.toString()}</p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(Number(order.createdAt) / 1000000).toLocaleDateString()}
                              </p>
                            </div>
                            {getOrderStatusBadge(order.status)}
                          </div>
                          <Separator />
                          <div className="space-y-2">
                            <p className="text-sm">
                              <span className="font-medium">Items:</span> {order.items.length}
                            </p>
                            <p className="text-sm">
                              <span className="font-medium">Total:</span> ₹{order.totalPrice.toFixed(2)}
                            </p>
                            <p className="text-sm">
                              <span className="font-medium">Delivery to:</span> {order.address.name}, {order.address.city}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                ) : (
                  <p className="text-sm text-muted-foreground">No orders yet</p>
                )}
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end pt-4 border-t">
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Customer Login</DialogTitle>
          <DialogDescription>
            Enter your email or phone number to access your account
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleLogin} className="space-y-4">
          <Tabs value={identifierType} onValueChange={(v) => setIdentifierType(v as 'email' | 'phone')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="email">
                <Mail className="h-4 w-4 mr-2" />
                Email
              </TabsTrigger>
              <TabsTrigger value="phone">
                <Phone className="h-4 w-4 mr-2" />
                Phone
              </TabsTrigger>
            </TabsList>

            <TabsContent value="email" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </TabsContent>

            <TabsContent value="phone" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="1234567890"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </TabsContent>
          </Tabs>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
