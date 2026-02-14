import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useCustomerSession } from './useCustomerSession';
import { useLiveUpdateConfig } from './useLiveUpdateConfig';
import type { OrderType } from '../backend';

export function useCustomerOrders() {
  const { actor, isFetching } = useActor();
  const { session, isAuthenticated } = useCustomerSession();
  const liveUpdateConfig = useLiveUpdateConfig();

  const query = useQuery<OrderType[]>({
    queryKey: ['customerOrders', session?.sessionId],
    queryFn: async () => {
      if (!actor || !session) return [];
      return actor.getCustomerOrders(session.sessionId);
    },
    enabled: !!actor && !isFetching && isAuthenticated && !!session,
    ...liveUpdateConfig,
  });

  return {
    orders: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
  };
}
