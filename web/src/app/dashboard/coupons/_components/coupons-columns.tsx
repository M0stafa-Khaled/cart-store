"use client";

import { deleteCouponAction } from "@/actions/coupons.actions";
import { ColumnDef } from "@/components/data-table";
import DeleteDialog from "@/components/shared/delete-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDate } from "@/utils/formatDate";
import { ArrowDownUp, Edit, MoreHorizontal, Trash } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import CouponDialog from "./coupon-dialog";
import { ICoupon } from "@/interfaces";

export const useCouponsColumns = (): ColumnDef<ICoupon>[] => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const sort = searchParams.get("sort") || "asc";

  const handleSort = () => {
    const params = new URLSearchParams(searchParams.toString());
    const newSort = sort === "asc" ? "desc" : "asc";
    params.set("sort", newSort);
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname);
  };

  return [
    {
      key: "code",
      header: "Code",
      cell: (row) => <span className="font-medium">{row.code}</span>,
    },
    {
      key: "discountType",
      header: "Type",
      cell: (row) => (
        <Badge variant="outline">
          {row.discountType === "PERCENTAGE" ? "Percentage" : "Fixed"}
        </Badge>
      ),
    },
    {
      key: "discountValue",
      header: "Value",
      cell: (row) => (
        <span>
          {row.discountValue}
          {row.discountType === "PERCENTAGE" ? "%" : " EGP"}
        </span>
      ),
    },
    {
      key: "usedCount",
      header: "Usage",
      cell: (row) => (
        <span>
          {row.usedCount} / {row.maxUsage}
        </span>
      ),
    },
    {
      key: "isActive",
      header: "Status",
      cell: (row) =>
        row.isActive ? (
          <Badge className="mx-auto bg-emerald-600/20 hover:bg-emerald-600/10 text-emerald-500 border-emerald-600/60 shadow-none rounded-full">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-2" />
            Active
          </Badge>
        ) : (
          <Badge className="mx-auto bg-red-600/20 hover:bg-red-600/10 text-red-500 border-red-600/60 shadow-none rounded-full">
            <div className="h-1.5 w-1.5 rounded-full bg-red-500 mr-2" />{" "}
            Inactive
          </Badge>
        ),
    },
    {
      key: "expiredAt",
      header: "Expires At",
      cell: (row) => formatDate(row.expiredAt),
    },
    {
      key: "createdAt",
      header: (
        <div
          className="flex items-center justify-center gap-3 cursor-pointer"
          onClick={handleSort}
        >
          <ArrowDownUp size={12} />
          <span>Created At</span>
        </div>
      ),
      cell: (row) => formatDate(row.createdAt),
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

            <CouponDialog coupon={row}>
              <DropdownMenuItem
                onSelect={(e) => e.preventDefault()}
                className="cursor-pointer"
                variant="editable"
              >
                <Edit className="mr-2 h-4 w-4" />
                <span>Edit</span>
              </DropdownMenuItem>
            </CouponDialog>

            <DeleteDialog
              id={row.id}
              name={row.code}
              deleteHandler={deleteCouponAction}
            >
              <DropdownMenuItem
                onSelect={(e) => e.preventDefault()}
                className="cursor-pointer"
                variant="destructive"
              >
                <Trash className="mr-2 h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DeleteDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];
};
