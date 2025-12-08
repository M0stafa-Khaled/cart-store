"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useSession } from "@/hooks/use-session";
import { ICategory } from "@/interfaces";
import { LogIn, UserPlus } from "lucide-react";
import Link from "next/link";

const MobileNavMenu = ({
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  categories,
}: {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  categories: ICategory[];
}) => {
  const { isAuthenticated } = useSession();

  return (
    isMobileMenuOpen && (
      <div className="lg:hidden py-4 space-y-4">
        <nav className="flex flex-col space-y-2">
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
          {categories?.map((category) => (
            <Link
              key={category.name}
              href={`/shop/products?category/${category.name.toLowerCase()}`}
              className="capitalize text-sm font-medium py-2 px-4 rounded-md hover:bg-muted transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {category.name}
            </Link>
          ))}
        </nav>
        <Separator />
        {!isAuthenticated && (
          <div className="flex flex-col gap-2 px-4">
            <Button variant="outline" className="w-full" asChild>
              <Link href="/auth/sign-in">
                <LogIn className="mr-2 h-4 w-4" />
                Sign In
              </Link>
            </Button>
            <Button className="w-full bg-main hover:bg-main/90" asChild >
              <Link href="/auth/sign-up">
                <UserPlus className="mr-2 h-4 w-4" />
                Sign Up
              </Link>
            </Button>
          </div>
        )}
      </div>
    )
  );
};

export default MobileNavMenu;
