import { useMemo } from 'react';
import { useGetAllProducts } from './useQueries';
import { useAdminOrders } from './useAdminOrders';
import { useAdminCustomers } from './useAdminCustomers';

const LOW_STOCK_THRESHOLD = 5;

export function useAdminDashboardData() {
  const { data: products = [], isLoading: productsLoading } = useGetAllProducts();
  const { orders, isLoading: ordersLoading } = useAdminOrders();
  const { customers, isLoading: customersLoading } = useAdminCustomers();

  const activeProducts = useMemo(() => products.filter(p => !p.isDeleted), [products]);

  const lowStockProducts = useMemo(
    () => activeProducts.filter(p => Number(p.stock) <= LOW_STOCK_THRESHOLD),
    [activeProducts]
  );

  const recentOrders = useMemo(
    () => [...orders].sort((a, b) => Number(b.createdAt) - Number(a.createdAt)).slice(0, 5),
    [orders]
  );

  return {
    totalProducts: activeProducts.length,
    totalOrders: orders.length,
    totalCustomers: customers.length,
    lowStockProducts,
    recentOrders,
    isLoading: productsLoading || ordersLoading || customersLoading,
  };
}
