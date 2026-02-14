import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import { useAdminSession } from './useAdminSession';
import { useCustomerSession } from './useCustomerSession';
import type { Product, ProductUpdate, ContactFormSubmission, Category, ProductUpdateType, AvailabilityStatus, UserProfile, Price, SeedProductsResult, ProductVariants, Logo, SiteSettings, DeliveryAddress, OrderType, OrderItem, OrderStatus } from '../backend';
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
  const { sessionId } = useAdminSession();
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
      if (!sessionId) throw new Error('Admin session required');
      return actor.createProduct(
        sessionId,
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
  const { sessionId } = useAdminSession();
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
      if (!sessionId) throw new Error('Admin session required');
      return actor.updateProduct(
        sessionId,
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
  const { sessionId } = useAdminSession();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      if (!sessionId) throw new Error('Admin session required');
      return actor.deleteProduct(sessionId, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useSeedProducts() {
  const { actor } = useActor();
  const { sessionId } = useAdminSession();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      if (!sessionId) throw new Error('Admin session required');
      return actor.seedProducts(sessionId);
    },
    onSuccess: async () => {
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
  const { sessionId } = useAdminSession();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      productUpdateType: ProductUpdateType;
      productId: bigint;
      message: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      if (!sessionId) throw new Error('Admin session required');
      return actor.createProductUpdate(
        sessionId,
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
  const { sessionId } = useAdminSession();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      if (!sessionId) throw new Error('Admin session required');
      return actor.deleteProductUpdate(sessionId, id);
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
  const { sessionId } = useAdminSession();

  return useQuery<ContactFormSubmission[]>({
    queryKey: ['contactSubmissions'],
    queryFn: async () => {
      if (!actor || !sessionId) return [];
      return actor.getContactFormSubmissions(sessionId);
    },
    enabled: !!actor && !isFetching && !!sessionId,
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

// Admin Management
export function useIsCallerAdmin() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  const query = useQuery<boolean>({
    queryKey: ['isAdmin', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !actorFetching && !!identity,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
  };
}

export function useAddAdmin() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newAdmin: Principal) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addAdmin(newAdmin);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['isAdmin'] });
    },
  });
}

export function useRemoveAdmin() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (adminToRemove: Principal) => {
      if (!actor) throw new Error('Actor not available');
      return actor.removeAdmin(adminToRemove);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['isAdmin'] });
    },
  });
}

// Logo Management
export function useGetLogo() {
  const { actor, isFetching } = useActor();
  const { refetchInterval, refetchOnWindowFocus } = useLiveUpdateConfig();

  return useQuery<Logo | null>({
    queryKey: ['logo'],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getLogo();
    },
    enabled: !!actor && !isFetching,
    refetchInterval,
    refetchOnWindowFocus,
  });
}

export function useUpdateLogo() {
  const { actor } = useActor();
  const { sessionId } = useAdminSession();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { mimeType: string; data: Uint8Array }) => {
      if (!actor) throw new Error('Actor not available');
      if (!sessionId) throw new Error('Admin session required');
      return actor.updateLogo(sessionId, data.mimeType, data.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['logo'] });
    },
  });
}

// Site Settings
export function useGetSiteSettings() {
  const { actor, isFetching } = useActor();
  const { refetchInterval, refetchOnWindowFocus } = useLiveUpdateConfig();

  return useQuery<SiteSettings>({
    queryKey: ['siteSettings'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getSiteSettings();
    },
    enabled: !!actor && !isFetching,
    refetchInterval,
    refetchOnWindowFocus,
  });
}

export function useUpdateSiteSettings() {
  const { actor } = useActor();
  const { sessionId } = useAdminSession();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (settings: SiteSettings) => {
      if (!actor) throw new Error('Actor not available');
      if (!sessionId) throw new Error('Admin session required');
      return actor.updateSiteSettings(sessionId, settings);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['siteSettings'] });
    },
  });
}

// Delivery Address
export function useGetDeliveryAddress() {
  const { actor, isFetching } = useActor();
  const { sessionId } = useCustomerSession();

  return useQuery<DeliveryAddress | null>({
    queryKey: ['deliveryAddress', sessionId],
    queryFn: async () => {
      if (!actor || !sessionId) return null;
      return actor.getDeliveryAddress(sessionId);
    },
    enabled: !!actor && !isFetching && !!sessionId,
  });
}

export function useSaveDeliveryAddress() {
  const { actor } = useActor();
  const { sessionId } = useCustomerSession();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (address: DeliveryAddress) => {
      if (!actor) throw new Error('Actor not available');
      if (!sessionId) throw new Error('Customer session required');
      return actor.saveDeliveryAddress(sessionId, address);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deliveryAddress'] });
    },
  });
}

// Orders
export function useCreateOrder() {
  const { actor } = useActor();
  const { sessionId } = useCustomerSession();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      items: OrderItem[];
      totalPrice: number;
      address: DeliveryAddress;
    }) => {
      if (!actor) throw new Error('Actor not available');
      if (!sessionId) throw new Error('Customer session required');
      return actor.createOrder(sessionId, data.items, data.totalPrice, data.address);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customerOrders'] });
      queryClient.invalidateQueries({ queryKey: ['allOrders'] });
    },
  });
}

export function useGetCustomerOrders() {
  const { actor, isFetching } = useActor();
  const { sessionId } = useCustomerSession();

  return useQuery<OrderType[]>({
    queryKey: ['customerOrders', sessionId],
    queryFn: async () => {
      if (!actor || !sessionId) return [];
      return actor.getCustomerOrders(sessionId);
    },
    enabled: !!actor && !isFetching && !!sessionId,
  });
}

export function useGetAllOrders() {
  const { actor, isFetching } = useActor();
  const { sessionId } = useAdminSession();

  return useQuery<OrderType[]>({
    queryKey: ['allOrders'],
    queryFn: async () => {
      if (!actor || !sessionId) return [];
      return actor.getAllOrders(sessionId);
    },
    enabled: !!actor && !isFetching && !!sessionId,
  });
}

export function useUpdateOrderStatus() {
  const { actor } = useActor();
  const { sessionId } = useAdminSession();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { orderId: bigint; newStatus: OrderStatus }) => {
      if (!actor) throw new Error('Actor not available');
      if (!sessionId) throw new Error('Admin session required');
      return actor.updateOrderStatus(sessionId, data.orderId, data.newStatus);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allOrders'] });
      queryClient.invalidateQueries({ queryKey: ['customerOrders'] });
    },
  });
}
