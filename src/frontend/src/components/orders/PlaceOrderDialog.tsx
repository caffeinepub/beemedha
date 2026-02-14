import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useCustomerAddresses } from '../../hooks/useCustomerAddresses';
import { useCart } from '../../hooks/useCart';
import { useActor } from '../../hooks/useActor';
import { useCustomerSession } from '../../hooks/useCustomerSession';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { MapPin, Package, CheckCircle2, Loader2 } from 'lucide-react';
import DeliveryAddressForm from './DeliveryAddressForm';
import { formatINR } from '../../utils/price';
import type { DeliveryAddress, OrderItem } from '../../backend';

interface PlaceOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLoginRequired: () => void;
}

export default function PlaceOrderDialog({ open, onOpenChange, onLoginRequired }: PlaceOrderDialogProps) {
  const { session, isAuthenticated } = useCustomerSession();
  const { addresses, saveAddress, isSaving } = useCustomerAddresses();
  const { items, getTotal, clearCart } = useCart();
  const { actor } = useActor();
  const queryClient = useQueryClient();

  const total = getTotal();

  const [selectedAddressIndex, setSelectedAddressIndex] = useState<number | null>(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  // Trigger login requirement when dialog opens while unauthenticated
  useEffect(() => {
    if (open && !isAuthenticated) {
      onOpenChange(false);
      onLoginRequired();
    }
  }, [open, isAuthenticated, onOpenChange, onLoginRequired]);

  // Reset state when dialog closes
  useEffect(() => {
    if (!open) {
      setOrderPlaced(false);
      setOrderId(null);
      setSelectedAddressIndex(null);
      setShowAddressForm(false);
    }
  }, [open]);

  // Don't render if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  const handleSaveAddress = async (address: DeliveryAddress) => {
    try {
      await saveAddress(address);
      toast.success('Address saved successfully');
      setShowAddressForm(false);
      setSelectedAddressIndex(addresses.length);
    } catch (error) {
      toast.error('Failed to save address');
    }
  };

  const handlePlaceOrder = async () => {
    if (selectedAddressIndex === null) {
      toast.error('Please select a delivery address');
      return;
    }

    if (!actor || !session) {
      toast.error('Session expired. Please log in again.');
      return;
    }

    setIsPlacingOrder(true);

    try {
      const address = addresses[selectedAddressIndex];
      
      // Convert cart items to order items
      const orderItems: OrderItem[] = items.map((item) => ({
        productId: item.productId,
        quantity: BigInt(item.quantity),
        weightVariant: item.weightVariant,
        flavorVariant: item.flavorVariant,
      }));

      const result = await actor.createOrder(
        session.sessionId,
        orderItems,
        total,
        address
      );

      if ('success' in result) {
        setOrderId(result.success.toString());
        setOrderPlaced(true);
        clearCart();
        
        // Invalidate queries to refresh order lists
        queryClient.invalidateQueries({ queryKey: ['customerOrders'] });
        queryClient.invalidateQueries({ queryKey: ['adminOrders'] });
        
        toast.success('Order placed successfully!');
      }
    } catch (error) {
      console.error('Order placement error:', error);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (orderPlaced) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md bg-card border-border/50">
          <div className="text-center py-8 space-y-4">
            <div className="flex justify-center">
              <div className="rounded-full bg-green-100 p-4">
                <CheckCircle2 className="h-12 w-12 text-green-600" />
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-serif font-bold mb-2 text-foreground">Order Confirmed!</h3>
              <p className="text-muted-foreground">
                Your order has been placed successfully.
              </p>
              {orderId && (
                <p className="text-sm text-muted-foreground mt-2">
                  Order ID: <span className="font-mono font-semibold">#{orderId}</span>
                </p>
              )}
            </div>
            <Button onClick={() => onOpenChange(false)} className="w-full bg-primary hover:bg-primary/90">
              Continue Shopping
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card border-border/50">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif text-foreground">Place Order</DialogTitle>
          <DialogDescription>
            Select a delivery address and confirm your order
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Order Summary */}
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <Package className="h-5 w-5" />
              Order Summary
            </h3>
            <div className="space-y-2 p-4 bg-muted/30 rounded-lg border border-border/50">
              {items.map((item, index) => {
                const itemPrice = item.price.salePrice ?? item.price.listPrice;
                const itemTotal = itemPrice * item.quantity;

                return (
                  <div key={index} className="flex justify-between text-sm">
                    <span>
                      {item.productName}
                      {item.variantLabel && (
                        <span className="text-muted-foreground ml-1">
                          ({item.variantLabel})
                        </span>
                      )}
                      {' × '}{item.quantity}
                    </span>
                    <span className="font-medium">{formatINR(itemTotal)}</span>
                  </div>
                );
              })}
              <Separator className="my-2 bg-border/50" />
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span className="text-primary">{formatINR(total)}</span>
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Delivery Address
            </h3>

            {!showAddressForm ? (
              <>
                {addresses.length > 0 ? (
                  <RadioGroup
                    value={selectedAddressIndex?.toString()}
                    onValueChange={(value) => setSelectedAddressIndex(parseInt(value))}
                  >
                    <div className="space-y-2">
                      {addresses.map((address, index) => (
                        <div key={index} className="flex items-start space-x-3 p-4 bg-muted/30 rounded-lg border border-border/50">
                          <RadioGroupItem value={index.toString()} id={`address-${index}`} className="mt-1" />
                          <Label htmlFor={`address-${index}`} className="flex-1 cursor-pointer">
                            <p className="font-medium">{address.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {address.addressLine1}
                              {address.addressLine2 && `, ${address.addressLine2}`}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {address.city}, {address.state} {address.postalCode}
                            </p>
                            <p className="text-sm text-muted-foreground">{address.phoneNumber}</p>
                          </Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                ) : (
                  <p className="text-sm text-muted-foreground p-4 bg-muted/30 rounded-lg border border-border/50">
                    No saved addresses. Please add a delivery address.
                  </p>
                )}
                <Button
                  variant="outline"
                  onClick={() => setShowAddressForm(true)}
                  className="w-full border-border/50"
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Add New Address
                </Button>
              </>
            ) : (
              <div className="space-y-4">
                <DeliveryAddressForm
                  onSuccess={handleSaveAddress}
                  isSubmitting={isSaving}
                />
                <Button
                  variant="outline"
                  onClick={() => setShowAddressForm(false)}
                  className="w-full border-border/50"
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>

          {!showAddressForm && (
            <Button
              onClick={handlePlaceOrder}
              disabled={isPlacingOrder || selectedAddressIndex === null}
              className="w-full bg-primary hover:bg-primary/90"
              size="lg"
            >
              {isPlacingOrder ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Placing Order...
                </>
              ) : (
                'Confirm Order'
              )}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
