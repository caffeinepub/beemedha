import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Product, ProductUpdate, ContactFormSubmission, Category, ProductUpdateType, AvailabilityStatus, UserProfile, Price, SeedProductsResult, ProductVariants, Logo } from '../backend';
import { useLiveUpdateConfig } from './useLiveUpdateConfig';
import { Principal } from '@dfinity/principal';

// Products
export function useGetAllProducts() {
  const { actor, isFetching } = useActor();
  const { refetchInterval, refetchOnWindowFocus } = useLiveUpdateConfig();

  return useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllProducts();
    },
    enabled: !!actor && !isFetching,
    refetchInterval,
    refetchOnWindowFocus,
  });
}

export function useGetProductsByCategory(category: Category) {
  const { actor, isFetching } = useActor();
  const { refetchInterval, refetchOnWindowFocus } = useLiveUpdateConfig();

  return useQuery<Product[]>({
    queryKey: ['products', 'category', category],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getProductsByCategory(category);
    },
    enabled: !!actor && !isFetching,
    refetchInterval,
    refetchOnWindowFocus,
  });
}

export function useGetProduct(id: bigint | null) {
  const { actor, isFetching } = useActor();
  const { refetchInterval, refetchOnWindowFocus } = useLiveUpdateConfig();

  return useQuery<Product | null>({
    queryKey: ['product', id?.toString()],
    queryFn: async () => {
      if (!actor || !id) return null;
      return actor.getProduct(id);
    },
    enabled: !!actor && !isFetching && id !== null,
    refetchInterval,
    refetchOnWindowFocus,
  });
}

export function useCreateProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      name: string;
      description: string;
      category: Category;
      price: Price;
      image: string;
      availability: AvailabilityStatus;
      variants: ProductVariants | null;
      stock: bigint;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createProduct(
        data.name,
        data.description,
        data.category,
        data.price,
        data.image,
        data.availability,
        data.variants,
        data.stock
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useUpdateProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      id: bigint;
      name: string;
      description: string;
      category: Category;
      price: Price;
      image: string;
      availability: AvailabilityStatus;
      variants: ProductVariants | null;
      stock: bigint;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateProduct(
        data.id,
        data.name,
        data.description,
        data.category,
        data.price,
        data.image,
        data.availability,
        data.variants,
        data.stock
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product'] });
    },
  });
}

export function useDeleteProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteProduct(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useSeedProducts() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.seedProducts();
    },
    onSuccess: async () => {
      // Invalidate all product-related queries to ensure immediate UI update
      await queryClient.invalidateQueries({ queryKey: ['products'] });
      await queryClient.refetchQueries({ queryKey: ['products'] });
    },
  });
}

// Product Updates (News)
export function useGetAllProductUpdates() {
  const { actor, isFetching } = useActor();
  const { refetchInterval, refetchOnWindowFocus } = useLiveUpdateConfig();

  return useQuery<ProductUpdate[]>({
    queryKey: ['productUpdates'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllProductUpdates();
    },
    enabled: !!actor && !isFetching,
    refetchInterval,
    refetchOnWindowFocus,
  });
}

export function useGetProductUpdatesByType(type: ProductUpdateType) {
  const { actor, isFetching } = useActor();
  const { refetchInterval, refetchOnWindowFocus } = useLiveUpdateConfig();

  return useQuery<ProductUpdate[]>({
    queryKey: ['productUpdates', 'type', type],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getProductUpdatesByType(type);
    },
    enabled: !!actor && !isFetching,
    refetchInterval,
    refetchOnWindowFocus,
  });
}

export function useGetProductUpdatesByProduct(productId: bigint) {
  const { actor, isFetching } = useActor();

  return useQuery<ProductUpdate[]>({
    queryKey: ['productUpdates', 'product', productId.toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getProductUpdatesByProduct(productId);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateProductUpdate() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      productUpdateType: ProductUpdateType;
      productId: bigint;
      message: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createProductUpdate(
        data.productUpdateType,
        data.productId,
        data.message
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productUpdates'] });
    },
  });
}

export function useDeleteProductUpdate() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteProductUpdate(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productUpdates'] });
    },
  });
}

// Contact Form
export function useSubmitContactForm() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (data: {
      name: string;
      email: string;
      message: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.submitContactForm(data.name, data.email, data.message);
    },
  });
}

export function useGetContactFormSubmissions() {
  const { actor, isFetching } = useActor();

  return useQuery<ContactFormSubmission[]>({
    queryKey: ['contactSubmissions'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getContactFormSubmissions();
    },
    enabled: !!actor && !isFetching,
  });
}

// User Profile
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// Admin Check
export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
    retry: false,
  });
}

// Admin Management
export function useListAdmins() {
  const { actor, isFetching } = useActor();

  return useQuery<Principal[]>({
    queryKey: ['admins'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listAdmins();
    },
    enabled: !!actor && !isFetching,
    retry: false,
  });
}

export function useAddAdmin() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (principal: Principal) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addAdmin(principal);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['admins'] });
      await queryClient.refetchQueries({ queryKey: ['admins'] });
    },
  });
}

export function useRemoveAdmin() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (principal: Principal) => {
      if (!actor) throw new Error('Actor not available');
      return actor.removeAdmin(principal);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['admins'] });
      await queryClient.refetchQueries({ queryKey: ['admins'] });
    },
  });
}

// Logo Management
export function useGetLogo() {
  const { actor, isFetching } = useActor();

  return useQuery<Logo | null>({
    queryKey: ['logo'],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getLogo();
    },
    enabled: !!actor && !isFetching,
    retry: false,
  });
}

export function useUpdateLogo() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { mimeType: string; data: Uint8Array }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateLogo(data.mimeType, data.data);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['logo'] });
      await queryClient.refetchQueries({ queryKey: ['logo'] });
    },
  });
}
