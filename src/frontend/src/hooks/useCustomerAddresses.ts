import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useCustomerSession } from './useCustomerSession';
import type { DeliveryAddress } from '../backend';

export function useCustomerAddresses() {
  const { actor } = useActor();
  const { session } = useCustomerSession();
  const queryClient = useQueryClient();

  const addressesQuery = useQuery<DeliveryAddress[]>({
    queryKey: ['customerAddresses', session?.sessionId],
    queryFn: async () => {
      if (!actor || !session) return [];
      return actor.getCustomerAddresses(session.sessionId);
    },
    enabled: !!actor && !!session,
  });

  const saveAddressMutation = useMutation({
    mutationFn: async (address: DeliveryAddress) => {
      if (!actor || !session) throw new Error('Not authenticated');
      return actor.saveCustomerAddress(session.sessionId, address);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customerAddresses'] });
    },
  });

  const deleteAddressMutation = useMutation({
    mutationFn: async (index: number) => {
      if (!actor || !session) throw new Error('Not authenticated');
      return actor.deleteCustomerAddress(session.sessionId, BigInt(index));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customerAddresses'] });
    },
  });

  return {
    addresses: addressesQuery.data ?? [],
    isLoading: addressesQuery.isLoading,
    saveAddress: saveAddressMutation.mutateAsync,
    isSaving: saveAddressMutation.isPending,
    deleteAddress: deleteAddressMutation.mutateAsync,
    isDeleting: deleteAddressMutation.isPending,
  };
}
