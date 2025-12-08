import { Metadata } from "next";
import { getAllMyOrdersAction } from "@/actions/orders.actions";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Eye, Package, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/utils/formatDate";
import { getOrderStatus } from "@/app/dashboard/orders/_components/statuses";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatEGPPrice } from "@/utils/formatPrice";
import { Separator } from "@/components/ui/separator";
import { MyOrdersWidgets } from "./_components/my-orders-widgets";
import ErrorRes from "@/components/shared/error";
import Image from "next/image";

export const metadata: Metadata = {
  title: "My Orders",
};

const MyOrdersPage = async () => {
  const { data: orders, success, error } = await getAllMyOrdersAction();

  if (!success || error) return <ErrorRes error={error} />;

  if (orders?.length === 0 || !orders) {
    return (
      <div className="container space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href={"/profile"}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Package className="h-7 w-7 text-main" />
              My Orders
            </h1>
            <p className="text-muted-foreground mt-1">
              Track and view your order history
            </p>
          </div>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <ShoppingBag className="h-20 w-20 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No orders yet</h3>
              <p className="text-muted-foreground max-w-md mb-6">
                Your order history will appear here once you make your first
                purchase. Start shopping to see your orders!
              </p>
              <Button className="bg-main hover:bg-main/90" asChild>
                <Link href={"/shop/products"}>
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Start Shopping
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container space-y-6 pt-6 pb-16">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href={"/profile"}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Package className="h-7 w-7 text-main" />
            My Orders
          </h1>
          <p className="text-muted-foreground mt-1">
            Track and view your order history
          </p>
        </div>
      </div>

      <MyOrdersWidgets orders={orders} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {orders.map((order) => (
          <Card key={order.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between flex-col gap-3 sm:flex-row">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-muted-foreground" />
                    <CardTitle className="text-lg font-mono">
                      Order #{order.orderNumber}
                    </CardTitle>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Placed on {formatDate(order.createdAt)}
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium">Order Status:</p>
                    <p className="text-sm font-medium">
                      {getOrderStatus(order.status)}
                    </p>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium">Delivery Status:</p>
                    <p className="text-sm font-medium">
                      {getOrderStatus(
                        order.isDelivered ? "DELIVERED" : "PENDING"
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-3">
                    Items ({order.orderItems.length})
                  </p>
                  <div className="space-y-2">
                    {order.orderItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 p-2 rounded-md bg-accent/50"
                      >
                        <Avatar className="h-12 w-12 rounded-md">
                          {item.product.imageCover ? (
                            <Image
                              src={item.product.imageCover}
                              alt={item.product.title}
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              className="object-cover object-top"
                            />
                          ) : (
                            <AvatarFallback className="rounded-md text-xs">
                              {item.product.title.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {item.product.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Qty: {item.quantity} × {formatEGPPrice(item.price)}
                          </p>
                        </div>
                        <p className="text-sm font-semibold">
                          {formatEGPPrice(item.total)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Total Amount
                    </p>
                    <p className="text-2xl font-bold text-main">
                      {formatEGPPrice(order.totalPrice)}
                    </p>
                  </div>
                  <Button className="bg-main hover:bg-main/90" asChild>
                    <Link href={`/profile/my-orders/${order.id}`}>
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MyOrdersPage;
