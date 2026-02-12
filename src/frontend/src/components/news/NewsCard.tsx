import { Link } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar } from 'lucide-react';
import type { ProductUpdate, ProductUpdateType } from '../../backend';

function getUpdateTypeBadge(type: ProductUpdateType) {
  const typeMap: Record<ProductUpdateType, { label: string; variant: 'default' | 'secondary' | 'outline' }> = {
    newHarvest: { label: 'New Harvest', variant: 'default' },
    seasonalAvailability: { label: 'Seasonal', variant: 'secondary' },
    priceUpdate: { label: 'Price Update', variant: 'outline' },
    limitedTimeOffer: { label: 'Limited Offer', variant: 'default' },
  };
  const config = typeMap[type];
  return <Badge variant={config.variant}>{config.label}</Badge>;
}

export default function NewsCard({ update }: { update: ProductUpdate }) {
  const date = new Date(Number(update.timestamp) / 1000000);

  return (
    <Link to="/news/$updateId" params={{ updateId: update.id.toString() }}>
      <Card className="hover:shadow-premium transition-all duration-300 cursor-pointer group h-full">
        <CardHeader>
          <div className="flex items-start justify-between gap-4 mb-2">
            {getUpdateTypeBadge(update.productUpdateType)}
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="h-4 w-4 mr-1" />
              {date.toLocaleDateString()}
            </div>
          </div>
          <CardTitle className="group-hover:text-primary transition-colors">
            {update.message.split('\n')[0] || 'Update'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-3">
            {update.message}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
