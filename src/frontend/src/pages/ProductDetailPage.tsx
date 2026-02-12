import { useParams, useNavigate } from '@tanstack/react-router';
import { Section, Container, BrandCard } from '../components/brand/BrandPrimitives';
import { usePageMeta } from '../hooks/usePageMeta';
import { useGetProduct, useGetProductUpdatesByProduct } from '../hooks/useQueries';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import PurchasePlaceholder from '../components/products/PurchasePlaceholder';
import { ArrowLeft, MapPin, Leaf, Star } from 'lucide-react';
import { AvailabilityStatus } from '../backend';

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
    rawForest: '/assets/generated/raw-forest-honey.dim_800x800.png',
    organicWild: '/assets/generated/organic-wild-honey.dim_800x800.png',
    herbalInfused: '/assets/generated/herbal-infused-honey.dim_800x800.png',
    honeyComb: '/assets/generated/honey-comb.dim_800x800.png',
  };
  return categoryMap[category] || categoryMap.rawForest;
}

export default function ProductDetailPage() {
  const { productId } = useParams({ from: '/products/$productId' });
  const navigate = useNavigate();
  const productQuery = useGetProduct(BigInt(productId));
  const updatesQuery = useGetProductUpdatesByProduct(BigInt(productId));

  const product = productQuery.data;
  const updates = updatesQuery.data || [];

  usePageMeta(
    product?.name || 'Product',
    product?.description || 'View product details'
  );

  if (productQuery.isLoading) {
    return (
      <Section>
        <Container>
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading product...</p>
          </div>
        </Container>
      </Section>
    );
  }

  if (!product) {
    return (
      <Section>
        <Container>
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">Product not found</p>
            <Button onClick={() => navigate({ to: '/products' })}>
              Back to Products
            </Button>
          </div>
        </Container>
      </Section>
    );
  }

  const imageUrl = product.images.length > 0 ? product.images[0] : getCategoryImage(product.category);

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
        </Container>
      </Section>

      <Section className="pt-0">
        <Container>
          <div className="grid md:grid-cols-2 gap-12">
            {/* Product Image */}
            <div>
              <div className="aspect-square rounded-lg overflow-hidden bg-muted shadow-premium">
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
                <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
                  {product.name}
                </h1>
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-4xl font-bold text-primary">
                    ${product.price.toFixed(2)}
                  </span>
                  {getAvailabilityBadge(product.availability)}
                </div>
              </div>

              <Separator />

              <div>
                <h2 className="text-2xl font-serif font-semibold mb-3">Description</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
              </div>

              <Separator />

              <div>
                <h2 className="text-2xl font-serif font-semibold mb-3">Nutritional Information</h2>
                <p className="text-muted-foreground">
                  Pure natural honey is rich in antioxidants, enzymes, and minerals. Contains natural sugars, trace amounts of vitamins and minerals, and beneficial plant compounds.
                </p>
              </div>

              <Separator />

              <div>
                <h2 className="text-2xl font-serif font-semibold mb-3 flex items-center gap-2">
                  <MapPin className="h-6 w-6 text-primary" />
                  Harvest Location
                </h2>
                <p className="text-muted-foreground">
                  Sourced from pristine natural forests and organic farms, ensuring the highest quality and purity.
                </p>
              </div>

              <Separator />

              <div>
                <h2 className="text-2xl font-serif font-semibold mb-3 flex items-center gap-2">
                  <Leaf className="h-6 w-6 text-accent" />
                  Benefits
                </h2>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-1">✓</span>
                    <span>Natural energy boost</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-1">✓</span>
                    <span>Rich in antioxidants</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-1">✓</span>
                    <span>Supports immune system</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-1">✓</span>
                    <span>Natural antibacterial properties</span>
                  </li>
                </ul>
              </div>

              <Separator />

              <PurchasePlaceholder />
            </div>
          </div>
        </Container>
      </Section>

      {/* Customer Reviews */}
      <Section className="bg-muted/30">
        <Container>
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-8 flex items-center gap-3">
            <Star className="h-8 w-8 text-primary" />
            Customer Reviews
          </h2>
          {updates.length === 0 ? (
            <BrandCard className="p-8 text-center">
              <p className="text-muted-foreground">
                No reviews yet. Be the first to share your experience!
              </p>
            </BrandCard>
          ) : (
            <div className="space-y-4">
              {updates.map((update) => (
                <BrandCard key={update.id.toString()} className="p-6">
                  <p className="text-muted-foreground">{update.message}</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    {new Date(Number(update.timestamp) / 1000000).toLocaleDateString()}
                  </p>
                </BrandCard>
              ))}
            </div>
          )}
        </Container>
      </Section>
    </div>
  );
}
