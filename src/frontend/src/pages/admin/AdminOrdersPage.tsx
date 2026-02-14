import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { usePageMeta } from '../../hooks/usePageMeta';
import { useGetAllOrders, useUpdateOrderStatus } from '../../hooks/useQueries';
import { Section, Container } from '../../components/brand/BrandPrimitives';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ArrowLeft, Package } from 'lucide-react';
import { toast } from 'sonner';
import type { OrderType, OrderStatus } from '../../backend';

function getOrderStatusBadge(status: string) {
  switch (status) {
    case 'pending':
      return <Badge variant="secondary">Pending</Badge>;
    case 'inProgress':
      return <Badge className="bg-blue-500">In Progress</Badge>;
    case 'transit':
      return <Badge className="bg-purple-500">In Transit</Badge>;
    case 'delivered':
      return <Badge className="bg-green-500">Delivered</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
}

function getCustomerIdentifierDisplay(identifier: OrderType['customerIdentifier']): string {
  if (identifier.__kind__ === 'email') {
    return identifier.email;
  } else {
    return identifier.phone;
  }
}

export default function AdminOrdersPage() {
  const navigate = useNavigate();
  usePageMeta('Manage Orders', 'View and manage customer orders');

  const ordersQuery = useGetAllOrders();
  const updateStatusMutation = useUpdateOrderStatus();

  const [selectedOrder, setSelectedOrder] = useState<OrderType | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

  const handleStatusChange = async (orderId: bigint, newStatus: OrderStatus) => {
    try {
      await updateStatusMutation.mutateAsync({ orderId, newStatus });
      toast.success('Order status updated successfully');
    } catch (error) {
      console.error('Update status error:', error);
      toast.error('Failed to update order status');
    }
  };

  const viewOrderDetails = (order: OrderType) => {
    setSelectedOrder(order);
    setDetailsDialogOpen(true);
  };

  if (ordersQuery.isLoading) {
    return (
      <Section className="py-12">
        <Container>
          <p className="text-center text-muted-foreground">Loading orders...</p>
        </Container>
      </Section>
    );
  }

  const orders = ordersQuery.data || [];

  return (
    <Section className="py-8">
      <Container>
        <Button
          variant="ghost"
          onClick={() => navigate({ to: '/admin' })}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-serif font-bold">Orders Management</h1>
              <p className="text-muted-foreground mt-2">
                View and manage customer orders
              </p>
            </div>
            <Badge variant="outline" className="text-lg px-4 py-2">
              {orders.length} {orders.length === 1 ? 'Order' : 'Orders'}
            </Badge>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-12 border rounded-lg">
              <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No orders yet</p>
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => {
                    const customerDisplay = getCustomerIdentifierDisplay(order.customerIdentifier);

                    return (
                      <TableRow key={order.id.toString()}>
                        <TableCell className="font-mono">#{order.id.toString()}</TableCell>
                        <TableCell>{customerDisplay}</TableCell>
                        <TableCell>{order.items.length}</TableCell>
                        <TableCell>₹{order.totalPrice.toFixed(2)}</TableCell>
                        <TableCell>
                          <Select
                            value={order.status}
                            onValueChange={(value) => handleStatusChange(order.id, value as OrderStatus)}
                            disabled={updateStatusMutation.isPending}
                          >
                            <SelectTrigger className="w-[140px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="inProgress">In Progress</SelectItem>
                              <SelectItem value="transit">In Transit</SelectItem>
                              <SelectItem value="delivered">Delivered</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          {new Date(Number(order.createdAt) / 1000000).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => viewOrderDetails(order)}
                          >
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </div>

        {selectedOrder && (
          <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Order Details - #{selectedOrder.id.toString()}</DialogTitle>
                <DialogDescription>
                  Complete order information and delivery address
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">Customer Information</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Identifier:</span> {getCustomerIdentifierDisplay(selectedOrder.customerIdentifier)}</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Order Information</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Status:</span> {getOrderStatusBadge(selectedOrder.status)}</p>
                    <p><span className="font-medium">Total:</span> ₹{selectedOrder.totalPrice.toFixed(2)}</p>
                    <p><span className="font-medium">Items:</span> {selectedOrder.items.length}</p>
                    <p><span className="font-medium">Created:</span> {new Date(Number(selectedOrder.createdAt) / 1000000).toLocaleString()}</p>
                    <p><span className="font-medium">Updated:</span> {new Date(Number(selectedOrder.updatedAt) / 1000000).toLocaleString()}</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Delivery Address</h3>
                  <div className="bg-muted p-4 rounded-lg space-y-1 text-sm">
                    <p className="font-medium">{selectedOrder.address.name}</p>
                    <p>{selectedOrder.address.addressLine1}</p>
                    {selectedOrder.address.addressLine2 && <p>{selectedOrder.address.addressLine2}</p>}
                    <p>{selectedOrder.address.city}, {selectedOrder.address.state} {selectedOrder.address.postalCode}</p>
                    <p>{selectedOrder.address.country}</p>
                    <p className="pt-2">Phone: {selectedOrder.address.phoneNumber}</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Order Items</h3>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="border rounded-lg p-3 text-sm">
                        <p><span className="font-medium">Product ID:</span> {item.productId.toString()}</p>
                        <p><span className="font-medium">Quantity:</span> {item.quantity.toString()}</p>
                        {item.weightVariant && (
                          <>
                            <p><span className="font-medium">Weight:</span> {item.weightVariant.weight.toString()}g</p>
                            <p><span className="font-medium">Price:</span> ₹{item.weightVariant.price.salePrice || item.weightVariant.price.listPrice}</p>
                          </>
                        )}
                        {item.flavorVariant && (
                          <>
                            <p><span className="font-medium">Flavor:</span> {item.flavorVariant.flavor}</p>
                            <p><span className="font-medium">Weight:</span> {item.flavorVariant.weight.toString()}g</p>
                            <p><span className="font-medium">Price:</span> ₹{item.flavorVariant.price.salePrice || item.flavorVariant.price.listPrice}</p>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </Container>
    </Section>
  );
}
