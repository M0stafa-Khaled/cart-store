"use client";

import { deleteSubCategoryAction } from "@/actions/sub-categories.actions";
import { ColumnDef } from "@/components/data-table";
import DeleteDialog from "@/components/shared/delete-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ICategory, ISubCategory } from "@/interfaces";
import { formatDate } from "@/utils/formatDate";
import { ArrowDownUp, Edit, MoreHorizontal, Trash } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import SubCategoryDialog from "./sub-category-dialog";

export const useSubCategoriesColumns = (
  categories: ICategory[]
): ColumnDef<ISubCategory>[] => {
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
      key: "name",
      header: "Name",
      cell: (row) => <span className="font-medium">{row.name}</span>,
    },
    {
      key: "category",
      header: "Category",
      cell: (row) => <span>{row.category.name}</span>,
    },
    {
      key: "_count",
      header: "Products Count",
      cell: (row) => row._count?.products,
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

            <SubCategoryDialog subCategory={row} categories={categories}>
              <DropdownMenuItem
                onSelect={(e) => e.preventDefault()}
                className="cursor-pointer"
                variant="editable"
              >
                <Edit className="mr-2 h-4 w-4" />
                <span>Edit</span>
              </DropdownMenuItem>
            </SubCategoryDialog>

            <DeleteDialog
              id={row.id}
              name={row.name}
              deleteHandler={deleteSubCategoryAction}
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
