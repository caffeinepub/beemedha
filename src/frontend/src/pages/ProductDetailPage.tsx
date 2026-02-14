import { useState } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetProduct } from '../hooks/useQueries';
import { useCart } from '../hooks/useCart';
import { usePageMeta } from '../hooks/usePageMeta';
import VariantSelector from '../components/products/VariantSelector';
import PriceDisplay from '../components/products/PriceDisplay';
import { normalizeAssetUrl } from '../utils/assets';
import { toast } from 'sonner';
import { ArrowLeft, ShoppingCart, Minus, Plus } from 'lucide-react';
import type { Price, WeightVariant, FlavorVariant, AvailabilityStatus } from '../backend';

function getAvailabilityBadge(status: AvailabilityStatus) {
  switch (status) {
    case 'inStock':
      return <Badge className="bg-accent text-accent-foreground">In Stock</Badge>;
    case 'limited':
      return <Badge variant="secondary">Limited Stock</Badge>;
    case 'outOfStock':
      return <Badge variant="destructive">Out of Stock</Badge>;
  }
}

function getCategoryImage(category: string): string {
  const categoryMap: Record<string, string> = {
    beeProducts: '/assets/products/bee_wax.jpeg',
    naturalHoney: '/assets/products/honey.jpeg',
    rawHoney: '/assets/products/Raw_boney.jpeg',
  };
  return categoryMap[category] || '/assets/products/honey.jpeg';
}

export default function ProductDetailPage() {
  const { productId } = useParams({ strict: false });
  const navigate = useNavigate();
  const { addItem } = useCart();
  
  const productIdBigInt = productId ? BigInt(productId) : null;
  const { data: product, isLoading } = useGetProduct(productIdBigInt);

  const [selectedPrice, setSelectedPrice] = useState<Price | null>(null);
  const [selectedVariantLabel, setSelectedVariantLabel] = useState<string>('');
  const [selectedWeightVariant, setSelectedWeightVariant] = useState<WeightVariant | undefined>();
  const [selectedFlavorVariant, setSelectedFlavorVariant] = useState<FlavorVariant | undefined>();
  const [quantity, setQuantity] = useState(1);

  usePageMeta(
    product?.name || 'Product Details',
    product?.description || 'View product details'
  );

  const handleVariantChange = (
    price: Price,
    label: string,
    weightVariant?: WeightVariant,
    flavorVariant?: FlavorVariant
  ) => {
    setSelectedPrice(price);
    setSelectedVariantLabel(label);
    setSelectedWeightVariant(weightVariant);
    setSelectedFlavorVariant(flavorVariant);
  };

  const handleAddToCart = () => {
    if (!product) return;

    const priceToUse = selectedPrice || product.price;
    
    addItem(
      product,
      quantity,
      priceToUse,
      selectedVariantLabel || undefined,
      selectedWeightVariant,
      selectedFlavorVariant
    );

    toast.success(`Added ${quantity} ${product.name} to cart`);
    setQuantity(1);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-8 w-32 mb-8" />
        <div className="grid md:grid-cols-2 gap-8">
          <Skeleton className="aspect-square" />
          <div className="space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-serif font-bold mb-4">Product Not Found</h1>
        <Button onClick={() => navigate({ to: '/products' })}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Products
        </Button>
      </div>
    );
  }

  const imageUrl = product.image
    ? normalizeAssetUrl(product.image)
    : getCategoryImage(product.category);

  const displayPrice = selectedPrice || product.price;
  const isOutOfStock = product.availability === 'outOfStock';

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate({ to: '/products' })}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Products
        </Button>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Image */}
          <div className="aspect-square overflow-hidden rounded-lg bg-muted">
            <img
              src={imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between gap-4 mb-3">
                <h1 className="text-3xl md:text-4xl font-serif font-bold">
                  {product.name}
                </h1>
                {getAvailabilityBadge(product.availability)}
              </div>
              <PriceDisplay price={displayPrice} className="text-2xl" />
            </div>

            <p className="text-muted-foreground leading-relaxed">
              {product.description}
            </p>

            {/* Variant Selector */}
            {product.variants && (
              <VariantSelector
                variants={product.variants}
                onVariantChange={handleVariantChange}
              />
            )}

            {/* Quantity Selector */}
            <div className="space-y-2">
              <label className="text-base font-semibold">Quantity</label>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={isOutOfStock}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-semibold text-lg">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                  disabled={isOutOfStock}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <Button
              size="lg"
              className="w-full"
              onClick={handleAddToCart}
              disabled={isOutOfStock}
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
            </Button>

            {/* Stock Info */}
            {product.stock > 0 && product.stock <= 10 && (
              <p className="text-sm text-muted-foreground">
                Only {product.stock.toString()} left in stock
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
