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
import NeonSurface from '../brand/NeonSurface';

interface CustomerLoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const statusColors: Record<OrderStatus, string> = {
  pending: 'neon-badge-pending',
  inProgress: 'neon-badge-progress',
  transit: 'neon-badge-transit',
  delivered: 'neon-badge-delivered',
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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden p-0 border-0 z-[100]">
        <NeonSurface className="max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            {!isAuthenticated ? (
              <>
                <DialogHeader>
                  <DialogTitle className="text-2xl font-serif neon-text-glow">Customer Login</DialogTitle>
                  <DialogDescription className="neon-text-muted">
                    Enter your email to access your account. No password required.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleLogin} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="neon-text">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-5 w-5 neon-icon-glow" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 neon-input"
                        disabled={isLoggingIn}
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full neon-button-primary" disabled={isLoggingIn}>
                    {isLoggingIn ? 'Logging in...' : 'Login'}
                  </Button>
                </form>
              </>
            ) : (
              <>
                <DialogHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <DialogTitle className="text-2xl font-serif neon-text-glow">My Account</DialogTitle>
                      <DialogDescription className="flex items-center gap-2 mt-1 neon-text-muted">
                        <User className="h-4 w-4" />
                        {session?.email}
                      </DialogDescription>
                    </div>
                    <Button variant="outline" size="sm" onClick={handleLogout} className="neon-button-outline">
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                </DialogHeader>

                <Tabs defaultValue="profile" className="mt-4">
                  <TabsList className="grid w-full grid-cols-3 neon-tabs-list">
                    <TabsTrigger value="profile" className="neon-tab-trigger">Profile</TabsTrigger>
                    <TabsTrigger value="addresses" className="neon-tab-trigger">Addresses</TabsTrigger>
                    <TabsTrigger value="orders" className="neon-tab-trigger">Orders</TabsTrigger>
                  </TabsList>

                  <TabsContent value="profile" className="space-y-4 mt-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 p-4 neon-card rounded-lg">
                        <Mail className="h-5 w-5 neon-icon-glow" />
                        <div>
                          <p className="text-sm neon-text-muted">Email</p>
                          <p className="font-medium neon-text">{session?.email}</p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="addresses" className="space-y-4 mt-4">
                    {!showAddressForm ? (
                      <>
                        <div className="flex justify-between items-center">
                          <p className="text-sm neon-text-muted">
                            {addresses.length === 0 ? 'No saved addresses' : `${addresses.length} saved address${addresses.length !== 1 ? 'es' : ''}`}
                          </p>
                          <Button onClick={() => setShowAddressForm(true)} size="sm" className="neon-button-primary">
                            <MapPin className="h-4 w-4 mr-2" />
                            Add Address
                          </Button>
                        </div>
                        <div className="space-y-3">
                          {addresses.map((address, index) => (
                            <div key={index} className="p-4 neon-card rounded-lg">
                              <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                  <p className="font-medium neon-text">{address.name}</p>
                                  <p className="text-sm neon-text-muted">
                                    {address.addressLine1}
                                    {address.addressLine2 && `, ${address.addressLine2}`}
                                  </p>
                                  <p className="text-sm neon-text-muted">
                                    {address.city}, {address.state} {address.postalCode}
                                  </p>
                                  <p className="text-sm neon-text-muted">{address.phoneNumber}</p>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteAddress(index)}
                                  disabled={isDeleting}
                                  className="neon-button-destructive"
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
                          <h3 className="font-medium neon-text">Add New Address</h3>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowAddressForm(false)}
                            className="neon-button-ghost"
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
                      <p className="text-center neon-text-muted py-8">Loading orders...</p>
                    ) : orders.length === 0 ? (
                      <div className="text-center py-8">
                        <Package className="h-12 w-12 neon-icon-glow mx-auto mb-3" />
                        <p className="neon-text-muted">No orders yet</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {orders.map((order) => (
                          <div key={order.id.toString()} className="p-4 neon-card rounded-lg space-y-3">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium neon-text">Order #{order.id.toString()}</p>
                                <p className="text-sm neon-text-muted">
                                  {new Date(Number(order.createdAt) / 1_000_000).toLocaleDateString()}
                                </p>
                              </div>
                              <Badge className={statusColors[order.status]}>
                                {statusLabels[order.status]}
                              </Badge>
                            </div>
                            <Separator className="neon-separator" />
                            <div className="space-y-2">
                              {order.items.map((item, idx) => (
                                <div key={idx} className="flex justify-between text-sm">
                                  <span className="neon-text-muted">
                                    Product #{item.productId.toString()} × {item.quantity.toString()}
                                  </span>
                                </div>
                              ))}
                            </div>
                            <div className="flex justify-between items-center pt-2">
                              <span className="font-medium neon-text">Total</span>
                              <span className="font-bold neon-text-accent">{formatINR(order.totalPrice)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </>
            )}
          </div>
        </NeonSurface>
      </DialogContent>
    </Dialog>
  );
}
