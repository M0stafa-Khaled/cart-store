"use client";
import {
  MoreHorizontal,
  Edit,
  Eye,
  ArrowDownUp,
  CreditCard,
  Truck,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@/components/data-table";
import { IOrder } from "@/interfaces";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/utils/formatDate";
import { formatEGPPrice } from "@/utils/formatPrice";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getOrderStatus } from "./statuses";
import { UpdateOrderDialog } from "./update-order-dialog";

export const useOrdersColumns = (): ColumnDef<IOrder>[] => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const sort = searchParams.get("sort") || "desc";

  const handleSort = () => {
    const params = new URLSearchParams(searchParams.toString());
    const newSort = sort === "asc" ? "desc" : "asc";
    params.set("sort", newSort);
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname);
  };

  return [
    {
      key: "orderNumber",
      header: "Order Number",
    },
    {
      key: "user",
      header: "User",
      cell: (row) => row.user.name,
    },
    {
      key: "orderItems",
      header: "Items",
      cell: (row) => (
        <div className="flex items-center justify-center gap-2">
          <div className="flex -space-x-2">
            {row.orderItems.slice(0, 3).map((item, idx) => (
              <Avatar key={idx} className="h-8 w-8 border-2 border-background">
                <AvatarImage
                  src={item.product.imageCover}
                  alt={item.product.title}
                />
                <AvatarFallback className="text-xs">
                  {item.product.title.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            ))}
          </div>
          <span className="text-sm font-medium">
            {row.orderItems.length}{" "}
            {row.orderItems.length === 1 ? "item" : "items"}
          </span>
        </div>
      ),
    },
    {
      key: "totalPrice",
      header: "Total",
      cell: (row) => (
        <div className="text-center">
          <div className="font-semibold text-main">
            {formatEGPPrice(row.totalPrice)}
          </div>
          {row.discount > 0 && (
            <div className="text-xs text-muted-foreground">
              Discount: {formatEGPPrice(row.discount)}
            </div>
          )}
        </div>
      ),
    },
    {
      key: "paymentMethod",
      header: "Payment",
      cell: (row) => (
        <div className="flex flex-col items-center gap-1">
          <Badge variant="outline" className="shadow-none">
            <CreditCard className="h-3 w-3 mr-1" />
            {row.paymentMethod === "CASH" ? "Cash on delivery" : "Credit card"}
          </Badge>
        </div>
      ),
    },
    {
      key: "paymentStatus",
      header: "Payment Status",
      cell: (row) => getOrderStatus(row.paymentStatus),
    },
    {
      key: "status",
      header: "Order Status",
      cell: (row) => getOrderStatus(row.status),
    },
    {
      key: "isDelivered",
      header: "Delivery",
      cell: (row) => (
        <div className="flex flex-col items-center gap-1">
          {row.isDelivered ? (
            <>
              <Badge className="shadow-none flex items-center gap-1 w-fit mx-auto bg-blue-600/20 hover:bg-blue-600/10 text-blue-600 border-blue-600/60">
                <Truck className="h-3 w-3 mr-1" />
                Delivered
              </Badge>
              {row.deliveredAt && (
                <span className="text-xs text-muted-foreground">
                  {formatDate(row.deliveredAt)}
                </span>
              )}
            </>
          ) : (
            <Badge className="shadow-none flex items-center gap-1 w-fit mx-auto bg-yellow-600/20 hover:bg-yellow-600/10 text-yellow-600 border-yellow-600/60">
              <Clock className="h-3 w-3 mr-1" />
              Pending
            </Badge>
          )}
        </div>
      ),
    },
    {
      key: "createdAt",
      header: (
        <div
          className="flex items-center justify-center gap-2 cursor-pointer"
          onClick={handleSort}
        >
          <ArrowDownUp size={12} />
          <span>Order Date</span>
        </div>
      ),
      cell: (row) => (
        <div className="text-center">
          <div className="text-sm">{formatDate(row.createdAt)}</div>
        </div>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      cell: (row) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() => router.push(`/dashboard/orders/${row.id}`)}
              className="cursor-pointer"
            >
              <Eye className="mr-2 h-4 w-4" />
              <span>View</span>
            </DropdownMenuItem>

            <UpdateOrderDialog order={row} userId={row.user.id}>
              <DropdownMenuItem
                onSelect={(e) => e.preventDefault()}
                className="cursor-pointer"
                variant="editable"
              >
                <Edit className="mr-2 h-4 w-4" />
                <span>Update</span>
              </DropdownMenuItem>
            </UpdateOrderDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];
};
