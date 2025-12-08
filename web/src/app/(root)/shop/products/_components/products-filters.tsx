"use client";

import { useState } from "react";
import { ICategory, IBrand, ISubCategory, IProductParams } from "@/interfaces";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductsFiltersProps {
  categories: ICategory[];
  brands: IBrand[];
  subCategories: ISubCategory[];
  filters: IProductParams;
  onFilterChange: (key: string, value: string | null) => void;
  onPriceChange: (min: string | null, max: string | null) => void;
  onClearFilters: () => void;
  isMobileOpen: boolean;
  onMobileClose: () => void;
}

const ProductsFilters = ({
  categories,
  brands,
  subCategories,
  filters,
  onFilterChange,
  onPriceChange,
  onClearFilters,
  isMobileOpen,
  onMobileClose,
}: ProductsFiltersProps) => {
  const [prevMinPrice, setPrevMinPrice] = useState(filters.minPrice);
  const [prevMaxPrice, setPrevMaxPrice] = useState(filters.maxPrice);
  const [localMinPrice, setLocalMinPrice] = useState(filters.minPrice || "");
  const [localMaxPrice, setLocalMaxPrice] = useState(filters.maxPrice || "");
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    subCategory: true,
    brand: true,
    price: true,
  });

  if (filters.minPrice !== prevMinPrice) {
    setPrevMinPrice(filters.minPrice);
    setLocalMinPrice(filters.minPrice || "");
  }

  if (filters.maxPrice !== prevMaxPrice) {
    setPrevMaxPrice(filters.maxPrice);
    setLocalMaxPrice(filters.maxPrice || "");
  }

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handlePriceApply = () => {
    onPriceChange(localMinPrice || null, localMaxPrice || null);
  };

  const hasActiveFilters =
    filters.category ||
    filters.subCategory ||
    filters.brand ||
    filters.minPrice ||
    filters.maxPrice ||
    localMaxPrice ||
    localMinPrice;

  const filteredSubCategories = filters.category
    ? subCategories.filter(
        (sub) =>
          sub.category.name.toLowerCase() === filters.category?.toLowerCase()
      )
    : subCategories.slice(0, 15);

  const filtersContent = (
    <div className="space-y-6">
      {hasActiveFilters && (
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Active Filters</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              onClearFilters();
              setLocalMinPrice("");
              setLocalMaxPrice("");
            }}
            className="h-8 text-main hover:text-main/80"
          >
            Clear All
          </Button>
        </div>
      )}

      <div className="space-y-3">
        <button
          onClick={() => toggleSection("category")}
          className="flex items-center justify-between w-full text-left"
        >
          <Label className="text-base font-semibold cursor-pointer">
            Categories
          </Label>
          {expandedSections.category ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
        {expandedSections.category && (
          <div className="space-y-2 pl-1">
            {categories.slice(0, 10).map((category) => (
              <button
                key={category.id}
                onClick={() =>
                  onFilterChange(
                    "category",
                    filters.category === category.name ? null : category.name
                  )
                }
                className={cn(
                  "flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm transition-all hover:bg-accent",
                  filters.subCategory === category.name &&
                    "bg-main/10 text-main font-medium hover:bg-main/20"
                )}
              >
                <span className="capitalize">{category.name}</span>
                {category._count && (
                  <span className="text-xs text-muted-foreground">
                    {category._count.products}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      <Separator />

      {filteredSubCategories.length > 0 && (
        <>
          <div className="space-y-3">
            <button
              onClick={() => toggleSection("subCategory")}
              className="flex items-center justify-between w-full text-left"
            >
              <Label className="text-base font-semibold cursor-pointer">
                Sub Categories
              </Label>
              {expandedSections.subCategory ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
            {expandedSections.subCategory && (
              <ScrollArea>
                <div className="space-y-2 pl-1 pr-4">
                  {filteredSubCategories.map((subCategory) => (
                    <button
                      key={subCategory.id}
                      onClick={() =>
                        onFilterChange(
                          "subCategory",
                          filters.subCategory === subCategory.name
                            ? null
                            : subCategory.name
                        )
                      }
                      className={cn(
                        "flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm transition-all hover:bg-accent",
                        filters.subCategory === subCategory.name &&
                          "bg-main/10 text-main font-medium hover:bg-main/20"
                      )}
                    >
                      <span className="capitalize">{subCategory.name}</span>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>
          <Separator />
        </>
      )}

      <div className="space-y-3">
        <button
          onClick={() => toggleSection("brand")}
          className="flex items-center justify-between w-full text-left"
        >
          <Label className="text-base font-semibold cursor-pointer">
            Brands
          </Label>
          {expandedSections.brand ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
        {expandedSections.brand && (
          <ScrollArea>
            <div className="space-y-2 pl-1 pr-4">
              {brands.slice(0, 10).map((brand) => (
                <button
                  key={brand.id}
                  onClick={() =>
                    onFilterChange(
                      "brand",
                      filters.brand === brand.name ? null : brand.name
                    )
                  }
                  className={cn(
                    "flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm transition-all hover:bg-accent",
                    filters.brand === brand.name &&
                      "bg-main/10 text-main font-medium hover:bg-main/20"
                  )}
                >
                  <span>{brand.name}</span>
                  {brand._count && (
                    <span className="text-xs text-muted-foreground">
                      {brand._count.products}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </ScrollArea>
        )}
      </div>

      <Separator />

      <div className="space-y-3">
        <button
          onClick={() => toggleSection("price")}
          className="flex items-center justify-between w-full text-left"
        >
          <Label className="text-base font-semibold cursor-pointer">
            Price Range
          </Label>
          {expandedSections.price ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
        {expandedSections.price && (
          <div className="space-y-3 pl-1">
            <div className="space-y-2">
              <Label
                htmlFor="minPrice"
                className="text-sm text-muted-foreground"
              >
                Min Price (EGP)
              </Label>
              <Input
                id="minPrice"
                type="number"
                placeholder="0"
                value={localMinPrice}
                onChange={(e) => setLocalMinPrice(e.target.value)}
                className="h-9"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="maxPrice"
                className="text-sm text-muted-foreground"
              >
                Max Price (EGP)
              </Label>
              <Input
                id="maxPrice"
                type="number"
                placeholder="10000"
                value={localMaxPrice}
                onChange={(e) => setLocalMaxPrice(e.target.value)}
                className="h-9"
              />
            </div>
            <Button
              onClick={handlePriceApply}
              className="w-full bg-main hover:bg-main/90"
              size="sm"
            >
              Apply Price Filter
            </Button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:block w-72 shrink-0">
        <div className="sticky top-24 bg-white rounded-xl border shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold">Filters</h2>
          </div>
          <ScrollArea className="h-[calc(100vh-200px)] pr-4">
            {filtersContent}
          </ScrollArea>
        </div>
      </aside>

      <Sheet open={isMobileOpen} onOpenChange={onMobileClose}>
        <SheetContent
          aria-describedby="filters"
          side="left"
          className="w-[300px] sm:w-[400px] p-0"
        >
          <SheetHeader className="px-6 py-4 border-b">
            <SheetTitle>Filters</SheetTitle>
          </SheetHeader>
          <ScrollArea className="h-[calc(100vh-80px)] px-6 py-4">
            {filtersContent}
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default ProductsFilters;
