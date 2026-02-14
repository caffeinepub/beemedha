import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { StoreSettings } from '../backend';

// Public read-only hook for customer-facing components to consume store settings
export function useStoreSettings() {
  const { actor, isFetching } = useActor();

  const query = useQuery<StoreSettings>({
    queryKey: ['storeSettings'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getStoreSettings();
    },
    enabled: !!actor && !isFetching,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    settings: query.data,
    isLoading: query.isLoading,
    error: query.error,
  };
}
