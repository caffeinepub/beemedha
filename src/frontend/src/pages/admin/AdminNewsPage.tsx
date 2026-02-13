import { useState } from 'react';
import { Section, Container } from '../../components/brand/BrandPrimitives';
import { usePageMeta } from '../../hooks/usePageMeta';
import { useGetAllProductUpdates, useGetAllProducts, useCreateProductUpdate, useDeleteProductUpdate } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import type { ProductUpdate, ProductUpdateType } from '../../backend';

export default function AdminNewsPage() {
  usePageMeta('Web Owner Dashboard', 'Manage news and product updates.');
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteUpdateId, setDeleteUpdateId] = useState<bigint | null>(null);
  
  const [formData, setFormData] = useState({
    productId: '',
    updateType: 'newHarvest' as ProductUpdateType,
    message: '',
  });

  const updatesQuery = useGetAllProductUpdates();
  const productsQuery = useGetAllProducts();
  const createMutation = useCreateProductUpdate();
  const deleteMutation = useDeleteProductUpdate();

  const updates = updatesQuery.data || [];
  const products = productsQuery.data || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.productId) {
      toast.error('Please select a product');
      return;
    }

    if (!formData.message.trim()) {
      toast.error('Please enter a message');
      return;
    }

    try {
      await createMutation.mutateAsync({
        productUpdateType: formData.updateType,
        productId: BigInt(formData.productId),
        message: formData.message,
      });
      toast.success('News update created successfully');
      setIsDialogOpen(false);
      setFormData({
        productId: '',
        updateType: 'newHarvest' as ProductUpdateType,
        message: '',
      });
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to create news update';
      toast.error(errorMessage);
      console.error(error);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteUpdateId) return;

    try {
      await deleteMutation.mutateAsync(deleteUpdateId);
      toast.success('News update deleted successfully');
      setDeleteUpdateId(null);
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to delete news update';
      toast.error(errorMessage);
      console.error(error);
    }
  };

  const getUpdateTypeLabel = (type: ProductUpdateType): string => {
    const labels: Record<ProductUpdateType, string> = {
      newHarvest: 'New Harvest',
      seasonalAvailability: 'Seasonal Availability',
      priceUpdate: 'Price Update',
      limitedTimeOffer: 'Limited Time Offer',
    };
    return labels[type];
  };

  const getUpdateTypeBadgeVariant = (type: ProductUpdateType) => {
    const variants: Record<ProductUpdateType, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      newHarvest: 'default',
      seasonalAvailability: 'secondary',
      priceUpdate: 'outline',
      limitedTimeOffer: 'destructive',
    };
    return variants[type];
  };

  const getProductName = (productId: bigint): string => {
    const product = products.find(p => p.id === productId);
    return product?.name || 'Unknown Product';
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
                Create and manage product updates and announcements.
              </p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90">
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
                    <Label htmlFor="product">Product *</Label>
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
                  </div>

                  <div>
                    <Label htmlFor="updateType">Update Type *</Label>
                    <Select
                      value={formData.updateType}
                      onValueChange={(value) => setFormData({ ...formData, updateType: value as ProductUpdateType })}
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
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                      className="mt-2"
                      rows={4}
                      placeholder="Enter your news update message..."
                    />
                  </div>

                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={createMutation.isPending}
                      className="bg-primary hover:bg-primary/90"
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

      <Section className="py-12">
        <Container>
          {updatesQuery.isLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading news updates...</p>
            </div>
          ) : updates.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No news updates yet</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {updates.map((update) => (
                <Card key={update.id.toString()}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <Badge variant={getUpdateTypeBadgeVariant(update.productUpdateType)}>
                        {getUpdateTypeLabel(update.productUpdateType)}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteUpdateId(update.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <CardTitle className="font-serif text-xl mt-2">
                      {getProductName(update.productId)}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <Calendar className="h-3 w-3" />
                      {new Date(Number(update.timestamp) / 1_000_000).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{update.message}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </Container>
      </Section>

      <AlertDialog open={deleteUpdateId !== null} onOpenChange={() => setDeleteUpdateId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the news update.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
