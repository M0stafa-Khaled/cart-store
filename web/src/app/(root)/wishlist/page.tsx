"use client";

import { useWishList } from "@/hooks/use-wish-list";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatEGPPrice } from "@/utils/formatPrice";
import {
  Heart,
  ShoppingCart,
  Trash2,
  ArrowRight,
  Sparkles,
  Package,
  Star,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { IProduct } from "@/interfaces";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const WishListPage = () => {
  const router = useRouter();
  const { items, count, removeFromWishlist, clearWishlist } = useWishList();
  const { addToCart, isLoading } = useCart();


  if (count === 0) {
    return (
      <div className="container py-16">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-linear-to-r from-pink-500/20 via-main/20 to-purple-500/20 blur-3xl rounded-full animate-pulse" />
            <div className="relative bg-linear-to-br from-pink-100 to-purple-100 dark:from-pink-950/30 dark:to-purple-950/30 p-12 rounded-full">
              <Heart className="w-24 h-24 text-main relative" />
            </div>
          </div>
          <h2 className="text-4xl font-bold mb-4 text-main">
            Your Wishlist is Empty
          </h2>
          <p className="text-muted-foreground mb-8 max-w-md text-lg">
            Start adding products you love to your wishlist and keep track of
            your favorites!
          </p>
          <Link href="/shop/products">
            <Button
              size="lg"
              className="gap-2 bg-linear-to-r from-main to-pink-600 hover:from-main/90 hover:to-pink-600/90 text-white shadow-lg shadow-main/30 hover:shadow-xl hover:shadow-main/40 transition-all duration-300"
            >
              <Sparkles className="w-5 h-5" />
              Discover Products
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = (product: IProduct) => {
    const hasColor = items.some((item) => item.colors?.length);
    const hasSize = items.some((item) => item.sizes?.length);
    if (hasColor || hasSize) {
      router.push(`/shop/products/${product.id}`);
      if (hasColor && hasSize)
        toast.info("Please select color and size", { position: "top-right" });
      else if (hasColor && !hasSize)
        toast.info("Please select color", { position: "top-right" });
      else if (!hasColor && hasSize)
        toast.info("Please select size", { position: "top-right" });
    } else {
      addToCart({
        productId: product.id,
        quantity: 1,
      });
    }
  };
  return (
    <div className="container py-8">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold mb-2 text-main">My Wishlist</h1>
          <p className="text-muted-foreground flex items-center gap-2">
            <Heart className="w-4 h-4 text-main fill-main" />
            {count} {count === 1 ? "item" : "items"} saved
          </p>
        </div>
        <Button onClick={clearWishlist} className="bg-main hover:bg-main/90">
          <Trash2 className="w-4 h-4" />
          Clear All
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
        {items.map((product) => {
          const discountPercentage =
            product.price > product.priceAfterDiscount
              ? Math.round(
                  ((product.price - product.priceAfterDiscount) /
                    product.price) *
                    100
                )
              : 0;
          return (
            <Card
              key={product.id}
              className="group pt-0 max-w-md w-full rounded-2xl overflow-hidden mx-auto hover:shadow-xl transition-all duration-300 border-slate-200"
            >
              <div className="relative aspect-square overflow-hidden bg-linear-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
                <Image
                  src={product.imageCover}
                  alt={product.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />

                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4 right-4 flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleAddToCart(product)}
                      disabled={isLoading || product.stock === 0}
                      className="flex-1 gap-2 bg-white text-black hover:bg-white/90 shadow-lg"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Add to Cart
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => removeFromWishlist(product.id)}
                      className="gap-2 shadow-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {product.discountValue > -1 && (
                    <Badge className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      -{discountPercentage}%
                    </Badge>
                  )}
                  {product.stock > 0 && product.stock <= 5 && (
                    <Badge
                      variant="secondary"
                      className="bg-orange-500 text-white shadow-lg"
                    >
                      Only {product.stock} left
                    </Badge>
                  )}
                </div>

                <div className="absolute top-4 right-4">
                  <div className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg">
                    <Heart className="w-5 h-5 text-main fill-main animate-pulse" />
                  </div>
                </div>
              </div>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="px-2 py-1 bg-muted rounded-full">
                    {product.category.name}
                  </span>
                  <span>•</span>
                  <span>{product.brand.name}</span>
                </div>

                <Link href={`/shop/products/${product.id}`}>
                  <h3 className="font-semibold text-lg line-clamp-2 hover:text-main transition-colors duration-200">
                    {product.title}
                  </h3>
                </Link>
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {[...Array(Math.round(product.ratingAverage || 0))].map(
                      (_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 fill-yellow-400 text-yellow-400"
                        />
                      )
                    )}
                    {[...Array(5 - Math.round(product.ratingAverage || 0))].map(
                      (_, i) => (
                        <Star key={i} className="w-4 h-4 text-slate-300" />
                      )
                    )}
                  </div>
                  <span className="text-muted-foreground text-xs">
                    ({product.ratingQuantity || 0} reviews)
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {product.priceAfterDiscount < product.price ? (
                    <>
                      <span className="text-2xl font-bold text-main">
                        {formatEGPPrice(product.priceAfterDiscount)}
                      </span>
                      <span className="text-sm text-muted-foreground line-through">
                        {formatEGPPrice(product.price)}
                      </span>
                    </>
                  ) : (
                    <span className="text-2xl font-bold">
                      {formatEGPPrice(product.price)}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 text-sm">
                  {product.stock > 0 ? (
                    <>
                      <Package className="w-4 h-4 text-green-500" />
                      <span className="text-green-600 dark:text-green-400 font-medium">
                        In Stock
                      </span>
                    </>
                  ) : (
                    <>
                      <Package className="w-4 h-4 text-destructive" />
                      <span className="text-destructive font-medium">
                        Out of Stock
                      </span>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-12 text-center">
        <Card className="p-8 bg-linear-to-br from-main/5 via-pink-500/5 to-purple-500/5 border-2 border-main/20">
          <h3 className="text-2xl font-bold mb-2">Ready to Shop?</h3>
          <p className="text-muted-foreground mb-6">
            Explore more amazing products and add them to your wishlist
          </p>
          <Link href="/shop/products">
            <Button
              size="lg"
              className="gap-2 bg-linear-to-r from-main to-pink-600 hover:from-main/90 hover:to-pink-600/90 text-white shadow-lg shadow-main/30"
            >
              <Sparkles className="w-5 h-5" />
              Continue Shopping
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  );
};

export default WishListPage;
