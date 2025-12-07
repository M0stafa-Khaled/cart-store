import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package } from "lucide-react";
import { getAllUserOrdersAction } from "@/actions/orders.actions";
import { formatDate } from "@/utils/formatDate";
import { formatEGPPrice } from "@/utils/formatPrice";
import { getOrderStatus } from "@/app/dashboard/orders/_components/statuses";
import Link from "next/link";

interface UserOrdersHistoryProps {
  userId: string;
}

const UserOrdersHistory = async ({ userId }: UserOrdersHistoryProps) => {
  const result = await getAllUserOrdersAction(userId, {});

  if (!result.success || !result.data || result.data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Order History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
            <Package className="h-12 w-12 mb-4 opacity-50" />
            <p>No orders found for this user.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const orders = result.data;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order History ({orders.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
            >
              <Link
                href={`/dashboard/orders/${order.id}`}
                className="flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-y-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <span className="font-mono text-sm">
                        #{order.orderNumber}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {order.orderItems.length}{" "}
                      {order.orderItems.length === 1 ? "item" : "items"}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatDate(order.createdAt)}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col md:items-end gap-2">
                  <div className="font-medium text-main text-sm">
                    {formatEGPPrice(order.totalPrice)}
                  </div>
                  {order.discount > 0 && (
                    <div className="text-xs text-muted-foreground">
                      Discount: {formatEGPPrice(order.discount)}
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-x-2 gap-y-4">
                  <div className="text-xs font-medium text-muted-foreground flex items-center justify-center gap-1">
                    <span> Payment Status:</span>{" "}
                    {getOrderStatus(order.paymentStatus)}
                  </div>
                  <div className="text-xs font-medium text-muted-foreground flex items-center justify-center gap-1">
                    <span>Order Status:</span> {getOrderStatus(order.status)}
                  </div>

                  <div className="text-xs font-medium text-muted-foreground flex items-center justify-center gap-1">
                    <span>Delivered:</span>{" "}
                    {getOrderStatus(
                      order.isDelivered ? "DELIVERED" : "PENDING"
                    )}
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default UserOrdersHistory;
