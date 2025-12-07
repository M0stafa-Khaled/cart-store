"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/context/CartContext";
import { useWishList } from "@/hooks/use-wish-list";
import { IProduct } from "@/interfaces";
import { formatEGPPrice } from "@/utils/formatPrice";
import { truncateText } from "@/utils/truncateText";
import { Heart, Star, ShoppingCart, Package } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface ProductCardProps {
  product: IProduct;
  showBadge?: boolean;
}

const Productcard = ({ product, showBadge = true }: ProductCardProps) => {
  const { addToCart, isLoading } = useCart();
  const { addToWishlist, isInWishlist, removeFromWishlist } = useWishList();
  const router = useRouter();

  const hasColor = product.colors?.length && product.colors.length > 0;
  const hasSize = product.sizes?.length && product.sizes.length > 0;

  const discountPercentage =
    product.price > product.priceAfterDiscount
      ? Math.round(
          ((product.price - product.priceAfterDiscount) / product.price) * 100
        )
      : 0;

  const handleAddToCart = () => {
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

  const handleToggleWishlist = () => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <Card
      key={product.id}
      className="group pt-0 max-w-md w-full rounded-2xl overflow-hidden mx-auto hover:shadow-xl transition-all duration-300 border-slate-200"
    >
      <div className="relative overflow-hidden aspect-square flex items-center justify-center bg-muted cursor-pointer">
        <Link href={`/shop/products/${product.id}`} className="absolute inset-0">
          <Image
            src={product.imageCover || "/placeholder.svg"}
            alt={product.title}
            fill
            loading="eager"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover rounded-t-lg group-hover:scale-110 transition-transform duration-300"
          />

          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {showBadge && discountPercentage > 0 && (
              <div className="w-fit bg-red-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                -{discountPercentage}%
              </div>
            )}
          </div>
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {showBadge && product.category && (
              <div className="absolute -bottom-4 opacity-0 group-hover:bottom-2 group-hover:opacity-100 transition-all duration-300 left-4 bg-orange-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                {product.category.name}
              </div>
            )}
          </div>
        </Link>
        <div className="absolute top-4 right-4">
          <Button
            variant="ghost"
            size="icon-lg"
            className="rounded-full bg-white/90 hover:bg-white"
            onClick={(e) => {
              e.stopPropagation();
              handleToggleWishlist();
            }}
          >
            {isInWishlist(product.id) ? (
              <Heart className="w-6 h-6 text-red-500 fill-red-500" />
            ) : (
              <Heart className="w-6 h-6 text-slate-600" />
            )}
          </Button>
        </div>
      </div>
      <CardContent className="space-y-3">
        <Link href={`/shop/products/${product.id}`}>
          <h3 className="text-foreground font-semibold text-lg leading-tight line-clamp-2 hover:text-main transition-colors cursor-pointer">
            {product.title}
          </h3>
        </Link>
        <p className="text-muted-foreground text-sm line-clamp-2">
          {truncateText(product.description)}
        </p>
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            {[...Array(Math.round(product.ratingAverage || 0))].map((_, i) => (
              <Star
                key={i}
                className="w-4 h-4 fill-yellow-400 text-yellow-400"
              />
            ))}
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

        <div className="flex items-center justify-between pt-2">
          <div className="space-y-2">
            <div className="flex flex-col">
              {discountPercentage > 0 ? (
                <>
                  <span className="text-foreground text-2xl font-bold">
                    {formatEGPPrice(product.priceAfterDiscount)}
                  </span>
                  <span className="text-slate-400 text-sm line-through">
                    {formatEGPPrice(product.price)}
                  </span>
                </>
              ) : (
                <span className="text-foreground text-2xl font-bold">
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
          </div>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              handleAddToCart();
            }}
            disabled={isLoading || product.stock === 0}
            className="rounded-full px-6 py-2 text-sm font-medium gap-2 bg-main hover:bg-rose-700 duration-500"
          >
            <ShoppingCart className="w-4 h-4" />
            Add
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Productcard;
