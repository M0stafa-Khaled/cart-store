import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, PackageX, ShoppingBag } from "lucide-react";

const ProductNotFound = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="text-center space-y-8 max-w-lg mx-auto">
        <div className="relative flex justify-center">
          <div className="flex items-center justify-center w-32 h-32 bg-red-50 rounded-full dark:bg-red-900/20">
            <PackageX className="w-16 h-16 text-red-500 dark:text-red-400" />
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Product Not Found
          </h1>
          <p className="text-muted-foreground text-lg max-w-sm mx-auto leading-relaxed">
            Oops! The product you&apos;re looking for seems to have vanished or
            doesn&apos;t exist anymore.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
          <Button
            asChild
            variant="outline"
            size="lg"
            className="w-full sm:w-auto min-w-[140px] border-2"
          >
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Home
            </Link>
          </Button>

          <Button
            asChild
            size="lg"
            className="w-full sm:w-auto min-w-[140px] bg-main hover:bg-main/90"
          >
            <Link href="/shop/products">
              <ShoppingBag className="mr-2 h-4 w-4" />
              Continue Shopping
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductNotFound;
