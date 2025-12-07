import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MoveLeft, SearchX, ShoppingCart } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 - Page Not Found",
  description: "The page you are looking for does not exist.",
};

const NotFound = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background overflow-hidden relative selection:bg-primary/10">
      <div className="container px-4 md:px-6 relative z-10">
        <div className="flex flex-col items-center text-center space-y-8">
          <div className="relative">
            <div className="relative w-40 h-40 sm:w-52 sm:h-52 flex items-center justify-center bg-muted/30 rounded-full">
              <div className="absolute inset-0 rounded-full border border-dashed border-muted-foreground/20 animate-[spin_10s_linear_infinite]" />
              <SearchX className="w-20 h-20 sm:w-24 sm:h-24 text-muted-foreground/50" />
            </div>

            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-background px-4 py-1 rounded-full border shadow-sm">
              <span className="text-sm font-medium text-main whitespace-nowrap">
                Error 404
              </span>
            </div>
          </div>

          <div className="space-y-4 max-w-lg">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-linear-to-br from-main to-rose-500 bg-clip-text text-transparent pb-2">
              Page not found
            </h1>

            <p className="text-lg text-muted-foreground leading-relaxed">
              Sorry, we couldn&apos;t find the page you&apos;re looking for. It
              might have been removed, renamed, or doesn&apos;t exist.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 min-w-[300px] justify-center">
            <Button
              asChild
              variant="outline"
              size="lg"
              className="group border-muted-foreground/20 hover:bg-muted/50"
            >
              <Link href="/">
                <MoveLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                Go Back Home
              </Link>
            </Button>

            <Button
              asChild
              size="lg"
              className="bg-main text-white shadow-lg shadow-main/20 hover:bg-main/90 hover:shadow-xl hover:shadow-main/30 transition-all"
            >
              <Link href="/shop/products">
                <ShoppingCart className="mr-2 h-4 w-4" />
                Continue Shopping
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
