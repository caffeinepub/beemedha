import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useCart } from '../../hooks/useCart';
import { formatINR } from '../../utils/price';
import { Minus, Plus, Trash2, ShoppingBag, X } from 'lucide-react';
import { useState } from 'react';
import PlaceOrderDialog from '../orders/PlaceOrderDialog';

interface CartSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLoginRequired: () => void;
}

export default function CartSheet({ open, onOpenChange, onLoginRequired }: CartSheetProps) {
  const { items, updateQuantity, removeItem, getTotal, getItemCount } = useCart();
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const itemCount = getItemCount();

  const handleCheckout = () => {
    setCheckoutOpen(true);
  };

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="right" className="w-full sm:max-w-lg p-0 flex flex-col">
          <SheetHeader className="p-6 pb-4 border-b border-border/40">
            <div className="flex items-center justify-between">
              <SheetTitle className="text-2xl font-serif">Shopping Cart</SheetTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onOpenChange(false)}
                className="h-8 w-8 rounded-full"
                aria-label="Close cart"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            {itemCount > 0 && (
              <p className="text-sm text-muted-foreground mt-1">
                {itemCount} {itemCount === 1 ? 'item' : 'items'}
              </p>
            )}
          </SheetHeader>

          <div className="flex-1 overflow-y-auto p-6">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <ShoppingBag className="h-16 w-16 text-muted-foreground/40 mb-4" />
                <p className="text-lg font-medium text-muted-foreground">Your cart is empty</p>
                <p className="text-sm text-muted-foreground mt-2">Add some products to get started</p>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item, index) => {
                  const itemPrice = item.price.salePrice ?? item.price.listPrice;
                  
                  return (
                    <div key={index} className="bg-card border border-border/40 rounded-lg p-4 shadow-soft">
                      <div className="flex gap-4">
                        <img
                          src={item.productImage}
                          alt={item.productName}
                          className="w-20 h-20 object-cover rounded-md"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-foreground truncate">{item.productName}</h3>
                          {item.variantLabel && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {item.variantLabel}
                            </p>
                          )}
                          <p className="text-sm font-semibold text-primary mt-2">
                            {formatINR(itemPrice)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateQuantity(index, Math.max(1, item.quantity - 1))}
                            className="h-8 w-8"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-12 text-center font-medium">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateQuantity(index, item.quantity + 1)}
                            className="h-8 w-8"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(index)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {items.length > 0 && (
            <div className="border-t border-border/40 p-6 bg-muted/30">
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-base">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">{formatINR(getTotal())}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span className="text-primary">{formatINR(getTotal())}</span>
                </div>
              </div>
              <Button
                onClick={handleCheckout}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6 text-lg"
                size="lg"
              >
                Proceed to Checkout
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>

      <PlaceOrderDialog open={checkoutOpen} onOpenChange={setCheckoutOpen} onLoginRequired={onLoginRequired} />
    </>
  );
}
