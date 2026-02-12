import { Link } from '@tanstack/react-router';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Product, AvailabilityStatus } from '../../backend';
import PriceDisplay from './PriceDisplay';
import { normalizeAssetUrl } from '../../utils/assets';

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

export default function ProductCard({ product }: { product: Product }) {
  const imageUrl = product.image 
    ? normalizeAssetUrl(product.image) 
    : getCategoryImage(product.category);

  // For products with variants, show the first variant's price
  const displayPrice = product.variants 
    ? (product.variants.__kind__ === 'weight' 
        ? product.variants.weight[0]?.price 
        : product.variants.flavor[0]?.price) || product.price
    : product.price;

  return (
    <Link
      to="/products/$productId"
      params={{ productId: product.id.toString() }}
      className="group"
    >
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full">
        <div className="aspect-square overflow-hidden bg-muted">
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <CardContent className="p-6 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-serif font-semibold text-xl line-clamp-2 group-hover:text-primary transition-colors">
              {product.name}
            </h3>
            {getAvailabilityBadge(product.availability)}
          </div>
          <p className="text-muted-foreground text-sm line-clamp-2">
            {product.description}
          </p>
          <div className="flex items-center justify-between pt-2">
            <PriceDisplay price={displayPrice} />
            {product.variants && (
              <span className="text-xs text-muted-foreground">
                {product.variants.__kind__ === 'weight' 
                  ? `${product.variants.weight.length} sizes` 
                  : `${product.variants.flavor.length} variants`}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
