"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Menu, X, Heart } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession } from "@/hooks/use-session";
import TopBar from "./top-bar";
import CartPopver from "../cart/cart-popver";
import { useWishList } from "@/hooks/use-wish-list";
import UserMenu from "./user-menu";
import MobileNavMenu from "./mobile-nav-menu";
import { ICategory } from "@/interfaces";
import { getAllCategoriesAction } from "@/actions/categories.actions";
import { Skeleton } from "@/components/ui/skeleton";
import ProductSearch from "@/components/shared/product-search";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { user, isAuthenticated } = useSession();
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const { count } = useWishList();

  const [categories, setCategories] = useState<ICategory[]>([]);

  useEffect(() => {
    (async () => {
      setIsLoadingCategories(true);
      try {
        const categories = await getAllCategoriesAction({});
        if (!categories.success) return;
        setCategories(categories.data!);
        setIsLoadingCategories(false);
      } finally {
        setIsLoadingCategories(false);
      }
    })();
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 border border-b">
      <TopBar />

      <div className="container">
        <div className="flex h-16 items-center justify-between gap-x-2 sm:gap-x-4">
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-linear-to-r from-main to-rose-500 text-white font-bold text-sm sm:text-lg px-3 py-1 rounded-sm">
              Cart Store
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            {isLoadingCategories ? (
              <div className="flex items-center space-x-2">
                <Skeleton className="h-6 w-20 bg-gray-200" />
                <Skeleton className="h-6 w-20 bg-gray-200" />
                <Skeleton className="h-6 w-20 bg-gray-200" />
              </div>
            ) : (
              <>
                <Link
                  href="/"
                  className="text-sm font-medium transition-colors hover:text-main"
                >
                  Home
                </Link>
                <Link
                  href="/shop/products"
                  className="text-sm font-medium transition-colors hover:text-main"
                >
                  Shop
                </Link>
                {categories.slice(0, 3).map((category) => (
                  <Link
                    key={category.name}
                    href={`/shop/products?category/${category.name.toLowerCase()}`}
                    className="capitalize text-sm font-medium transition-colors hover:text-main"
                  >
                    {category.name.toLowerCase()}
                  </Link>
                ))}
              </>
            )}
          </nav>

          {/* Search Bar - Desktop */}
          <ProductSearch className="hidden md:flex flex-1 max-w-lg mx-4" />

          <div className="flex items-center gap-2">
            {/* Mobile Search Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setSearchOpen(!searchOpen)}
            >
              <Search className="h-5 w-5" />
            </Button>

            <Button variant="ghost" size="icon" className="relative" asChild>
              <Link href="/wishlist">
                <Heart className="h-5 w-5" />
                {count > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-600">
                    {count}
                  </Badge>
                )}
              </Link>
            </Button>

            <CartPopver />

            <UserMenu isAuthenticated={isAuthenticated} user={user} />

            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Search */}
        {searchOpen && <ProductSearch className="md:hidden py-4" />}

        <MobileNavMenu
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          categories={categories.slice(0, 4)}
        />
      </div>
    </header>
  );
};

export default Navbar;
