import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import type { Product, ProductUpdate, Category, ProductUpdateType, UserProfile, OrderType } from '../backend';
import { useLiveUpdateConfig } from './useLiveUpdateConfig';

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

// Admin Orders List
export function useAdminOrdersList() {
  const { actor, isFetching } = useActor();
  const { refetchInterval, refetchOnWindowFocus } = useLiveUpdateConfig();

  return useQuery<OrderType[]>({
    queryKey: ['adminOrders'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllOrders();
    },
    enabled: !!actor && !isFetching,
    refetchInterval,
    refetchOnWindowFocus,
  });
}
