import { useState, useMemo } from 'react';
import { Section, Container, BrandCard } from '../../components/brand/BrandPrimitives';
import { usePageMeta } from '../../hooks/usePageMeta';
import { useGetAllProducts, useCreateProduct, useUpdateProduct, useDeleteProduct, useSeedProducts } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2, Sparkles, Search, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import type { Product, Category, AvailabilityStatus, Price, ProductVariants, WeightVariant, FlavorVariant } from '../../backend';
import PriceDisplay from '../../components/products/PriceDisplay';
import { normalizeAssetUrl } from '../../utils/assets';

export default function AdminProductsPage() {
  usePageMeta('Web Owner Dashboard', 'Add, edit, and manage your honey products.');
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteProductId, setDeleteProductId] = useState<bigint | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<Category | 'all'>('all');
  const [lowStockThreshold, setLowStockThreshold] = useState(10);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'beeProducts' as Category,
    listPrice: '',
    salePrice: '',
    image: '',
    availability: 'inStock' as AvailabilityStatus,
    stock: '',
    weightVariants: [] as Array<{ weight: string; description: string; listPrice: string; salePrice: string }>,
    flavorVariants: [] as Array<{ flavor: string; description: string; weight: string; listPrice: string; salePrice: string }>,
    variantType: 'none' as 'none' | 'weight' | 'flavor',
  });

  const productsQuery = useGetAllProducts();
  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const deleteMutation = useDeleteProduct();
  const seedMutation = useSeedProducts();

  const products = productsQuery.data || [];

  // Filter and search products
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, categoryFilter]);

  const handleOpenDialog = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      
      let variantType: 'none' | 'weight' | 'flavor' = 'none';
      let weightVariants: Array<{ weight: string; description: string; listPrice: string; salePrice: string }> = [];
      let flavorVariants: Array<{ flavor: string; description: string; weight: string; listPrice: string; salePrice: string }> = [];
      
      if (product.variants) {
        if (product.variants.__kind__ === 'weight') {
          variantType = 'weight';
          weightVariants = product.variants.weight.map(v => ({
            weight: v.weight.toString(),
            description: v.description,
            listPrice: v.price.listPrice.toString(),
            salePrice: v.price.salePrice?.toString() || '',
          }));
        } else if (product.variants.__kind__ === 'flavor') {
          variantType = 'flavor';
          flavorVariants = product.variants.flavor.map(v => ({
            flavor: v.flavor,
            description: v.description,
            weight: v.weight.toString(),
            listPrice: v.price.listPrice.toString(),
            salePrice: v.price.salePrice?.toString() || '',
          }));
        }
      }
      
      setFormData({
        name: product.name,
        description: product.description,
        category: product.category,
        listPrice: product.price.listPrice.toString(),
        salePrice: product.price.salePrice?.toString() || '',
        image: product.image,
        availability: product.availability,
        stock: product.stock.toString(),
        weightVariants,
        flavorVariants,
        variantType,
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        description: '',
        category: 'beeProducts' as Category,
        listPrice: '',
        salePrice: '',
        image: '',
        availability: 'inStock' as AvailabilityStatus,
        stock: '',
        weightVariants: [],
        flavorVariants: [],
        variantType: 'none',
      });
    }
    setIsDialogOpen(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'image/jpeg') {
      toast.error('Only JPEG images are allowed');
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setFormData({ ...formData, image: base64String });
    };
    reader.readAsDataURL(file);
  };

  const addWeightVariant = () => {
    setFormData({
      ...formData,
      weightVariants: [...formData.weightVariants, { weight: '', description: '', listPrice: '', salePrice: '' }],
    });
  };

  const removeWeightVariant = (index: number) => {
    setFormData({
      ...formData,
      weightVariants: formData.weightVariants.filter((_, i) => i !== index),
    });
  };

  const updateWeightVariant = (index: number, field: string, value: string) => {
    const updated = [...formData.weightVariants];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, weightVariants: updated });
  };

  const addFlavorVariant = () => {
    setFormData({
      ...formData,
      flavorVariants: [...formData.flavorVariants, { flavor: '', description: '', weight: '', listPrice: '', salePrice: '' }],
    });
  };

  const removeFlavorVariant = (index: number) => {
    setFormData({
      ...formData,
      flavorVariants: formData.flavorVariants.filter((_, i) => i !== index),
    });
  };

  const updateFlavorVariant = (index: number, field: string, value: string) => {
    const updated = [...formData.flavorVariants];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, flavorVariants: updated });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Product name is required');
      return;
    }

    if (!formData.image) {
      toast.error('Product image is required');
      return;
    }

    const stock = parseInt(formData.stock);
    if (isNaN(stock) || stock < 0) {
      toast.error('Please enter a valid stock quantity');
      return;
    }

    const listPrice = parseFloat(formData.listPrice);
    if (isNaN(listPrice) || listPrice < 0) {
      toast.error('Please enter a valid list price');
      return;
    }

    const salePrice = formData.salePrice ? parseFloat(formData.salePrice) : undefined;
    if (salePrice !== undefined && (isNaN(salePrice) || salePrice < 0 || salePrice >= listPrice)) {
      toast.error('Sale price must be less than list price');
      return;
    }

    const price: Price = {
      listPrice,
      salePrice,
    };

    let variants: ProductVariants | null = null;

    if (formData.variantType === 'weight' && formData.weightVariants.length > 0) {
      const weightVariants: WeightVariant[] = [];
      for (const v of formData.weightVariants) {
        const weight = parseInt(v.weight);
        const vListPrice = parseFloat(v.listPrice);
        const vSalePrice = v.salePrice ? parseFloat(v.salePrice) : undefined;

        if (isNaN(weight) || weight <= 0) {
          toast.error('All weight variants must have a valid weight');
          return;
        }
        if (isNaN(vListPrice) || vListPrice < 0) {
          toast.error('All weight variants must have a valid list price');
          return;
        }
        if (vSalePrice !== undefined && (isNaN(vSalePrice) || vSalePrice < 0 || vSalePrice >= vListPrice)) {
          toast.error('Variant sale price must be less than list price');
          return;
        }

        weightVariants.push({
          weight: BigInt(weight),
          description: v.description,
          price: { listPrice: vListPrice, salePrice: vSalePrice },
        });
      }
      variants = { __kind__: 'weight', weight: weightVariants };
    } else if (formData.variantType === 'flavor' && formData.flavorVariants.length > 0) {
      const flavorVariants: FlavorVariant[] = [];
      for (const v of formData.flavorVariants) {
        const weight = parseInt(v.weight);
        const vListPrice = parseFloat(v.listPrice);
        const vSalePrice = v.salePrice ? parseFloat(v.salePrice) : undefined;

        if (!v.flavor.trim()) {
          toast.error('All flavor variants must have a flavor name');
          return;
        }
        if (isNaN(weight) || weight <= 0) {
          toast.error('All flavor variants must have a valid weight');
          return;
        }
        if (isNaN(vListPrice) || vListPrice < 0) {
          toast.error('All flavor variants must have a valid list price');
          return;
        }
        if (vSalePrice !== undefined && (isNaN(vSalePrice) || vSalePrice < 0 || vSalePrice >= vListPrice)) {
          toast.error('Variant sale price must be less than list price');
          return;
        }

        flavorVariants.push({
          flavor: v.flavor,
          description: v.description,
          weight: BigInt(weight),
          price: { listPrice: vListPrice, salePrice: vSalePrice },
        });
      }
      variants = { __kind__: 'flavor', flavor: flavorVariants };
    }

    try {
      if (editingProduct) {
        await updateMutation.mutateAsync({
          id: editingProduct.id,
          name: formData.name,
          description: formData.description,
          category: formData.category,
          price,
          image: formData.image,
          availability: formData.availability,
          variants,
          stock: BigInt(stock),
        });
        toast.success('Product updated successfully');
      } else {
        await createMutation.mutateAsync({
          name: formData.name,
          description: formData.description,
          category: formData.category,
          price,
          image: formData.image,
          availability: formData.availability,
          variants,
          stock: BigInt(stock),
        });
        toast.success('Product created successfully');
      }
      setIsDialogOpen(false);
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to save product';
      toast.error(errorMessage);
      console.error(error);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteProductId) return;

    try {
      await deleteMutation.mutateAsync(deleteProductId);
      toast.success('Product deleted successfully');
      setDeleteProductId(null);
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to delete product';
      toast.error(errorMessage);
      console.error(error);
    }
  };

  const handleSeedProducts = async () => {
    try {
      const result = await seedMutation.mutateAsync();
      
      if (result.__kind__ === 'seeded') {
        toast.success(`Products seeded successfully! Added ${result.seeded.count} products.`);
      } else if (result.__kind__ === 'alreadySeeded') {
        toast.info('Products already exist, no seeding needed.');
      }
    } catch (error: any) {
      toast.error('Failed to seed products');
      console.error(error);
    }
  };

  const getCategoryLabel = (category: Category): string => {
    const labels: Record<Category, string> = {
      beeProducts: 'Bee Products',
      naturalHoney: 'Natural Honey',
      rawHoney: 'Raw Honey',
    };
    return labels[category];
  };

  const isLowStock = (stock: bigint): boolean => {
    return Number(stock) <= lowStockThreshold;
  };

  return (
    <div>
      <Section className="bg-muted/30 py-12">
        <Container>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-serif font-bold mb-2">
                Manage Products
              </h1>
              <p className="text-muted-foreground">
                Add, edit, and manage your honey products.
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleSeedProducts}
                variant="outline"
                disabled={seedMutation.isPending}
                className="border-primary text-primary hover:bg-primary/10"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                {seedMutation.isPending ? 'Seeding...' : 'Seed Products'}
              </Button>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => handleOpenDialog()} className="bg-primary hover:bg-primary/90">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="font-serif text-2xl">
                      {editingProduct ? 'Edit Product' : 'Add New Product'}
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="name">Product Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label htmlFor="category">Category *</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) => setFormData({ ...formData, category: value as Category })}
                      >
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beeProducts">Bee Products</SelectItem>
                          <SelectItem value="naturalHoney">Natural Honey</SelectItem>
                          <SelectItem value="rawHoney">Raw Honey</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="image">Upload Image (JPEG only) *</Label>
                      <Input
                        id="image"
                        type="file"
                        accept="image/jpeg"
                        onChange={handleImageChange}
                        className="mt-2"
                      />
                      {formData.image && (
                        <div className="mt-2">
                          <img src={formData.image} alt="Preview" className="h-24 w-24 object-cover rounded" />
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="listPrice">Price (₹) *</Label>
                        <Input
                          id="listPrice"
                          type="number"
                          step="0.01"
                          min="0"
                          value={formData.listPrice}
                          onChange={(e) => setFormData({ ...formData, listPrice: e.target.value })}
                          required
                          className="mt-2"
                          placeholder="0.00"
                        />
                      </div>
                      <div>
                        <Label htmlFor="salePrice">Discount Price (₹)</Label>
                        <Input
                          id="salePrice"
                          type="number"
                          step="0.01"
                          min="0"
                          value={formData.salePrice}
                          onChange={(e) => setFormData({ ...formData, salePrice: e.target.value })}
                          className="mt-2"
                          placeholder="Optional"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="stock">Stock Quantity *</Label>
                      <Input
                        id="stock"
                        type="number"
                        min="0"
                        value={formData.stock}
                        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                        required
                        className="mt-2"
                        placeholder="0"
                      />
                    </div>

                    <div>
                      <Label htmlFor="description">Description *</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        required
                        className="mt-2"
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label>Variant Options (Optional)</Label>
                      <Select
                        value={formData.variantType}
                        onValueChange={(value) => setFormData({ ...formData, variantType: value as 'none' | 'weight' | 'flavor' })}
                      >
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">No Variants</SelectItem>
                          <SelectItem value="weight">Weight Variants (250g, 500g, 1000g)</SelectItem>
                          <SelectItem value="flavor">Type Variants (MULTIFLORA, Raw & Unprocessed, etc.)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {formData.variantType === 'weight' && (
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <Label>Weight Variants</Label>
                          <Button type="button" size="sm" onClick={addWeightVariant}>
                            <Plus className="h-4 w-4 mr-1" />
                            Add Weight
                          </Button>
                        </div>
                        {formData.weightVariants.map((variant, index) => (
                          <div key={index} className="border p-3 rounded space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium">Variant {index + 1}</span>
                              <Button type="button" size="sm" variant="ghost" onClick={() => removeWeightVariant(index)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <Input
                                placeholder="Weight (g)"
                                type="number"
                                value={variant.weight}
                                onChange={(e) => updateWeightVariant(index, 'weight', e.target.value)}
                              />
                              <Input
                                placeholder="Description"
                                value={variant.description}
                                onChange={(e) => updateWeightVariant(index, 'description', e.target.value)}
                              />
                              <Input
                                placeholder="List Price"
                                type="number"
                                step="0.01"
                                value={variant.listPrice}
                                onChange={(e) => updateWeightVariant(index, 'listPrice', e.target.value)}
                              />
                              <Input
                                placeholder="Sale Price (optional)"
                                type="number"
                                step="0.01"
                                value={variant.salePrice}
                                onChange={(e) => updateWeightVariant(index, 'salePrice', e.target.value)}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {formData.variantType === 'flavor' && (
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <Label>Type Variants</Label>
                          <Button type="button" size="sm" onClick={addFlavorVariant}>
                            <Plus className="h-4 w-4 mr-1" />
                            Add Type
                          </Button>
                        </div>
                        {formData.flavorVariants.map((variant, index) => (
                          <div key={index} className="border p-3 rounded space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium">Variant {index + 1}</span>
                              <Button type="button" size="sm" variant="ghost" onClick={() => removeFlavorVariant(index)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <Input
                                placeholder="Type (e.g., MULTIFLORA)"
                                value={variant.flavor}
                                onChange={(e) => updateFlavorVariant(index, 'flavor', e.target.value)}
                              />
                              <Input
                                placeholder="Weight (g)"
                                type="number"
                                value={variant.weight}
                                onChange={(e) => updateFlavorVariant(index, 'weight', e.target.value)}
                              />
                              <Input
                                placeholder="Description"
                                value={variant.description}
                                onChange={(e) => updateFlavorVariant(index, 'description', e.target.value)}
                                className="col-span-2"
                              />
                              <Input
                                placeholder="List Price"
                                type="number"
                                step="0.01"
                                value={variant.listPrice}
                                onChange={(e) => updateFlavorVariant(index, 'listPrice', e.target.value)}
                              />
                              <Input
                                placeholder="Sale Price (optional)"
                                type="number"
                                step="0.01"
                                value={variant.salePrice}
                                onChange={(e) => updateFlavorVariant(index, 'salePrice', e.target.value)}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <DialogFooter>
                      <Button
                        type="submit"
                        disabled={createMutation.isPending || updateMutation.isPending}
                        className="bg-primary hover:bg-primary/90"
                      >
                        {(createMutation.isPending || updateMutation.isPending) ? 'Saving...' : 'Save Product'}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <BrandCard className="p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Label htmlFor="search" className="sr-only">Search products</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="w-full md:w-48">
                <Label htmlFor="category-filter" className="sr-only">Filter by category</Label>
                <Select value={categoryFilter} onValueChange={(value) => setCategoryFilter(value as Category | 'all')}>
                  <SelectTrigger id="category-filter">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="beeProducts">Bee Products</SelectItem>
                    <SelectItem value="naturalHoney">Natural Honey</SelectItem>
                    <SelectItem value="rawHoney">Raw Honey</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-full md:w-48">
                <Label htmlFor="low-stock-threshold">Low Stock Alert</Label>
                <Input
                  id="low-stock-threshold"
                  type="number"
                  min="0"
                  value={lowStockThreshold}
                  onChange={(e) => setLowStockThreshold(parseInt(e.target.value) || 0)}
                  placeholder="Threshold"
                />
              </div>
            </div>
            <div className="mt-4 text-sm text-muted-foreground">
              Total: <span className="font-semibold">{filteredProducts.length}</span> product{filteredProducts.length !== 1 ? 's' : ''}
            </div>
          </BrandCard>

          {productsQuery.isLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading products...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <BrandCard className="p-12 text-center">
              <p className="text-muted-foreground">No products found. Add your first product to get started.</p>
            </BrandCard>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-20">Image</TableHead>
                    <TableHead>Product Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Discount</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow key={product.id.toString()} className={isLowStock(product.stock) ? 'bg-amber-50 dark:bg-amber-950/20' : ''}>
                      <TableCell>
                        <img
                          src={normalizeAssetUrl(product.image)}
                          alt={product.name}
                          className="h-12 w-12 object-cover rounded"
                        />
                      </TableCell>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{getCategoryLabel(product.category)}</Badge>
                      </TableCell>
                      <TableCell>₹{product.price.listPrice.toFixed(2)}</TableCell>
                      <TableCell>
                        {product.price.salePrice ? (
                          <Badge variant="secondary">₹{product.price.salePrice.toFixed(2)}</Badge>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span>{product.stock.toString()}</span>
                          {isLowStock(product.stock) && (
                            <Badge variant="destructive" className="text-xs">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              Low
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleOpenDialog(product)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setDeleteProductId(product.id)}
                            className="text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </Container>
      </Section>

      <AlertDialog open={deleteProductId !== null} onOpenChange={(open) => !open && setDeleteProductId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this product? This action will soft-delete the product and it will no longer appear in public listings.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={deleteMutation.isPending}
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
