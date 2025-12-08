"use client";
import {
  MoreHorizontal,
  Edit,
  Trash,
  Eye,
  Star,
  ArrowDownUp,
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
import { IProduct } from "@/interfaces";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import DeleteDialog from "@/components/shared/delete-dialog";
import { deleteProductAction } from "@/actions/products.actions";
import Image from "next/image";
import { formatEGPPrice } from "@/utils/formatPrice";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/utils/formatDate";

export const useProdctColumns = (): ColumnDef<IProduct>[] => {
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
      key: "imageCover",
      header: "Product Cover",
      cell: (row) => (
        <Avatar className="mx-auto w-16 h-16 rounded-md">
          {row.imageCover ? (
            <Image
              src={row.imageCover}
              alt={row.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-contain object-center"
            />
          ) : (
            <AvatarFallback>
              {row.title
                .split(" ")
                .map((name) => name[0])
                .join("")}
            </AvatarFallback>
          )}
        </Avatar>
      ),
    },
    {
      key: "title",
      header: "Title",
      cell: (row) => row.title,
    },
    {
      key: "description",
      header: "Description",
      cell: (row) =>
        row.description.length > 50
          ? row.description.slice(0, 50) + "..."
          : row.description,
    },
    { key: "price", header: "Price", cell: (row) => formatEGPPrice(row.price) },
    { key: "stock", header: "Stock" },
    { key: "category", header: "Category", cell: (row) => row.category.name },
    { key: "brand", header: "Brand", cell: (row) => row.brand.name },
    {
      key: "ratingAverage",
      header: "Rating",
      cell: (row) => (
        <Badge className="mx-auto flex items-center gap-1 bg-amber-600/20 hover:bg-amber-600/10 text-amber-500 border-amber-600/60 shadow-none">
          <Star />
          {row.ratingAverage}
        </Badge>
      ),
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
              onClick={() => router.push(`/dashboard/products/${row.id}`)}
              className="cursor-pointer"
            >
              <Eye className="mr-2 h-4 w-4" />
              <span>View</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() =>
                router.push(`/dashboard/products/${row.id}/update`)
              }
              className="cursor-pointer"
              variant="editable"
            >
              <Edit className="mr-2 h-4 w-4" />
              <span>Edit</span>
            </DropdownMenuItem>

            <DeleteDialog
              id={row.id}
              name={row.title}
              deleteHandler={deleteProductAction}
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
