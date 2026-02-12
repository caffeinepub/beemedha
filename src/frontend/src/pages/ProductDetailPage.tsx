import { useState } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { Section, Container, BrandCard } from '../components/brand/BrandPrimitives';
import { usePageMeta } from '../hooks/usePageMeta';
import { useGetProduct, useGetProductUpdatesByProduct } from '../hooks/useQueries';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import PurchasePlaceholder from '../components/products/PurchasePlaceholder';
import PriceDisplay from '../components/products/PriceDisplay';
import VariantSelector from '../components/products/VariantSelector';
import { ArrowLeft, Package, Leaf, Award } from 'lucide-react';
import type { AvailabilityStatus, Price } from '../backend';
import { normalizeAssetUrl } from '../utils/assets';

function getAvailabilityBadge(status: AvailabilityStatus) {
  switch (status) {
    case 'inStock':
      return <Badge className="bg-accent text-accent-foreground text-base px-4 py-1">In Stock</Badge>;
    case 'limited':
      return <Badge variant="secondary" className="text-base px-4 py-1">Limited Stock</Badge>;
    case 'outOfStock':
      return <Badge variant="destructive" className="text-base px-4 py-1">Out of Stock</Badge>;
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

function getCategoryName(category: string): string {
  const categoryNames: Record<string, string> = {
    beeProducts: 'Bee Products',
    naturalHoney: 'Natural Honey',
    rawHoney: 'Raw Honey',
  };
  return categoryNames[category] || category;
}

export default function ProductDetailPage() {
  const { productId } = useParams({ from: '/products/$productId' });
  const navigate = useNavigate();
  
  const productQuery = useGetProduct(BigInt(productId));
  const product = productQuery.data;

  const updatesQuery = useGetProductUpdatesByProduct(BigInt(productId));
  const updates = updatesQuery.data || [];

  // State for variant selection
  const [selectedVariantPrice, setSelectedVariantPrice] = useState<Price | null>(null);
  const [selectedVariantLabel, setSelectedVariantLabel] = useState<string>('');

  usePageMeta(
    product?.name || 'Product Details',
    product?.description || 'View product details and information.'
  );

  if (productQuery.isLoading) {
    return (
      <Section className="py-12">
        <Container>
          <div className="text-center">
            <p className="text-muted-foreground">Loading product...</p>
          </div>
        </Container>
      </Section>
    );
  }

  if (!product) {
    return (
      <Section className="py-12">
        <Container>
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-serif font-bold">Product Not Found</h1>
            <p className="text-muted-foreground">The product you're looking for doesn't exist.</p>
            <Button onClick={() => navigate({ to: '/products' })}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Products
            </Button>
          </div>
        </Container>
      </Section>
    );
  }

  const imageUrl = product.image 
    ? normalizeAssetUrl(product.image) 
    : getCategoryImage(product.category);

  // Determine which price to display
  const displayPrice = selectedVariantPrice || product.price;

  return (
    <div>
      <Section className="py-8">
        <Container>
          <Button
            variant="ghost"
            onClick={() => navigate({ to: '/products' })}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Image */}
            <div className="space-y-4">
              <div className="aspect-square rounded-premium overflow-hidden bg-muted">
                <img
                  src={imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <Badge variant="outline" className="mb-3">
                  {getCategoryName(product.category)}
                </Badge>
                <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
                  {product.name}
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
              </div>

              <Separator />

              {/* Variant Selector */}
              {product.variants && (
                <>
                  <VariantSelector
                    variants={product.variants}
                    onVariantChange={(price, label) => {
                      setSelectedVariantPrice(price);
                      setSelectedVariantLabel(label);
                    }}
                  />
                  <Separator />
                </>
              )}

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <PriceDisplay price={displayPrice} size="lg" />
                  {getAvailabilityBadge(product.availability)}
                </div>

                <PurchasePlaceholder />
              </div>

              <Separator />

              {/* Product Features */}
              <div className="space-y-4">
                <h3 className="font-serif font-semibold text-xl">Product Features</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Leaf className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">100% Natural</h4>
                      <p className="text-sm text-muted-foreground">
                        Pure and unprocessed, straight from nature
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Award className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Premium Quality</h4>
                      <p className="text-sm text-muted-foreground">
                        Carefully sourced and quality tested
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Package className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Secure Packaging</h4>
                      <p className="text-sm text-muted-foreground">
                        Safely packaged to preserve freshness
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Product Updates */}
      {updates.length > 0 && (
        <Section className="bg-muted/30">
          <Container>
            <h2 className="text-3xl font-serif font-bold mb-8">Product Updates</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {updates.map((update) => (
                <BrandCard key={update.id.toString()} className="p-6">
                  <Badge variant="outline" className="mb-3">
                    {update.productUpdateType}
                  </Badge>
                  <p className="text-muted-foreground">{update.message}</p>
                  <p className="text-xs text-muted-foreground mt-4">
                    {new Date(Number(update.timestamp) / 1000000).toLocaleDateString()}
                  </p>
                </BrandCard>
              ))}
            </div>
          </Container>
        </Section>
      )}
    </div>
  );
}
