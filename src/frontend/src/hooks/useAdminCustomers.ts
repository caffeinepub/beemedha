import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useAdminOrdersList } from './useQueries';

interface Customer {
  name: string;
  identifier: string;
  orderCount: number;
  totalSpent: number;
}

export function useAdminCustomers() {
  const { actor, isFetching } = useActor();
  const { data: orders = [] } = useAdminOrdersList();

  const customers = useMemo(() => {
    const customerMap = new Map<string, Customer>();

    orders.forEach((order) => {
      const identifier =
        order.customerIdentifier.__kind__ === 'email'
          ? order.customerIdentifier.email
          : order.customerIdentifier.phone;

      const existing = customerMap.get(identifier);
      if (existing) {
        existing.orderCount += 1;
        existing.totalSpent += order.totalPrice;
      } else {
        customerMap.set(identifier, {
          name: order.address.name,
          identifier,
          orderCount: 1,
          totalSpent: order.totalPrice,
        });
      }
    });

    return Array.from(customerMap.values());
  }, [orders]);

  return {
    customers,
    isLoading: false,
  };
}
