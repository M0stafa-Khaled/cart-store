"use client";

import { IProduct } from "@/interfaces";
import Productcard from "../../../_components/products/product-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Search } from "lucide-react";

interface ProductsGridProps {
  products: IProduct[];
  isLoading: boolean;
  searchQuery?: string | null;
}

const ProductsGrid = ({
  products,
  isLoading,
  searchQuery,
}: ProductsGridProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="h-64 w-full rounded-xl" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4">
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-main/20 blur-3xl rounded-full" />
          <Search className="relative h-16 w-16 text-main" />
        </div>
        <h2 className="text-2xl font-semibold mb-2 text-center">
          No products found
        </h2>
        <p className="text-muted-foreground text-center max-w-md">
          {searchQuery
            ? `We couldn't find any products matching "${searchQuery}". Try different keywords or adjust your filters.`
            : "No products available at the moment. Try adjusting your filters."}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 animate-in fade-in duration-500">
      {products.map((product, index) => (
        <div
          key={product.id}
          className="animate-in fade-in slide-in-from-bottom-4"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <Productcard product={product} showBadge />
        </div>
      ))}
    </div>
  );
};

export default ProductsGrid;
