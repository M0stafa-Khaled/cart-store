"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SlidersHorizontal } from "lucide-react";
import { IProductParams } from "@/interfaces";

interface ProductsHeaderProps {
  productsCount: number;
  totalCount?: number;
  isLoading: boolean;
  sort: string;
  onSortChange: (value: "desc" | "asc") => void;
  onToggleMobileFilters: () => void;
  filters: IProductParams;
}

const ProductsHeader = ({
  productsCount,
  totalCount,
  isLoading,
  sort,
  filters,
  onSortChange,
  onToggleMobileFilters,
}: ProductsHeaderProps) => {
  const getTitle = () => {
    if (filters.search) {
      return (
        <>
          Search Results for{" "}
          <span className="text-main">&quot;{filters.search}&quot;</span>
        </>
      );
    }
    if (filters.category) {
      return (
        <>
          <span className="capitalize">{filters.category}</span> Products
        </>
      );
    }
    return "All Products";
  };

  const isActiveFilters = () => {
    return Object.values(filters).some((value) => !!value);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row items-start justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-xl md:text-2xl font-bold bg-linear-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            {getTitle()}
          </h1>
          {!isLoading && (
            <p className="text-sm md:text-base text-muted-foreground">
              {totalCount !== undefined ? (
                <>
                  Showing {productsCount} of {totalCount} product
                  {totalCount !== 1 ? "s" : ""}
                </>
              ) : (
                <>
                  {productsCount} product{productsCount !== 1 ? "s" : ""} found
                </>
              )}
            </p>
          )}
          {isLoading && <Skeleton className="h-5 w-48" />}
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <Button
            variant="outline"
            className="lg:hidden"
            onClick={onToggleMobileFilters}
          >
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Filters
          </Button>

          <Select value={sort} onValueChange={onSortChange}>
            <SelectTrigger className="w-[160px] md:w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desc">Newest First</SelectItem>
              <SelectItem value="asc">Oldest First</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      {isActiveFilters() && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
          <span>Active filters:</span>
          <div className="flex flex-wrap gap-2">
            {filters.search && (
              <span className="px-2 py-1 bg-main/10 text-main rounded-md">
                Search: {filters.search}
              </span>
            )}
            {isActiveFilters() &&
              Object.entries(filters).map(
                ([key, value]) =>
                  value &&
                  key !== "search" && (
                    <span
                      key={key}
                      className="px-2 py-1 bg-main/10 text-main rounded-md capitalize"
                    >
                      {key}: {value}
                    </span>
                  )
              )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsHeader;
