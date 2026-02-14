import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useGetAllProducts } from './useQueries';
import { createExternalBlobFromFile } from '../utils/externalBlob';
import { Category, AvailabilityStatus, Price, ProductVariants, CreateProductPayload, UpdateProductPayload } from '../backend';

export function useAdminProducts() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { data: products = [], isLoading } = useGetAllProducts();

  const createMutation = useMutation({
    mutationFn: async (data: {
      name: string;
      description: string;
      category: Category;
      price: Price;
      stock: bigint;
      availability: AvailabilityStatus;
      variants?: ProductVariants | null;
      imageFile?: File | null;
    }) => {
      if (!actor) throw new Error('Actor not available');

      let imagePath = '/assets/honey.jpeg'; // Default fallback

      // Upload image if provided
      if (data.imageFile) {
        const { directURL } = await createExternalBlobFromFile(
          data.imageFile,
          (percentage) => {
            console.log(`Image upload: ${percentage}%`);
          }
        );
        imagePath = directURL;
      }

      const payload: CreateProductPayload = {
        name: data.name,
        description: data.description,
        category: data.category,
        price: data.price,
        image: imagePath,
        availability: data.availability,
        variants: data.variants || undefined,
        stock: data.stock,
      };

      const result = await actor.createProduct(payload);
      
      if (result.__kind__ === 'error') {
        throw new Error(result.error);
      }
      
      return result.success;
    },
    onSuccess: () => {
      // Invalidate all product-related queries
      queryClient.invalidateQueries({ queryKey: ['products'], exact: false });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: {
      id: bigint;
      name: string;
      description: string;
      category: Category;
      price: Price;
      stock: bigint;
      availability: AvailabilityStatus;
      variants?: ProductVariants | null;
      imageFile?: File | null;
      currentImage?: string;
    }) => {
      if (!actor) throw new Error('Actor not available');

      let imagePath = data.currentImage || '/assets/honey.jpeg';

      // Upload new image if provided
      if (data.imageFile) {
        const { directURL } = await createExternalBlobFromFile(
          data.imageFile,
          (percentage) => {
            console.log(`Image upload: ${percentage}%`);
          }
        );
        imagePath = directURL;
      }

      const payload: UpdateProductPayload = {
        id: data.id,
        name: data.name,
        description: data.description,
        category: data.category,
        price: data.price,
        image: imagePath,
        availability: data.availability,
        variants: data.variants || undefined,
        stock: data.stock,
      };

      const result = await actor.updateProduct(payload);
      
      if (result.__kind__ === 'error') {
        throw new Error(result.error);
      }
      
      return result.success;
    },
    onSuccess: () => {
      // Invalidate all product-related queries (including category-specific ones)
      queryClient.invalidateQueries({ queryKey: ['products'], exact: false });
      queryClient.invalidateQueries({ queryKey: ['product'], exact: false });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      const result = await actor.deleteProduct(id);
      
      if (result.__kind__ === 'error') {
        throw new Error(result.error);
      }
      
      return result.success;
    },
    onSuccess: () => {
      // Invalidate all product-related queries
      queryClient.invalidateQueries({ queryKey: ['products'], exact: false });
      queryClient.invalidateQueries({ queryKey: ['product'], exact: false });
    },
  });

  return {
    products,
    isLoading,
    createProduct: createMutation.mutateAsync,
    updateProduct: updateMutation.mutateAsync,
    deleteProduct: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
