import { useState, useEffect } from 'react';
import { useCreateOrder, useGetDeliveryAddress, useSaveDeliveryAddress } from '../../hooks/useQueries';
import { useCustomerSession } from '../../hooks/useCustomerSession';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import DeliveryAddressForm from './DeliveryAddressForm';
import type { OrderItem, DeliveryAddress } from '../../backend';

interface PlaceOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderItems: OrderItem[];
  totalPrice: number;
}

export default function PlaceOrderDialog({ 
  open, 
  onOpenChange, 
  orderItems, 
  totalPrice 
}: PlaceOrderDialogProps) {
  const { isValid } = useCustomerSession();
  const addressQuery = useGetDeliveryAddress();
  const createOrderMutation = useCreateOrder();
  const saveAddressMutation = useSaveDeliveryAddress();
  const [address, setAddress] = useState<DeliveryAddress | null>(null);
  const [error, setError] = useState('');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState<bigint | null>(null);

  useEffect(() => {
    if (addressQuery.data) {
      setAddress(addressQuery.data);
    }
  }, [addressQuery.data]);

  useEffect(() => {
    if (!open) {
      setOrderPlaced(false);
      setOrderId(null);
      setError('');
    }
  }, [open]);

  const handleAddressSave = async (newAddress: DeliveryAddress) => {
    try {
      await saveAddressMutation.mutateAsync(newAddress);
      // Refetch to get the updated address
      await addressQuery.refetch();
      setAddress(newAddress);
      toast.success('Address saved successfully');
    } catch (err) {
      console.error('Save address error:', err);
      toast.error('Failed to save address');
      throw err;
    }
  };

  const handlePlaceOrder = async () => {
    if (!isValid) {
      setError('Please log in to place an order');
      return;
    }

    if (!address) {
      setError('Please provide a delivery address');
      return;
    }

    setError('');

    try {
      const createdOrderId = await createOrderMutation.mutateAsync({
        items: orderItems,
        totalPrice,
        address,
      });
      
      setOrderId(createdOrderId);
      setOrderPlaced(true);
      toast.success('Order placed successfully!');
      
      setTimeout(() => {
        onOpenChange(false);
      }, 3000);
    } catch (err) {
      console.error('Place order error:', err);
      setError('Failed to place order. Please try again.');
    }
  };

  if (!isValid) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Login Required</DialogTitle>
            <DialogDescription>
              Please log in to place an order
            </DialogDescription>
          </DialogHeader>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogContent>
      </Dialog>
    );
  }

  if (orderPlaced) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              Order Placed Successfully!
            </DialogTitle>
            <DialogDescription>
              Your order {orderId ? `#${orderId.toString()}` : ''} has been received and will be processed soon.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Place Order</DialogTitle>
          <DialogDescription>
            Review your order details and confirm delivery address
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <h3 className="font-semibold mb-2">Order Summary</h3>
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <p className="text-sm">
                <span className="font-medium">Items:</span> {orderItems.length}
              </p>
              <p className="text-sm">
                <span className="font-medium">Total:</span> ₹{totalPrice.toFixed(2)}
              </p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Delivery Address</h3>
            <DeliveryAddressForm
              initialAddress={address || undefined}
              onSuccess={handleAddressSave}
              showActions={true}
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex gap-2 justify-end pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={createOrderMutation.isPending}>
              Cancel
            </Button>
            <Button onClick={handlePlaceOrder} disabled={createOrderMutation.isPending || !address}>
              {createOrderMutation.isPending ? 'Placing Order...' : 'Place Order'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
