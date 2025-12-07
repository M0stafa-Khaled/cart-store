"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { useSidebar } from "@/components/ui/sidebar";
import { useDebounce } from "@/hooks/use-debounce";
import { IReviewParams } from "@/interfaces";
import { Filter, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const ReviewsFilters = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<IReviewParams>({
    minRating: searchParams.get("minRating") ?? null,
    maxRating: searchParams.get("maxRating") ?? null,
    user: searchParams.get("user") ?? null,
    product: searchParams.get("product") ?? null,
  });

  const debouncedSearchUser = useDebounce(filters.user, 350);
  const debouncedSearchProduct = useDebounce(filters.product, 350);
  const debouncedSearchMinRating = useDebounce(filters.minRating, 350);
  const debouncedSearchMaxRating = useDebounce(filters.maxRating, 350);

  const buildQueryString = useMemo(
    () => (updates: Record<string, string | number | null | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === undefined || value === "")
          params.delete(key);
        else params.set(key, String(value));
      });
      return params.toString();
    },
    [searchParams]
  );

  const setFiltersParams = (updates: Partial<IReviewParams>) => {
    const qs = buildQueryString(
      updates as Record<string, string | number | null>
    );
    router.replace(`${pathname}?${qs}`);
  };

  useEffect(() => {
    setFiltersParams({
      user: debouncedSearchUser,
      product: debouncedSearchProduct,
      minRating: debouncedSearchMinRating,
      maxRating: debouncedSearchMaxRating,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    debouncedSearchUser,
    debouncedSearchProduct,
    debouncedSearchMinRating,
    debouncedSearchMaxRating,
  ]);

  const clearFilters = () => {
    setFilters({
      user: "",
      product: "",
      minRating: "",
      maxRating: "",
    });
  };

  const hasActiveFilters = Object.values(filters).some((value) => !!value);

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
        } md:grid-cols-2 xl:grid-cols-4 gap-2`}
      >
        <Input
          placeholder="Search user..."
          value={filters.user || ""}
          onChange={(e) => setFilters({ user: e.target.value })}
        />
        <Input
          placeholder="Search product..."
          value={filters.product || ""}
          onChange={(e) => setFilters({ product: e.target.value })}
        />
        <Input
          placeholder="Min rating"
          value={filters.minRating || ""}
          onChange={(e) => setFilters({ minRating: e.target.value })}
          type="number"
          min={0}
          max={5}
          step={0.1}
        />
        <Input
          placeholder="Max rating"
          value={filters.maxRating || ""}
          onChange={(e) => setFilters({ maxRating: e.target.value })}
          type="number"
          min={0}
          max={5}
          step={0.1}
        />
      </div>
    </Card>
  );
};

export default ReviewsFilters;
