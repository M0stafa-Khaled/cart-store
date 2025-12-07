"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/hooks/use-debounce";
import { getAllProductsAction } from "@/actions/products.actions";
import { IProduct } from "@/interfaces";
import Link from "next/link";
import Image from "next/image";
import { formatEGPPrice } from "@/utils/formatPrice";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

interface ProductSearchProps {
  className?: string;
}

const ProductSearch = ({ className }: ProductSearchProps) => {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<IProduct[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  const debouncedSearch = useDebounce(searchQuery, 300);

  useEffect(() => {
    const searchProducts = async () => {
      if (!debouncedSearch.trim()) {
        setSearchResults([]);
        setIsOpen(false);
        return;
      }

      setIsLoading(true);
      try {
        const response = await getAllProductsAction({
          search: debouncedSearch,
          limit: 8,
        });

        if (response.success && response.data) {
          setSearchResults(response.data.items || []);
          setIsOpen(true);
        }
      } catch (_) {
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    searchProducts();
  }, [debouncedSearch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      e.preventDefault();

      // If a product is selected, navigate to that product
      if (selectedIndex >= 0 && searchResults[selectedIndex]) {
        const product = searchResults[selectedIndex];
        router.push(`/shop/products/${product.id}`);
        handleClear(false);
        return;
      }

      router.push(`/shop/products?search=${encodeURIComponent(searchQuery)}`);
      return;
    }

    if (!isOpen || searchResults.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < searchResults.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Escape":
        setIsOpen(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const handleClear = (resetUrl: boolean = true) => {
    setSearchQuery("");
    setSearchResults([]);
    setIsOpen(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();

    if (resetUrl && pathname === "/shop/products") {
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.delete("search");
      router.push(`/shop/products?${newParams.toString()}`);
    }
  };

  const handleResultClick = () => {
    setIsOpen(false);
    setSearchQuery("");
    setSearchResults([]);
    setSelectedIndex(-1);
  };

  return (
    <div ref={searchRef} className={cn("relative w-full", className)}>
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          placeholder="Search products..."
          className="pl-10 pr-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (searchResults.length > 0) setIsOpen(true);
          }}
        />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
        )}
        {!isLoading && searchQuery && (
          <button
            onClick={() => handleClear(true)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {isOpen && searchResults.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-background border rounded-lg shadow-lg z-50 max-h-[400px] overflow-y-auto">
          <div className="p-2">
            <p className="text-xs text-muted-foreground px-3 py-2">
              Found {searchResults.length} result
              {searchResults.length !== 1 ? "s" : ""}
            </p>
            <div className="space-y-1">
              {searchResults.map((product, index) => (
                <Link
                  key={product.id}
                  href={`/shop/products/${product.id}`}
                  onClick={handleResultClick}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-md hover:bg-accent transition-colors",
                    selectedIndex === index && "bg-accent"
                  )}
                >
                  <div className="relative w-12 h-12 shrink-0 bg-gray-100 rounded">
                    <Image
                      src={product.imageCover || "/placeholder.png"}
                      alt={product.title}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">
                      {product.title}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      {product.brand && (
                        <span className="truncate">{product.brand.name}</span>
                      )}
                      {product.category && (
                        <>
                          <span>•</span>
                          <span className="truncate">
                            {product.category.name}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="font-semibold text-sm">
                      {formatEGPPrice(
                        product.priceAfterDiscount || product.price
                      )}
                    </p>
                    {product.priceAfterDiscount &&
                      product.priceAfterDiscount < product.price && (
                        <p className="text-xs text-muted-foreground line-through">
                          {formatEGPPrice(product.price)}
                        </p>
                      )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
          {searchResults.length >= 8 && (
            <div className="border-t p-3">
              <Link
                href={`/shop/products?search=${encodeURIComponent(searchQuery)}`}
                onClick={handleResultClick}
                className="text-sm text-main hover:underline font-medium block text-center"
              >
                View all results for &quot;{searchQuery}&quot;
              </Link>
            </div>
          )}
        </div>
      )}

      {/* No Results */}
      {isOpen && !isLoading && searchQuery && searchResults.length === 0 && (
        <div className="absolute top-full mt-2 w-full bg-background border rounded-lg shadow-lg z-50 p-6 text-center">
          <p className="text-sm text-muted-foreground">
            No products found for &quot;{searchQuery}&quot;
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Try different keywords or check your spelling
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductSearch;
