"use client";

import { MoreHorizontal, Eye, Trash2, Star, ArrowDownUp } from "lucide-react";
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
import { IReview } from "@/interfaces";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { formatDate } from "@/utils/formatDate";
import { deleteReviewAction } from "@/actions/reviews.actions";
import DeleteDialog from "@/components/shared/delete-dialog";
import { truncateText } from "@/utils/truncateText";

export const useReviewsColumns = (): ColumnDef<IReview>[] => {
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
      key: "user",
      header: "User",
      cell: (row) => row.user.name,
    },
    {
      key: "product",
      header: "Product",
      cell: (row) => row.product.title,
    },
    {
      key: "rating",
      header: "Rating",
      cell: (row) => (
        <div className="flex items-center justify-center gap-1">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span className="font-medium">{row.rating}</span>
          <span className="text-muted-foreground text-sm">/ 5</span>
        </div>
      ),
    },
    {
      key: "reviewText",
      header: "Review",
      cell: (row) => truncateText(row.reviewText, 60),
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

            <DropdownMenuItem
              onClick={() =>
                router.push(`/dashboard/products/${row.product.id}`)
              }
              className="cursor-pointer"
            >
              <Eye className="mr-2 h-4 w-4" />
              <span>View Product</span>
            </DropdownMenuItem>

            <DeleteDialog
              name="Delete Review"
              deleteHandler={deleteReviewAction}
              id={row.id}
            >
              <DropdownMenuItem
                onSelect={(e) => e.preventDefault()}
                className="cursor-pointer"
                variant="destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DeleteDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];
};
