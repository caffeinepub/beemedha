import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Section, Container } from '../components/brand/BrandPrimitives';
import { usePageMeta } from '../hooks/usePageMeta';
import { useGetAllProductUpdates, useGetProductUpdatesByType } from '../hooks/useQueries';
import NewsCard from '../components/news/NewsCard';
import { ProductUpdateType } from '../backend';
import { Clock } from 'lucide-react';

export default function NewsPage() {
  usePageMeta('News & Updates', 'Stay updated with our latest harvest announcements, seasonal availability, and special offers.');
  const [selectedType, setSelectedType] = useState<'all' | ProductUpdateType>('all');
  
  const allUpdatesQuery = useGetAllProductUpdates();
  const newHarvestQuery = useGetProductUpdatesByType('newHarvest' as ProductUpdateType);
  const seasonalQuery = useGetProductUpdatesByType('seasonalAvailability' as ProductUpdateType);
  const priceQuery = useGetProductUpdatesByType('priceUpdate' as ProductUpdateType);
  const offerQuery = useGetProductUpdatesByType('limitedTimeOffer' as ProductUpdateType);

  const getCurrentQuery = () => {
    switch (selectedType) {
      case 'newHarvest':
        return newHarvestQuery;
      case 'seasonalAvailability':
        return seasonalQuery;
      case 'priceUpdate':
        return priceQuery;
      case 'limitedTimeOffer':
        return offerQuery;
      default:
        return allUpdatesQuery;
    }
  };

  const currentQuery = getCurrentQuery();
  const updates = currentQuery.data || [];
  const lastUpdated = currentQuery.dataUpdatedAt;

  // Sort by timestamp descending
  const sortedUpdates = [...updates].sort((a, b) => 
    Number(b.timestamp) - Number(a.timestamp)
  );

  return (
    <div>
      <Section className="bg-muted/30 py-12">
        <Container>
          <div className="text-center space-y-4">
            <h1 className="text-5xl md:text-6xl font-serif font-bold">
              News & Updates
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Stay informed about our latest harvests, seasonal availability, and special offers.
            </p>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <Tabs
            defaultValue="all"
            onValueChange={(value) => setSelectedType(value as 'all' | ProductUpdateType)}
            className="w-full"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <TabsList className="grid grid-cols-2 sm:grid-cols-5 w-full sm:w-auto">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="newHarvest">New Harvest</TabsTrigger>
                <TabsTrigger value="seasonalAvailability">Seasonal</TabsTrigger>
                <TabsTrigger value="priceUpdate">Price Updates</TabsTrigger>
                <TabsTrigger value="limitedTimeOffer">Offers</TabsTrigger>
              </TabsList>
              
              {lastUpdated > 0 && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Last updated: {new Date(lastUpdated).toLocaleTimeString()}</span>
                </div>
              )}
            </div>

            <TabsContent value="all" className="mt-0">
              {currentQuery.isLoading ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Loading updates...</p>
                </div>
              ) : sortedUpdates.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No updates available yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sortedUpdates.map((update) => (
                    <NewsCard key={update.id.toString()} update={update} />
                  ))}
                </div>
              )}
            </TabsContent>

            {['newHarvest', 'seasonalAvailability', 'priceUpdate', 'limitedTimeOffer'].map((type) => (
              <TabsContent key={type} value={type} className="mt-0">
                {currentQuery.isLoading ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">Loading updates...</p>
                  </div>
                ) : sortedUpdates.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No updates of this type available yet.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sortedUpdates.map((update) => (
                      <NewsCard key={update.id.toString()} update={update} />
                    ))}
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </Container>
      </Section>
    </div>
  );
}
