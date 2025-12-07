"use client";

import { getAllBrandsAction } from "@/actions/brand.actions";
import { getAllCategoriesAction } from "@/actions/categories.actions";
import { getAllSubCategoriesAction } from "@/actions/sub-categories.actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSidebar } from "@/components/ui/sidebar";
import { useDebounce } from "@/hooks/use-debounce";
import {
  APIRes,
  IBrand,
  ICategory,
  IProductParams,
  ISubCategory,
} from "@/interfaces";
import { handleActionError } from "@/lib/error-handlers";
import { Filter, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const ProductsFilters = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [categories, setCategories] = useState<ICategory[]>([]);
  const [subCategories, setSubCategories] = useState<ISubCategory[]>([]);
  const [brands, setBrands] = useState<IBrand[]>([]);

  const [search, setSearch] = useState<string | null>(
    searchParams.get("search") ?? null
  );

  const filters = useMemo(() => {
    return {
      category: searchParams.get("category") ?? null,
      subCategory: searchParams.get("subCategory") ?? null,
      brand: searchParams.get("brand") ?? null,
    };
  }, [searchParams]);

  const debouncedSearch = useDebounce(search, 350);

  useEffect(() => {
    (async () => {
      try {
        const [categoriesRes, subCategoriesRes, brandsRes] = await Promise.all([
          getAllCategoriesAction({}),
          getAllSubCategoriesAction({}),
          getAllBrandsAction({}),
        ]);

        if (categoriesRes.success && categoriesRes.data) {
          setCategories(categoriesRes.data);
        }
        if (subCategoriesRes.success && subCategoriesRes.data) {
          setSubCategories(subCategoriesRes.data);
        }
        if (brandsRes.success && brandsRes.data) {
          setBrands(brandsRes.data);
        }
      } catch (error) {
        handleActionError(error as APIRes);
      }
    })();
  }, []);

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

  const setFilters = (updates: Partial<IProductParams>) => {
    const qs = buildQueryString(
      updates as Record<string, string | number | null>
    );
    router.replace(`${pathname}?${qs}`);
  };

  useEffect(() => {
    setFilters({ search: debouncedSearch });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const clearFilters = () => {
    setSearch("");
    setFilters({
      search: "",
      category: "",
      subCategory: "",
      brand: "",
    });
  };

  const filteredSubCategories = useMemo(() => {
    if (!filters.category) return subCategories;
    return subCategories.filter(
      (sub) => sub.category.name === filters.category
    );
  }, [filters.category, subCategories]);

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
        <Input
          placeholder="Search products..."
          value={search || ""}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Select
          value={filters.category ?? "all"}
          onValueChange={(v) => {
            setFilters({
              category: v,
              subCategory: null,
            });
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Category (all)" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.name}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.subCategory ?? "all"}
          onValueChange={(v) => setFilters({ subCategory: v })}
          disabled={
            !filters.category &&
            filteredSubCategories.length === subCategories.length
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Subcategory (all)" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Subcategories</SelectItem>
            {filteredSubCategories.length ? (
              filteredSubCategories.map((sub) => (
                <SelectItem key={sub.id} value={sub.name}>
                  {sub.name}
                </SelectItem>
              ))
            ) : (
              <SelectItem disabled value="disabled">
                No Subcategories
              </SelectItem>
            )}
          </SelectContent>
        </Select>

        <Select
          value={filters.brand ?? "all"}
          onValueChange={(v) => setFilters({ brand: v })}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Brand (all)" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Brands</SelectItem>
            {brands.map((b) => (
              <SelectItem key={b.id} value={b.name}>
                {b.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </Card>
  );
};

export default ProductsFilters;
