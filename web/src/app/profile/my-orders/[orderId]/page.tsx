import { Metadata } from "next";
import { getMyOrderByIdAction } from "@/actions/orders.actions";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  CreditCard,
  MapPin,
  Package,
  Phone,
  Truck,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/utils/formatDate";
import { getOrderStatus } from "@/app/dashboard/orders/_components/statuses";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatEGPPrice } from "@/utils/formatPrice";
import Image from "next/image";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Order Details",
};

const UserOrderDetailsPage = async ({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) => {
  const { orderId } = await params;

  const { data: order, error, success } = await getMyOrderByIdAction(orderId);

  if (error || !success) return notFound();

  if (!order || error) {
    return (
      <div className="container pt-6 pb-16 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href={"/profile/my-orders"}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Order Not Found</h1>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Package className="h-20 w-20 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">Order not found</h3>
              <p className="text-muted-foreground max-w-md mb-6">
                The order you&apos;re looking for doesn&apos;t exist or you
                don&apos;t have permission to view it.
              </p>
              <Button className="bg-main hover:bg-main/90" asChild>
                <Link href="/profile/my-orders">Back to Orders</Link>
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
        <Button variant="outline" size="icon">
          <Link href={"/profile/my-orders"}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Package className="h-7 w-7 text-main" />
            Order #{order.orderNumber}
          </h1>
          <p className="text-muted-foreground mt-1">
            Placed on {formatDate(order.createdAt)}
          </p>
        </div>
      </div>

      <Card className="bg-linear-to-br from-green-600/5 to-green-600/5 border-green-600/50">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-mainy/20">
                <Package className="h-6 w-6 text-main" />
              </div>
              <div>
                <p className="font-semibold">Order Status</p>
                {getOrderStatus(order.status)}
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground mb-1">
                Delivery Status
              </p>
              {order.isDelivered ? (
                <Badge className="bg-blue-600/20 hover:bg-blue-600/10 text-blue-600 border-blue-600/60 shadow-none">
                  <Truck className="h-3 w-3 mr-1" />
                  Delivered
                </Badge>
              ) : (
                <Badge variant="outline" className="shadow-none">
                  <Clock className="h-3 w-3 mr-1" />
                  In Transit
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-main" />
              Payment Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Payment Method
              </span>
              <Badge variant="outline" className="shadow-none">
                {order.paymentMethod === "CREDIT_CARD"
                  ? "Credit Card"
                  : "Cash On Delivery"}
              </Badge>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Payment Status
              </span>
              {getOrderStatus(order.paymentStatus)}
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Payment Confirmed
              </span>
              {order.isPaid ? (
                <Badge className="bg-emerald-600/20 hover:bg-emerald-600/10 text-emerald-600 border-emerald-600/60 shadow-none">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Yes
                </Badge>
              ) : (
                <Badge className="bg-red-600/20 hover:bg-red-600/10 text-red-600 border-red-600/60 shadow-none">
                  <XCircle className="h-3 w-3 mr-1" />
                  No
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <MapPin className="h-5 w-5 text-main" />
              Shipping Address
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">
                  {order.shippingAddress.address}
                </p>
                <p className="text-sm text-muted-foreground">
                  {order.shippingAddress.city.name},{" "}
                  {order.shippingAddress.city.country.name}
                </p>
              </div>
            </div>
            <Separator />
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{order.shippingAddress.phone}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Order Items ({order.orderItems.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {order.orderItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              >
                <Avatar className="h-20 w-20 rounded-md">
                  {item.product.imageCover ? (
                    <Image
                      src={item.product.imageCover}
                      alt={item.product.title}
                      className="object-cover"
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      loading="lazy"
                    />
                  ) : (
                    <AvatarFallback className="rounded-md">
                      {item.product.title.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  )}
                </Avatar>

                <div className="flex-1 space-y-1">
                  <h4 className="font-semibold">
                    <Link href={`/shop/products/${item.product.id}`}>
                      {item.product.title}
                    </Link>
                  </h4>
                  <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                    {item.color && (
                      <Badge variant="outline" className="shadow-none">
                        Color: {item.color}
                      </Badge>
                    )}
                    {item.size && (
                      <Badge variant="outline" className="shadow-none">
                        Size: {item.size}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-muted-foreground">
                      Quantity:{" "}
                      <span className="font-medium text-foreground">
                        {item.quantity}
                      </span>
                    </span>
                    <span className="text-muted-foreground">
                      Price:{" "}
                      <span className="font-medium text-foreground">
                        {formatEGPPrice(item.price)}
                      </span>
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-lg font-bold text-main">
                    {formatEGPPrice(item.total)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Order Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium">
                {formatEGPPrice(order.subTotal)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Shipping Cost</span>
              <span className="font-medium">
                {formatEGPPrice(order.shippingCost)}
              </span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Discount</span>
                <span className="font-medium text-green-600">
                  -{formatEGPPrice(order.discount)}
                </span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span className="text-main">
                {formatEGPPrice(order.totalPrice)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserOrderDetailsPage;
