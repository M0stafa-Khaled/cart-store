"use client";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, Filter } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useSidebar } from "@/components/ui/sidebar";
import { IOrderParams } from "@/interfaces";
import { Card } from "@/components/ui/card";

export const OrdersFilters = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const filters = useMemo(() => {
    return {
      status: searchParams.get("status") || "",
      paymentStatus: searchParams.get("paymentStatus") || "",
      paymentMethod: searchParams.get("paymentMethod") || "",
      isPaid: searchParams.get("isPaid") || "",
      isDelivered: searchParams.get("isDelivered") || "",
    };
  }, [searchParams]);

  const buildQueryString = useMemo(
    () => (updates: Record<string, string | number | null | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (
          value === null ||
          value === undefined ||
          value === "" ||
          value === "all"
        )
          params.delete(key);
        else params.set(key, String(value));
      });
      return params.toString();
    },
    [searchParams]
  );

  const setFilters = (updates: Partial<IOrderParams>) => {
    const qs = buildQueryString(
      updates as Record<string, string | number | null>
    );
    router.replace(`${pathname}?${qs}`);
  };

  const clearFilters = () => {
    setFilters({
      status: "",
      paymentStatus: "",
      paymentMethod: "",
      isPaid: "",
      isDelivered: "",
    });
    router.push("/dashboard/orders");
  };

  const hasActiveFilters = Object.values(filters).some((value) => value !== "");

  const { open } = useSidebar();

  return (
    <Card className="p-4">
      <div className="flex items-center gap-2">
        <Filter className="w-5 h-5 text-muted-foreground" />
        <h3 className="font-semibold">Filters</h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="ml-auto gap-2"
          >
            <X className="w-4 h-4" />
            Clear All
          </Button>
        )}
      </div>

      <div
        className={`grid grid-cols-1 ${
          open ? "lg:grid-cols-2" : "lg:grid-cols-3"
        } md:grid-cols-2 xl:grid-cols-3 gap-2`}
      >
        <Select
          value={filters.status ?? "all"}
          onValueChange={(value) => setFilters({ status: value })}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Order Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
            <SelectItem value="CANCELLED">Cancelled</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.paymentStatus ?? "all"}
          onValueChange={(value) => setFilters({ paymentStatus: value })}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Payment Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="PAID">Paid</SelectItem>
            <SelectItem value="FAILED">Failed</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.paymentMethod ?? "all"}
          onValueChange={(value) => setFilters({ paymentMethod: value })}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Payment Method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="CASH">Cash on Delivery</SelectItem>
            <SelectItem value="CREDIT_CARD">Credit Card</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.isPaid ?? "all"}
          onValueChange={(value) => setFilters({ isPaid: value })}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Paid (all)" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="true">Paid</SelectItem>
            <SelectItem value="false">Not Paid</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.isDelivered ?? "all"}
          onValueChange={(value) => setFilters({ isDelivered: value })}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Delivered (all)" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="true">Delivered</SelectItem>
            <SelectItem value="false">Not Delivered</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </Card>
  );
};
