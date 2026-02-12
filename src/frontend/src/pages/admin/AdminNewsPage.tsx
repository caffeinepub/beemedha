import { useState } from 'react';
import { Section, Container, BrandCard } from '../../components/brand/BrandPrimitives';
import { usePageMeta } from '../../hooks/usePageMeta';
import { useGetAllProductUpdates, useGetAllProducts, useCreateProductUpdate, useDeleteProductUpdate } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import type { ProductUpdateType } from '../../backend';

export default function AdminNewsPage() {
  usePageMeta('Manage News', 'Create and manage news updates and announcements.');
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    productUpdateType: 'newHarvest' as ProductUpdateType,
    productId: '',
    message: '',
  });

  const updatesQuery = useGetAllProductUpdates();
  const productsQuery = useGetAllProducts();
  const createMutation = useCreateProductUpdate();
  const deleteMutation = useDeleteProductUpdate();

  const updates = updatesQuery.data || [];
  const products = productsQuery.data || [];

  // Sort by timestamp descending
  const sortedUpdates = [...updates].sort((a, b) => 
    Number(b.timestamp) - Number(a.timestamp)
  );

  const handleOpenDialog = () => {
    setFormData({
      productUpdateType: 'newHarvest' as ProductUpdateType,
      productId: products.length > 0 ? products[0].id.toString() : '',
      message: '',
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.productId) {
      toast.error('Please select a product');
      return;
    }

    try {
      await createMutation.mutateAsync({
        productUpdateType: formData.productUpdateType,
        productId: BigInt(formData.productId),
        message: formData.message,
      });
      toast.success('News update created successfully');
      setIsDialogOpen(false);
    } catch (error) {
      toast.error('Failed to create news update');
      console.error(error);
    }
  };

  const handleDelete = async (id: bigint) => {
    if (!confirm('Are you sure you want to delete this news update?')) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(id);
      toast.success('News update deleted successfully');
    } catch (error) {
      toast.error('Failed to delete news update');
      console.error(error);
    }
  };

  const getUpdateTypeBadge = (type: ProductUpdateType) => {
    const typeMap: Record<ProductUpdateType, { label: string; variant: 'default' | 'secondary' | 'outline' }> = {
      newHarvest: { label: 'New Harvest', variant: 'default' },
      seasonalAvailability: { label: 'Seasonal', variant: 'secondary' },
      priceUpdate: { label: 'Price Update', variant: 'outline' },
      limitedTimeOffer: { label: 'Limited Offer', variant: 'default' },
    };
    const config = typeMap[type];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div>
      <Section className="bg-muted/30 py-12">
        <Container>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-serif font-bold mb-2">
                Manage News
              </h1>
              <p className="text-muted-foreground">
                Create and manage news updates and announcements.
              </p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={handleOpenDialog} className="bg-primary hover:bg-primary/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Add News Update
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="font-serif text-2xl">
                    Create News Update
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="updateType">Update Type *</Label>
                    <Select
                      value={formData.productUpdateType}
                      onValueChange={(value) => setFormData({ ...formData, productUpdateType: value as ProductUpdateType })}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="newHarvest">New Harvest</SelectItem>
                        <SelectItem value="seasonalAvailability">Seasonal Availability</SelectItem>
                        <SelectItem value="priceUpdate">Price Update</SelectItem>
                        <SelectItem value="limitedTimeOffer">Limited Time Offer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="product">Related Product *</Label>
                    <Select
                      value={formData.productId}
                      onValueChange={(value) => setFormData({ ...formData, productId: value })}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select a product" />
                      </SelectTrigger>
                      <SelectContent>
                        {products.map((product) => (
                          <SelectItem key={product.id.toString()} value={product.id.toString()}>
                            {product.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {products.length === 0 && (
                      <p className="text-xs text-muted-foreground mt-1">
                        No products available. Please create a product first.
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                      className="mt-2 min-h-[150px]"
                      placeholder="Enter your news update message..."
                    />
                  </div>

                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="bg-primary hover:bg-primary/90"
                      disabled={createMutation.isPending || products.length === 0}
                    >
                      {createMutation.isPending ? 'Creating...' : 'Create Update'}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          {updatesQuery.isLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading news updates...</p>
            </div>
          ) : sortedUpdates.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No news updates yet. Create your first update!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {sortedUpdates.map((update) => {
                const product = products.find(p => p.id === update.productId);
                const date = new Date(Number(update.timestamp) / 1000000);
                
                return (
                  <BrandCard key={update.id.toString()} className="p-6">
                    <div className="flex flex-col sm:flex-row justify-between gap-4">
                      <div className="flex-1 space-y-3">
                        <div className="flex flex-wrap items-center gap-3">
                          {getUpdateTypeBadge(update.productUpdateType)}
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4 mr-1" />
                            {date.toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </div>
                        </div>
                        <p className="text-foreground whitespace-pre-wrap">{update.message}</p>
                        {product && (
                          <p className="text-sm text-muted-foreground">
                            Related to: <span className="font-medium">{product.name}</span>
                          </p>
                        )}
                      </div>
                      <div className="flex sm:flex-col gap-2">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(update.id)}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4 sm:mr-0 mr-1" />
                          <span className="sm:hidden">Delete</span>
                        </Button>
                      </div>
                    </div>
                  </BrandCard>
                );
              })}
            </div>
          )}
        </Container>
      </Section>
    </div>
  );
}
