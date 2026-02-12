import { useParams, useNavigate, Link } from '@tanstack/react-router';
import { Section, Container, BrandCard } from '../components/brand/BrandPrimitives';
import { usePageMeta } from '../hooks/usePageMeta';
import { useGetAllProductUpdates, useGetProduct } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, Package } from 'lucide-react';
import { ProductUpdateType } from '../backend';
import PriceDisplay from '../components/products/PriceDisplay';
import { normalizeAssetUrl } from '../utils/assets';

function getUpdateTypeBadge(type: ProductUpdateType) {
  const typeMap: Record<ProductUpdateType, { label: string; variant: 'default' | 'secondary' | 'outline' }> = {
    newHarvest: { label: 'New Harvest', variant: 'default' },
    seasonalAvailability: { label: 'Seasonal', variant: 'secondary' },
    priceUpdate: { label: 'Price Update', variant: 'outline' },
    limitedTimeOffer: { label: 'Limited Offer', variant: 'default' },
  };
  const config = typeMap[type];
  return <Badge variant={config.variant} className="text-base px-4 py-1">{config.label}</Badge>;
}

export default function NewsDetailPage() {
  const { newsId } = useParams({ from: '/news/$newsId' });
  const navigate = useNavigate();
  const updatesQuery = useGetAllProductUpdates();
  
  const update = updatesQuery.data?.find(u => u.id.toString() === newsId);
  const productQuery = useGetProduct(update ? update.productId : null);
  const product = productQuery.data;

  usePageMeta(
    update ? 'News Update' : 'News',
    update?.message.substring(0, 150) || 'View news update details'
  );

  if (updatesQuery.isLoading) {
    return (
      <Section>
        <Container>
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading update...</p>
          </div>
        </Container>
      </Section>
    );
  }

  if (!update) {
    return (
      <Section>
        <Container>
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">Update not found</p>
            <Button onClick={() => navigate({ to: '/news' })}>
              Back to News
            </Button>
          </div>
        </Container>
      </Section>
    );
  }

  const date = new Date(Number(update.timestamp) / 1000000);

  return (
    <div>
      <Section className="py-8">
        <Container>
          <Button
            variant="ghost"
            onClick={() => navigate({ to: '/news' })}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to News
          </Button>
        </Container>
      </Section>

      <Section className="pt-0">
        <Container>
          <div className="max-w-3xl mx-auto">
            <BrandCard className="p-8 md:p-12">
              <div className="space-y-6">
                <div className="flex flex-wrap items-center gap-4">
                  {getUpdateTypeBadge(update.productUpdateType)}
                  <div className="flex items-center text-muted-foreground">
                    <Calendar className="h-5 w-5 mr-2" />
                    {date.toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </div>
                </div>

                <div className="prose prose-lg max-w-none">
                  <div className="whitespace-pre-wrap text-foreground leading-relaxed">
                    {update.message}
                  </div>
                </div>

                {product && (
                  <div className="mt-8 pt-8 border-t border-border">
                    <div className="flex items-center gap-2 mb-4">
                      <Package className="h-5 w-5 text-primary" />
                      <h3 className="text-xl font-serif font-semibold">Related Product</h3>
                    </div>
                    <Link to="/products/$productId" params={{ productId: product.id.toString() }}>
                      <div className="flex items-center gap-4 p-4 rounded-lg border border-border hover:border-primary transition-colors">
                        <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                          <img
                            src={normalizeAssetUrl(product.image) || '/assets/generated/raw-forest-honey.dim_800x800.png'}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="font-semibold text-lg">{product.name}</h4>
                          <PriceDisplay price={product.price} size="sm" />
                        </div>
                      </div>
                    </Link>
                  </div>
                )}
              </div>
            </BrandCard>
          </div>
        </Container>
      </Section>
    </div>
  );
}
