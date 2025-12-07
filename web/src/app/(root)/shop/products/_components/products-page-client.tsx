"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  IProduct,
  IPaginationMeta,
  ICategory,
  IBrand,
  ISubCategory,
  IProductParams,
} from "@/interfaces";
import ProductsGrid from "./products-grid";
import ProductsHeader from "./products-header";
import ProductsFilters from "./products-filters";
import ProductsPagination from "./products-pagination";

interface ProductsPageClientProps {
  products: IProduct[];
  meta: IPaginationMeta;
  categories: ICategory[];
  brands: IBrand[];
  subCategories: ISubCategory[];
  searchParams: IProductParams;
}

const ProductsPageClient = ({
  products,
  meta,
  categories,
  brands,
  subCategories,
  searchParams,
}: ProductsPageClientProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const handleFilterChange = (key: string, value: string | null) => {
    const newParams = new URLSearchParams(searchParams as any);
    if (value) newParams.set(key, value);
    else newParams.delete(key);

    // Reset to page 1 when filters change
    newParams.set("page", "1");
    startTransition(() => {
      router.push(`/shop/products?${newParams.toString()}`);
    });
  };

  const handlePriceChange = (min: string | null, max: string | null) => {
    const newParams = new URLSearchParams(searchParams as any);

    if (min) newParams.set("minPrice", min);
    else newParams.delete("minPrice");

    if (max) newParams.set("maxPrice", max);
    else newParams.delete("maxPrice");

    newParams.set("page", "1");
    startTransition(() => {
      router.push(`/shop/products?${newParams.toString()}`);
    });
  };

  const handleClearFilters = () => {
    startTransition(() => {
      router.push("/shop/products");
    });
  };

  const handlePageChange = (page: number) => {
    if (page === meta.page) return;
    const newParams = new URLSearchParams(searchParams as any);
    newParams.set("page", page.toString());
    startTransition(() => {
      router.push(`/shop/products?${newParams.toString()}`);
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="container">
      <ProductsHeader
        filters={{
          category: searchParams.category,
          subCategory: searchParams.subCategory,
          brand: searchParams.brand,
          search: searchParams.search,
        }}
        productsCount={products.length}
        totalCount={meta.count}
        isLoading={isPending}
        sort={searchParams.sort || "desc"}
        onSortChange={(value) => handleFilterChange("sort", value)}
        onToggleMobileFilters={() =>
          setIsMobileFiltersOpen(!isMobileFiltersOpen)
        }
      />

      <div className="mt-8 flex gap-8">
        <ProductsFilters
          categories={categories}
          brands={brands}
          subCategories={subCategories}
          filters={searchParams}
          onFilterChange={handleFilterChange}
          onPriceChange={handlePriceChange}
          onClearFilters={handleClearFilters}
          isMobileOpen={isMobileFiltersOpen}
          onMobileClose={() => setIsMobileFiltersOpen(false)}
        />

        <div className="flex-1">
          <ProductsGrid
            products={products}
            isLoading={isPending}
            searchQuery={searchParams.search}
          />

          {meta && meta.totalPages > 1 && (
            <ProductsPagination
              currentPage={meta.page || 0}
              totalPages={meta.totalPages || 0}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPageClient;
