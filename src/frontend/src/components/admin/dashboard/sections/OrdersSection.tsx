import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { useAdminOrders } from '../../../../hooks/useAdminOrders';
import { Eye, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { formatINR } from '../../../../utils/price';
import type { OrderType, OrderStatus } from '../../../../backend';
import NeonSurface from '../../../brand/NeonSurface';

const statusColors: Record<OrderStatus, string> = {
  pending: 'neon-badge-pending',
  inProgress: 'neon-badge-progress',
  transit: 'neon-badge-transit',
  delivered: 'neon-badge-delivered',
};

const statusLabels: Record<OrderStatus, string> = {
  pending: 'Pending',
  inProgress: 'Confirmed',
  transit: 'Shipped',
  delivered: 'Delivered',
};

export default function OrdersSection() {
  const { orders, isLoading, updateOrderStatus, isUpdating } = useAdminOrders();
  const [selectedOrder, setSelectedOrder] = useState<OrderType | null>(null);
  const [updatingOrderId, setUpdatingOrderId] = useState<bigint | null>(null);

  const handleStatusUpdate = async (orderId: bigint, newStatus: OrderStatus) => {
    setUpdatingOrderId(orderId);
    try {
      await updateOrderStatus({ orderId, status: newStatus });
      toast.success('Order status updated');
    } catch (error: any) {
      toast.error(error?.message || 'Failed to update order status');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const getCustomerDisplay = (order: OrderType): string => {
    if (order.customerIdentifier.__kind__ === 'email') {
      return order.customerIdentifier.email;
    } else {
      return order.customerIdentifier.phone;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-bold mb-2 neon-text-glow">Orders</h1>
        <p className="neon-text-muted">
          Manage customer orders and update their status
        </p>
      </div>

      <Card className="neon-card-admin">
        <CardHeader>
          <CardTitle className="font-serif neon-text">Order List</CardTitle>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <p className="text-center neon-text-muted py-8">
              No orders yet.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="neon-table-header">
                  <TableHead className="neon-text">Order ID</TableHead>
                  <TableHead className="neon-text">Customer</TableHead>
                  <TableHead className="neon-text">Date</TableHead>
                  <TableHead className="neon-text">Total</TableHead>
                  <TableHead className="neon-text">Status</TableHead>
                  <TableHead className="text-right neon-text">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id.toString()} className="neon-table-row">
                    <TableCell className="font-medium neon-text">#{order.id.toString()}</TableCell>
                    <TableCell className="neon-text">{getCustomerDisplay(order)}</TableCell>
                    <TableCell className="neon-text">
                      {new Date(Number(order.createdAt) / 1_000_000).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="neon-text-accent">{formatINR(order.totalPrice)}</TableCell>
                    <TableCell>
                      <Select
                        value={order.status}
                        onValueChange={(value) => handleStatusUpdate(order.id, value as OrderStatus)}
                        disabled={updatingOrderId === order.id}
                      >
                        <SelectTrigger className="w-[140px] neon-select-status">
                          <SelectValue>
                            <Badge className={statusColors[order.status]}>
                              {statusLabels[order.status]}
                            </Badge>
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent className="z-[200]">
                          <SelectItem value="pending">
                            <Badge className={statusColors.pending}>Pending</Badge>
                          </SelectItem>
                          <SelectItem value="inProgress">
                            <Badge className={statusColors.inProgress}>Confirmed</Badge>
                          </SelectItem>
                          <SelectItem value="transit">
                            <Badge className={statusColors.transit}>Shipped</Badge>
                          </SelectItem>
                          <SelectItem value="delivered">
                            <Badge className={statusColors.delivered}>Delivered</Badge>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedOrder(order)}
                        className="neon-button-ghost"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-2xl p-0 border-0">
          <NeonSurface>
            {selectedOrder && (
              <div className="p-6">
                <DialogHeader>
                  <DialogTitle className="font-serif neon-text-glow">
                    Order #{selectedOrder.id.toString()}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-6 mt-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm neon-text-muted">Customer</p>
                      <p className="font-medium neon-text">{getCustomerDisplay(selectedOrder)}</p>
                    </div>
                    <div>
                      <p className="text-sm neon-text-muted">Status</p>
                      <Badge className={statusColors[selectedOrder.status]}>
                        {statusLabels[selectedOrder.status]}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm neon-text-muted">Order Date</p>
                      <p className="font-medium neon-text">
                        {new Date(Number(selectedOrder.createdAt) / 1_000_000).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm neon-text-muted">Total</p>
                      <p className="font-medium neon-text-accent">{formatINR(selectedOrder.totalPrice)}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-3 neon-text">Delivery Address</h3>
                    <div className="p-4 neon-card rounded-lg space-y-1">
                      <p className="font-medium neon-text">{selectedOrder.address.name}</p>
                      <p className="text-sm neon-text-muted">{selectedOrder.address.addressLine1}</p>
                      {selectedOrder.address.addressLine2 && (
                        <p className="text-sm neon-text-muted">{selectedOrder.address.addressLine2}</p>
                      )}
                      <p className="text-sm neon-text-muted">
                        {selectedOrder.address.city}, {selectedOrder.address.state} {selectedOrder.address.postalCode}
                      </p>
                      <p className="text-sm neon-text-muted">{selectedOrder.address.country}</p>
                      <p className="text-sm neon-text-muted">Phone: {selectedOrder.address.phoneNumber}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-3 neon-text">Order Items</h3>
                    <div className="space-y-2">
                      {selectedOrder.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between p-3 neon-card rounded-lg">
                          <div>
                            <p className="font-medium neon-text">Product #{item.productId.toString()}</p>
                            {item.weightVariant && (
                              <p className="text-sm neon-text-muted">
                                {item.weightVariant.weight.toString()}g - {item.weightVariant.description}
                              </p>
                            )}
                            {item.flavorVariant && (
                              <p className="text-sm neon-text-muted">
                                {item.flavorVariant.flavor} - {item.flavorVariant.description}
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="font-medium neon-text">Qty: {item.quantity.toString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </NeonSurface>
        </DialogContent>
      </Dialog>
    </div>
  );
}
