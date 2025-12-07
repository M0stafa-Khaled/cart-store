"use client";

import { ColumnDef } from "@/components/data-table";
import { Badge } from "@/components/ui/badge";
import { ICity, ICountry } from "@/interfaces";
import { formatDate } from "@/utils/formatDate";
import { formatEGPPrice } from "@/utils/formatPrice";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowDownUp, MoreHorizontal } from "lucide-react";
import { Edit, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import DeleteDialog from "../../../../../components/shared/delete-dialog";
import { deleteCityAction } from "@/actions/cities.actions";
import CityForm from "./city-dialog";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const ActionCell = ({
  city,
  countries,
}: {
  city: ICity;
  countries: ICountry[];
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel className="text-gray-500">
          <span>Actions</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <CityForm countries={countries} city={city}>
          <DropdownMenuItem
            className="cursor-pointer mb-2 "
            variant="editable"
            onSelect={(event) => event.preventDefault()}
            data-variant="editable"
          >
            <Edit className="h-4 w-4" />
            <span>Edit</span>
          </DropdownMenuItem>
        </CityForm>
        <DeleteDialog
          id={city.id}
          name={city.name}
          deleteHandler={deleteCityAction}
        >
          <DropdownMenuItem
            variant="destructive"
            className="cursor-pointer"
            onSelect={(event) => event.preventDefault()}
          >
            <Trash className="h-4 w-4" />
            <span>Delete</span>
          </DropdownMenuItem>
        </DeleteDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const useCitiesColumns = (countries: ICountry[]): ColumnDef<ICity>[] => {
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
      key: "country",
      header: "Country",
      cell: (row) => row.country.name,
    },
    {
      key: "shippingPrice",
      header: "Shipping Price",
      cell: (row) => (
        <Badge
          className={
            "mx-auto lex items-center gap-1 bg-amber-600/20 hover:bg-amber-600/10 text-amber-500 border-amber-600/60 shadow-none"
          }
        >
          {formatEGPPrice(row.shippingPrice)}
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
      cell: (row) => <ActionCell city={row} countries={countries} />,
    },
  ];
};
