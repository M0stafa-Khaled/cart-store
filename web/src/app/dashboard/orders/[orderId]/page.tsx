import { getOrderByIdAction } from "@/actions/orders.actions";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatEGPPrice } from "@/utils/formatPrice";
import { formatDate } from "@/utils/formatDate";
import {
  Package,
  MapPin,
  CreditCard,
  Truck,
  Calendar,
  Phone,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronLeft,
  Edit,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { notFound } from "next/navigation";
import { UpdateOrderDialog } from "../_components/update-order-dialog";
import { Metadata } from "next";
import { getOrderStatus } from "../_components/statuses";
import ErrorRes from "@/components/shared/error";

export const metadata: Metadata = {
  title: "Order Details",
};

interface OrderDetailsPageProps {
  params: Promise<{ orderId: string }>;
}

const OrderDetailsPage = async ({ params }: OrderDetailsPageProps) => {
  const { orderId } = await params;
  const res = await getOrderByIdAction(orderId);

  if (!res.success || !res.data || res.error) {
    if (res.statusCode === 404) notFound();
    return <ErrorRes error={res} />;
  }

  const order = res.data;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case "CANCELLED":
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/orders">
            <Button variant="outline" size="icon">
              <ChevronLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Order #{order.orderNumber}
            </h1>
            <p className="text-muted-foreground">
              Placed on {formatDate(order.createdAt)}
            </p>
          </div>
        </div>
        <UpdateOrderDialog order={order} userId={order.user.id}>
          <Button className="gap-2 bg-blue-600 hover:bg-blue-700 px-6! h-auto w-auto">
            <Edit className="w-4 h-4" />
            Update
          </Button>
        </UpdateOrderDialog>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary/10 rounded-lg">
                {getStatusIcon(order.status)}
              </div>
              <div>
                <h2 className="text-xl font-semibold">Order Status</h2>
                <p className="text-sm text-muted-foreground">
                  Current order information
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Order</p>
                {getOrderStatus(order.status)}
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Payment</p>
                {getOrderStatus(order.paymentStatus)}
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Paid</p>
                {getOrderStatus(order.isPaid ? "PAID" : "PENDING")}
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Delivered</p>
                {getOrderStatus(order.isDelivered ? "DELIVERED" : "PENDING")}
              </div>
            </div>

            {order.deliveredAt && (
              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>
                    Delivered on{" "}
                    {formatDate(order.deliveredAt, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour12: true,
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            )}
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Package className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Order Items</h2>
                <p className="text-sm text-muted-foreground">
                  {order.orderItems.length} item
                  {order.orderItems.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {order.orderItems.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div className="relative w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-white">
                    <Image
                      src={item.product.imageCover}
                      alt={item.product.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-contain object-center"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold line-clamp-1">
                      {item.product.title}
                    </h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {item.color && (
                        <Badge variant="outline" className="gap-1">
                          <div
                            className="w-3 h-3 rounded-full border"
                            style={{ backgroundColor: item.color }}
                          />
                          {item.color}
                        </Badge>
                      )}
                      {item.size && (
                        <Badge variant="outline">Size: {item.size}</Badge>
                      )}
                      <Badge variant="outline">Qty: {item.quantity}</Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">
                      {formatEGPPrice(item.price)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Total: {formatEGPPrice(item.total)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary/10 rounded-lg">
                <CreditCard className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-lg font-semibold">Payment</h2>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Method</span>
                <span className="font-medium">
                  {order.paymentMethod === "CASH"
                    ? "Cash on Delivery"
                    : "Credit Card"}
                </span>
              </div>
              {order.coupon && (
                <>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Coupon</span>
                    <span className="font-medium">
                      {order.coupon?.code ?? "SAVE20"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Discount</span>
                    <span className="font-medium">
                      {order.coupon?.discountType === "PERCENTAGE"
                        ? `${order.coupon?.discountValue}%`
                        : formatEGPPrice(order.coupon.discountValue)}
                    </span>
                  </div>
                </>
              )}
              <Separator />
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">
                  {formatEGPPrice(order.subTotal)}
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
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-medium">
                  {formatEGPPrice(order.shippingCost)}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="font-semibold">Total</span>
                <span className="text-xl font-bold text-primary">
                  {formatEGPPrice(order.totalPrice)}
                </span>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary/10 rounded-lg">
                <MapPin className="w-5 h-5 text-main" />
              </div>
              <h2 className="text-lg font-semibold">Shipping Address</h2>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <Truck className="w-4 h-4 mt-0.5 text-blue-600 shrink-0" />
                <div>
                  <p className="font-medium">{order.shippingAddress.address}</p>
                  <p className="text-muted-foreground">
                    {order.shippingAddress.city.name},{" "}
                    {order.shippingAddress.city.country?.name || "Egypt"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-purple-600" />
                <span>{order.shippingAddress.phone}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
