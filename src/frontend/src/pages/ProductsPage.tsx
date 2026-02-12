import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Section, Container } from '../components/brand/BrandPrimitives';
import { usePageMeta } from '../hooks/usePageMeta';
import { useGetAllProducts, useGetProductsByCategory } from '../hooks/useQueries';
import ProductCard from '../components/products/ProductCard';
import { Category } from '../backend';
import { Clock } from 'lucide-react';

export default function ProductsPage() {
  usePageMeta('Our Products', 'Browse our premium collection of pure, natural honey products.');
  const [selectedCategory, setSelectedCategory] = useState<'all' | Category>('all');
  
  const allProductsQuery = useGetAllProducts();
  const beeProductsQuery = useGetProductsByCategory(Category.beeProducts);
  const naturalHoneyQuery = useGetProductsByCategory(Category.naturalHoney);
  const rawHoneyQuery = useGetProductsByCategory(Category.rawHoney);

  const getCurrentQuery = () => {
    switch (selectedCategory) {
      case Category.beeProducts:
        return beeProductsQuery;
      case Category.naturalHoney:
        return naturalHoneyQuery;
      case Category.rawHoney:
        return rawHoneyQuery;
      default:
        return allProductsQuery;
    }
  };

  const currentQuery = getCurrentQuery();
  const products = currentQuery.data || [];
  const lastUpdated = currentQuery.dataUpdatedAt;

  return (
    <div>
      <Section className="bg-muted/30 py-12">
        <Container>
          <div className="text-center space-y-4">
            <h1 className="text-5xl md:text-6xl font-serif font-bold">
              Our Products
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover our premium collection of pure, natural honey varieties and bee products.
            </p>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <Tabs
            defaultValue="all"
            onValueChange={(value) => setSelectedCategory(value as 'all' | Category)}
            className="w-full"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <TabsList className="grid grid-cols-2 sm:grid-cols-4 w-full sm:w-auto">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value={Category.beeProducts}>Bee Products</TabsTrigger>
                <TabsTrigger value={Category.naturalHoney}>Natural Honey</TabsTrigger>
                <TabsTrigger value={Category.rawHoney}>Raw Honey</TabsTrigger>
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
                  <p className="text-muted-foreground">Loading products...</p>
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No products available yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product.id.toString()} product={product} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value={Category.beeProducts} className="mt-0">
              {currentQuery.isLoading ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Loading products...</p>
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No bee products available yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product.id.toString()} product={product} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value={Category.naturalHoney} className="mt-0">
              {currentQuery.isLoading ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Loading products...</p>
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No natural honey products available yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product.id.toString()} product={product} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value={Category.rawHoney} className="mt-0">
              {currentQuery.isLoading ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Loading products...</p>
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No raw honey products available yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product.id.toString()} product={product} />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </Container>
      </Section>
    </div>
  );
}
