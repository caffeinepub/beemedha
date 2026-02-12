import { Link } from '@tanstack/react-router';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Product, AvailabilityStatus } from '../../backend';

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
    rawForest: '/assets/generated/raw-forest-honey.dim_800x800.png',
    organicWild: '/assets/generated/organic-wild-honey.dim_800x800.png',
    herbalInfused: '/assets/generated/herbal-infused-honey.dim_800x800.png',
    honeyComb: '/assets/generated/honey-comb.dim_800x800.png',
  };
  return categoryMap[category] || categoryMap.rawForest;
}

export default function ProductCard({ product }: { product: Product }) {
  const imageUrl = product.images.length > 0 ? product.images[0] : getCategoryImage(product.category);

  return (
    <Link to="/products/$productId" params={{ productId: product.id.toString() }}>
      <Card className="overflow-hidden hover:shadow-premium transition-all duration-300 h-full cursor-pointer group">
        <div className="aspect-square overflow-hidden bg-muted">
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <CardContent className="p-4">
          <h3 className="font-serif font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {product.description}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-primary">
              ${product.price.toFixed(2)}
            </span>
            {getAvailabilityBadge(product.availability)}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
