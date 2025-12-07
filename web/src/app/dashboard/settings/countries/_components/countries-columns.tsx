"use client";

import { ColumnDef } from "@/components/data-table";
import { ICountry } from "@/interfaces";
import { formatDate } from "@/utils/formatDate";
import { Button } from "@/components/ui/button";
import { ArrowDownUp, MoreHorizontal } from "lucide-react";
import { Edit, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CountryDialog from "./country-dialog";
import DeleteDialog from "@/components/shared/delete-dialog";
import { deleteCountry } from "@/actions/countries.actions";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export const useCountriesColumns = (): ColumnDef<ICountry>[] => {
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

            <CountryDialog country={row}>
              <DropdownMenuItem
                onSelect={(e) => e.preventDefault()}
                className="cursor-pointer"
                variant="editable"
                data-variant="editable"
              >
                <Edit className="mr-2 h-4 w-4" />
                <span>Edit</span>
              </DropdownMenuItem>
            </CountryDialog>

            <DeleteDialog
              id={row.id}
              name={row.name}
              deleteHandler={deleteCountry}
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
