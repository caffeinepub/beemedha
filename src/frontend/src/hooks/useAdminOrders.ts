import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useLiveUpdateConfig } from './useLiveUpdateConfig';
import type { OrderType, OrderStatus } from '../backend';

export function useAdminOrders() {
  const { actor, isFetching } = useActor();
  const queryClient = useQueryClient();
  const liveUpdateConfig = useLiveUpdateConfig();

  const ordersQuery = useQuery<OrderType[]>({
    queryKey: ['adminOrders'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllOrders();
    },
    enabled: !!actor && !isFetching,
    ...liveUpdateConfig,
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: bigint; status: OrderStatus }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateOrderStatus(orderId, status);
    },
    onSuccess: () => {
      // Invalidate both admin and customer order queries (non-exact to catch all variations)
      queryClient.invalidateQueries({ queryKey: ['adminOrders'], exact: false });
      queryClient.invalidateQueries({ queryKey: ['customerOrders'], exact: false });
      queryClient.invalidateQueries({ queryKey: ['orders'], exact: false });
    },
  });

  return {
    orders: ordersQuery.data || [],
    isLoading: ordersQuery.isLoading,
    updateOrderStatus: updateStatusMutation.mutateAsync,
    isUpdating: updateStatusMutation.isPending,
  };
}
