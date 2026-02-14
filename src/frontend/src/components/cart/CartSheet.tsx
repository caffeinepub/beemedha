import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { formatINR } from '../../utils/price';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import NeonSurface from '../brand/NeonSurface';
import DrawerCloseButton from '../common/DrawerCloseButton';

interface CartSheetProps {
  onCheckout: () => void;
  onLoginRequired: () => void;
  isAuthenticated: boolean;
}

export default function CartSheet({ onCheckout, onLoginRequired, isAuthenticated }: CartSheetProps) {
  const { items, updateQuantity, removeItem, getTotal, getItemCount } = useCart();
  const [open, setOpen] = useState(false);

  const total = getTotal();
  const itemCount = getItemCount();

  const handleCheckout = () => {
    setOpen(false);
    if (!isAuthenticated) {
      onLoginRequired();
    } else {
      onCheckout();
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {itemCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-primary text-primary-foreground">
              {itemCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg p-0 border-0">
        <NeonSurface className="h-full">
          <DrawerCloseButton onClose={() => setOpen(false)} />
          <div className="h-full flex flex-col p-6">
            <SheetHeader>
              <SheetTitle className="font-serif neon-text-glow">Shopping Cart</SheetTitle>
            </SheetHeader>

            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[60vh]">
                <ShoppingCart className="h-16 w-16 neon-icon-glow mb-4" />
                <p className="neon-text-muted">Your cart is empty</p>
              </div>
            ) : (
              <div className="flex flex-col h-full">
                <div className="flex-1 overflow-y-auto py-6 space-y-4">
                  {items.map((item, index) => {
                    const itemPrice = item.price.salePrice ?? item.price.listPrice;
                    const itemTotal = itemPrice * item.quantity;

                    return (
                      <div key={index} className="flex gap-4 p-4 neon-card rounded-lg">
                        <img
                          src={item.productImage}
                          alt={item.productName}
                          className="w-20 h-20 object-cover rounded neon-image-glow"
                        />
                        <div className="flex-1 space-y-2">
                          <div>
                            <h4 className="font-medium text-sm neon-text">{item.productName}</h4>
                            {item.variantLabel && (
                              <p className="text-xs neon-text-muted">
                                {item.variantLabel}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 neon-control-bg rounded-lg">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 neon-button-ghost"
                                onClick={() => updateQuantity(index, Math.max(1, item.quantity - 1))}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="text-sm font-medium w-8 text-center neon-text">{item.quantity}</span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 neon-button-ghost"
                                onClick={() => updateQuantity(index, item.quantity + 1)}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                            <div className="flex items-center gap-2">
                              <p className="font-semibold neon-text-accent">{formatINR(itemTotal)}</p>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 neon-button-destructive"
                                onClick={() => removeItem(index)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="neon-divider pt-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold neon-text">Total</span>
                    <span className="text-2xl font-bold neon-text-primary">{formatINR(total)}</span>
                  </div>
                  <Button
                    className="w-full neon-button-primary"
                    size="lg"
                    onClick={handleCheckout}
                  >
                    Proceed to Checkout
                  </Button>
                </div>
              </div>
            )}
          </div>
        </NeonSurface>
      </SheetContent>
    </Sheet>
  );
}
