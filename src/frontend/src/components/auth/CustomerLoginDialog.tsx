import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useCustomerSession } from '../../hooks/useCustomerSession';
import { useCustomerAddresses } from '../../hooks/useCustomerAddresses';
import { useCustomerOrders } from '../../hooks/useCustomerOrders';
import { toast } from 'sonner';
import { Mail, MapPin, Package, Trash2, User, LogOut } from 'lucide-react';
import DeliveryAddressForm from '../orders/DeliveryAddressForm';
import { formatINR } from '../../utils/price';
import type { DeliveryAddress, OrderStatus } from '../../backend';

interface CustomerLoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const statusColors: Record<OrderStatus, string> = {
  pending: 'bg-warning/20 text-warning-foreground border-warning/30',
  inProgress: 'bg-primary/20 text-primary-foreground border-primary/30',
  transit: 'bg-accent/20 text-accent-foreground border-accent/30',
  delivered: 'bg-success/20 text-success-foreground border-success/30',
};

const statusLabels: Record<OrderStatus, string> = {
  pending: 'Pending',
  inProgress: 'Confirmed',
  transit: 'Shipped',
  delivered: 'Delivered',
};

export default function CustomerLoginDialog({ open, onOpenChange }: CustomerLoginDialogProps) {
  const { session, isAuthenticated, isLoggingIn, login, logout } = useCustomerSession();
  const { addresses, saveAddress, isSaving, deleteAddress, isDeleting } = useCustomerAddresses();
  const { orders, isLoading: ordersLoading } = useCustomerOrders();
  const [email, setEmail] = useState('');
  const [showAddressForm, setShowAddressForm] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error('Please enter your email');
      return;
    }

    try {
      await login(email.trim());
      toast.success('Logged in successfully');
      setEmail('');
    } catch (error) {
      toast.error('Login failed. Please try again.');
    }
  };

  const handleLogout = () => {
    logout();
    onOpenChange(false);
    toast.success('Logged out successfully');
  };

  const handleSaveAddress = async (address: DeliveryAddress) => {
    try {
      await saveAddress(address);
      toast.success('Address saved successfully');
      setShowAddressForm(false);
    } catch (error) {
      toast.error('Failed to save address');
    }
  };

  const handleDeleteAddress = async (index: number) => {
    try {
      await deleteAddress(index);
      toast.success('Address deleted');
    } catch (error) {
      toast.error('Failed to delete address');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        {!isAuthenticated ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-serif">Customer Login</DialogTitle>
              <DialogDescription>
                Enter your email to access your account. No password required.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleLogin} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    disabled={isLoggingIn}
                  />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={isLoggingIn}>
                {isLoggingIn ? 'Logging in...' : 'Login'}
              </Button>
            </form>
          </>
        ) : (
          <>
            <DialogHeader>
              <div className="flex items-center justify-between">
                <div>
                  <DialogTitle className="text-2xl font-serif">My Account</DialogTitle>
                  <DialogDescription className="flex items-center gap-2 mt-1">
                    <User className="h-4 w-4" />
                    {session?.email}
                  </DialogDescription>
                </div>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </DialogHeader>

            <Tabs defaultValue="profile" className="mt-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="addresses">Addresses</TabsTrigger>
                <TabsTrigger value="orders">Orders</TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="space-y-4 mt-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 p-4 bg-card border border-border/40 rounded-lg">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{session?.email}</p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="addresses" className="space-y-4 mt-4">
                {!showAddressForm ? (
                  <>
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-muted-foreground">
                        {addresses.length === 0 ? 'No saved addresses' : `${addresses.length} saved address${addresses.length !== 1 ? 'es' : ''}`}
                      </p>
                      <Button onClick={() => setShowAddressForm(true)} size="sm">
                        <MapPin className="h-4 w-4 mr-2" />
                        Add Address
                      </Button>
                    </div>
                    <div className="space-y-3">
                      {addresses.map((address, index) => (
                        <div key={index} className="p-4 bg-card border border-border/40 rounded-lg">
                          <div className="flex justify-between items-start">
                            <div className="space-y-1">
                              <p className="font-medium">{address.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {address.addressLine1}
                                {address.addressLine2 && `, ${address.addressLine2}`}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {address.city}, {address.state} {address.postalCode}
                              </p>
                              <p className="text-sm text-muted-foreground">{address.phoneNumber}</p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteAddress(index)}
                              disabled={isDeleting}
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">Add New Address</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowAddressForm(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                    <DeliveryAddressForm
                      onSuccess={handleSaveAddress}
                      isSubmitting={isSaving}
                    />
                  </div>
                )}
              </TabsContent>

              <TabsContent value="orders" className="space-y-4 mt-4">
                {ordersLoading ? (
                  <p className="text-center text-muted-foreground py-8">Loading orders...</p>
                ) : orders.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 text-muted-foreground/40 mx-auto mb-3" />
                    <p className="text-muted-foreground">No orders yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {orders.map((order) => (
                      <div key={order.id.toString()} className="p-4 bg-card border border-border/40 rounded-lg space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">Order #{order.id.toString()}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(Number(order.createdAt) / 1_000_000).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge className={statusColors[order.status]}>
                            {statusLabels[order.status]}
                          </Badge>
                        </div>
                        <Separator />
                        <div className="space-y-2">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between text-sm">
                              <span className="text-muted-foreground">
                                Product #{item.productId.toString()} × {item.quantity.toString()}
                              </span>
                            </div>
                          ))}
                        </div>
                        <div className="flex justify-between items-center pt-2">
                          <span className="font-medium">Total</span>
                          <span className="font-bold text-primary">{formatINR(order.totalPrice)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
