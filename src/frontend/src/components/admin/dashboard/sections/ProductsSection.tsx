import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useAdminProducts } from '../../../../hooks/useAdminProducts';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Category, AvailabilityStatus, Product } from '../../../../backend';
import { formatINR } from '../../../../utils/price';
import NeonSurface from '../../../brand/NeonSurface';

export default function ProductsSection() {
  const { products, isLoading, createProduct, updateProduct, deleteProduct, isCreating, isUpdating, isDeleting } = useAdminProducts();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<bigint | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'naturalHoney' as Category,
    listPrice: '',
    salePrice: '',
    stock: '',
    availability: 'inStock' as AvailabilityStatus,
  });

  const [imageFile, setImageFile] = useState<File | null>(null);

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: 'naturalHoney' as Category,
      listPrice: '',
      salePrice: '',
      stock: '',
      availability: 'inStock' as AvailabilityStatus,
    });
    setImageFile(null);
    setEditingProduct(null);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      category: product.category,
      listPrice: product.price.listPrice.toString(),
      salePrice: product.price.salePrice?.toString() || '',
      stock: product.stock.toString(),
      availability: product.availability,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.listPrice || !formData.stock) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!editingProduct && !imageFile) {
      toast.error('Please select a product image');
      return;
    }

    if (imageFile && !imageFile.type.includes('jpeg') && !imageFile.type.includes('jpg')) {
      toast.error('Only JPEG images are allowed');
      return;
    }

    try {
      const productData = {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        price: {
          listPrice: parseFloat(formData.listPrice),
          salePrice: formData.salePrice ? parseFloat(formData.salePrice) : undefined,
        },
        stock: BigInt(formData.stock),
        availability: formData.availability,
        imageFile,
      };

      if (editingProduct) {
        await updateProduct({ 
          id: editingProduct.id, 
          ...productData,
          currentImage: editingProduct.image,
        });
        toast.success('Product updated successfully');
      } else {
        await createProduct(productData);
        toast.success('Product created successfully');
      }

      setIsDialogOpen(false);
      resetForm();
    } catch (error: any) {
      const errorMessage = error?.message || (editingProduct ? 'Failed to update product' : 'Failed to create product');
      toast.error(errorMessage);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirmId) return;

    try {
      await deleteProduct(deleteConfirmId);
      toast.success('Product deleted successfully');
      setDeleteConfirmId(null);
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to delete product';
      toast.error(errorMessage);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  const activeProducts = products.filter(p => !p.isDeleted);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold mb-2 neon-text-glow">Products</h1>
          <p className="neon-text-muted">
            Manage your product catalog
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="neon-button-primary">
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] p-0 border-0 flex flex-col">
            <NeonSurface className="max-h-[90vh] flex flex-col">
              <DialogHeader className="flex-shrink-0 p-6 pb-0">
                <DialogTitle className="font-serif text-xl neon-text-glow">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </DialogTitle>
                <DialogDescription className="text-sm neon-text-muted">
                  {editingProduct ? 'Update product information' : 'Create a new product in your catalog'}
                </DialogDescription>
              </DialogHeader>
              
              <div className="flex-1 overflow-y-auto px-6">
                <form onSubmit={handleSubmit} className="space-y-6 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium neon-text">Product Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="w-full neon-input"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-sm font-medium neon-text">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                      className="w-full neon-input resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category" className="text-sm font-medium neon-text">Category *</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) => setFormData({ ...formData, category: value as Category })}
                      >
                        <SelectTrigger id="category" className="w-full neon-select">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="z-[200]">
                          <SelectItem value="naturalHoney">Natural Honey</SelectItem>
                          <SelectItem value="rawHoney">Raw Honey</SelectItem>
                          <SelectItem value="beeProducts">Bee Products</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="availability" className="text-sm font-medium neon-text">Availability *</Label>
                      <Select
                        value={formData.availability}
                        onValueChange={(value) => setFormData({ ...formData, availability: value as AvailabilityStatus })}
                      >
                        <SelectTrigger id="availability" className="w-full neon-select">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="z-[200]">
                          <SelectItem value="inStock">In Stock</SelectItem>
                          <SelectItem value="limited">Limited</SelectItem>
                          <SelectItem value="outOfStock">Out of Stock</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="listPrice" className="text-sm font-medium neon-text">List Price (₹) *</Label>
                      <Input
                        id="listPrice"
                        type="number"
                        step="0.01"
                        value={formData.listPrice}
                        onChange={(e) => setFormData({ ...formData, listPrice: e.target.value })}
                        required
                        className="w-full neon-input"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="salePrice" className="text-sm font-medium neon-text">Sale Price (₹)</Label>
                      <Input
                        id="salePrice"
                        type="number"
                        step="0.01"
                        value={formData.salePrice}
                        onChange={(e) => setFormData({ ...formData, salePrice: e.target.value })}
                        className="w-full neon-input"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="stock" className="text-sm font-medium neon-text">Stock *</Label>
                      <Input
                        id="stock"
                        type="number"
                        value={formData.stock}
                        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                        required
                        className="w-full neon-input"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="image" className="text-sm font-medium neon-text">
                      Product Image (JPEG only) {!editingProduct && '*'}
                    </Label>
                    <Input
                      id="image"
                      type="file"
                      accept=".jpg,.jpeg,image/jpeg"
                      onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                      required={!editingProduct}
                      className="w-full neon-input file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:neon-file-button"
                    />
                    {imageFile && (
                      <p className="text-sm neon-text-muted truncate max-w-full">
                        Selected: {imageFile.name}
                      </p>
                    )}
                  </div>

                  <DialogFooter className="flex-shrink-0 gap-2 pt-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsDialogOpen(false)} 
                      className="neon-button-outline"
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={isCreating || isUpdating} 
                      className="neon-button-primary"
                    >
                      {(isCreating || isUpdating) ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {editingProduct ? 'Updating...' : 'Creating...'}
                        </>
                      ) : (
                        editingProduct ? 'Update Product' : 'Create Product'
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </div>
            </NeonSurface>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="neon-card-admin">
        <CardHeader>
          <CardTitle className="font-serif neon-text">Product List</CardTitle>
        </CardHeader>
        <CardContent>
          {activeProducts.length === 0 ? (
            <p className="text-center neon-text-muted py-8">
              No products yet. Add your first product to get started.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="neon-table-header">
                  <TableHead className="neon-text">Image</TableHead>
                  <TableHead className="neon-text">Name</TableHead>
                  <TableHead className="neon-text">Category</TableHead>
                  <TableHead className="neon-text">Price</TableHead>
                  <TableHead className="neon-text">Stock</TableHead>
                  <TableHead className="text-right neon-text">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activeProducts.map((product) => (
                  <TableRow key={product.id.toString()} className="neon-table-row">
                    <TableCell>
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-12 w-12 rounded object-cover neon-image-glow"
                      />
                    </TableCell>
                    <TableCell className="font-medium neon-text">{product.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="neon-badge-outline">
                        {product.category === 'naturalHoney' && 'Natural Honey'}
                        {product.category === 'rawHoney' && 'Raw Honey'}
                        {product.category === 'beeProducts' && 'Bee Products'}
                      </Badge>
                    </TableCell>
                    <TableCell className="neon-text">{formatINR(product.price.salePrice || product.price.listPrice)}</TableCell>
                    <TableCell className="neon-text">{product.stock.toString()}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(product)}
                        className="neon-button-ghost"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteConfirmId(product.id)}
                        className="neon-button-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
        <AlertDialogContent className="p-0 border-0">
          <NeonSurface>
            <div className="p-6">
              <AlertDialogHeader>
                <AlertDialogTitle className="neon-text-glow">Are you sure?</AlertDialogTitle>
                <AlertDialogDescription className="neon-text-muted">
                  This will soft-delete the product. It will no longer appear in the customer-facing catalog.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="mt-4">
                <AlertDialogCancel className="neon-button-outline">Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="neon-button-destructive-solid"
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    'Delete'
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </div>
          </NeonSurface>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
