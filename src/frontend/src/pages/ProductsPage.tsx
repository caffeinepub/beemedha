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
  const rawForestQuery = useGetProductsByCategory('rawForest' as Category);
  const organicWildQuery = useGetProductsByCategory('organicWild' as Category);
  const herbalInfusedQuery = useGetProductsByCategory('herbalInfused' as Category);
  const honeyCombQuery = useGetProductsByCategory('honeyComb' as Category);

  const getCurrentQuery = () => {
    switch (selectedCategory) {
      case 'rawForest':
        return rawForestQuery;
      case 'organicWild':
        return organicWildQuery;
      case 'herbalInfused':
        return herbalInfusedQuery;
      case 'honeyComb':
        return honeyCombQuery;
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
              Discover our premium collection of pure, natural honey varieties.
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
              <TabsList className="grid grid-cols-2 sm:grid-cols-5 w-full sm:w-auto">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="rawForest">Raw Forest</TabsTrigger>
                <TabsTrigger value="organicWild">Organic Wild</TabsTrigger>
                <TabsTrigger value="herbalInfused">Herbal Infused</TabsTrigger>
                <TabsTrigger value="honeyComb">Honey Comb</TabsTrigger>
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

            <TabsContent value="rawForest" className="mt-0">
              {currentQuery.isLoading ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Loading products...</p>
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No raw forest honey products available yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product.id.toString()} product={product} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="organicWild" className="mt-0">
              {currentQuery.isLoading ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Loading products...</p>
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No organic wild honey products available yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product.id.toString()} product={product} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="herbalInfused" className="mt-0">
              {currentQuery.isLoading ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Loading products...</p>
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No herbal infused honey products available yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product.id.toString()} product={product} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="honeyComb" className="mt-0">
              {currentQuery.isLoading ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Loading products...</p>
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No honey comb products available yet.</p>
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
