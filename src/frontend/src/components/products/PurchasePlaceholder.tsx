import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ShoppingCart, Info } from 'lucide-react';

export default function PurchasePlaceholder() {
  return (
    <div className="space-y-4">
      <Button
        size="lg"
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
        disabled
      >
        <ShoppingCart className="h-5 w-5 mr-2" />
        Add to Cart
      </Button>
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Online checkout coming soon. Please contact us to place an order.
        </AlertDescription>
      </Alert>
    </div>
  );
}
