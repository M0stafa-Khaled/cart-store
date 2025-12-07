"use client";

import { IProduct } from "@/interfaces";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingCart, Star, Truck, Shield } from "lucide-react";
import { formatEGPPrice } from "@/utils/formatPrice";
import { useCart } from "@/context/CartContext";
import { useWishList } from "@/hooks/use-wish-list";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import ProductColors from "./products-colors";
import ProductSizes from "./product-siszes";
import { useState } from "react";
const ProductDetailsContent = ({ product }: { product: IProduct }) => {
  const [selectedColor, setSelectedColor] = useState<string>(
    product.colors?.[0] || ""
  );
  const [selectedSize, setSelectedSize] = useState<string>(
    product.sizes?.[0] || ""
  );
  const [quantity, setQuantity] = useState(1);

  const { addToCart, isLoading: isAddingToCart } = useCart();
  const { addToWishlist, isInWishlist, removeFromWishlist } = useWishList();
  const hasDiscount =
    product.discountValue > 0 && product.priceAfterDiscount < product.price;

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      quantity,
      ...(selectedColor && { color: selectedColor }),
      ...(selectedSize && { size: selectedSize }),
    });
  };
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-start justify-between mb-2">
          <h1 className="text-3xl font-bold">{product.title}</h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              isInWishlist(product.id)
                ? removeFromWishlist(product.id)
                : addToWishlist(product)
            }
          >
            <Heart
              className={`h-6 w-6 ${
                isInWishlist(product.id) ? "fill-red-500 text-red-500" : ""
              }`}
            />
          </Button>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.round(product.ratingAverage || 0)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground">
            {product.ratingAverage?.toFixed(1)} ({product.ratingQuantity}{" "}
            reviews)
          </span>
        </div>

        <div className="flex items-center gap-2 mb-4">
          {product.brand && (
            <Badge variant="secondary">{product.brand.name}</Badge>
          )}
          {product.category && (
            <Link
              href={`/shop/products?category=${product.category.name}`}
            >
              <Badge
                variant="outline"
                className="hover:bg-accent cursor-pointer"
              >
                {product.category.name}
              </Badge>
            </Link>
          )}
        </div>
      </div>

      <Separator />

      <div>
        <div className="flex items-baseline gap-3">
          <span className="text-4xl font-bold">
            {formatEGPPrice(product.priceAfterDiscount)}
          </span>
          {hasDiscount && (
            <span className="text-xl text-muted-foreground line-through">
              {formatEGPPrice(product.price)}
            </span>
          )}
        </div>
        {product.stock > 0 ? (
          <p className="text-sm text-green-600 mt-2">
            In Stock ({product.stock} available)
          </p>
        ) : (
          <p className="text-sm text-red-600 mt-2">Out of Stock</p>
        )}
        {product.stock > 0 && product.sold > 0 && (
          <p className="text-sm text-muted-foreground mt-2">
            {product.sold} sold
          </p>
        )}
      </div>

      <Separator />

      <ProductColors
        colors={product.colors}
        selectedColor={selectedColor}
        setSelectedColor={setSelectedColor}
      />

      <ProductSizes
        sizes={product.sizes}
        selectedSize={selectedSize}
        setSelectedSize={setSelectedSize}
      />

      <div>
        <label className="text-sm font-medium mb-2 block">Quantity</label>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          >
            -
          </Button>
          <span className="text-lg font-medium w-12 text-center">
            {quantity}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
            disabled={quantity >= product.stock}
          >
            +
          </Button>
        </div>
      </div>

      <Button
        size="lg"
        className="w-full bg-main hover:bg-main/90"
        onClick={handleAddToCart}
        disabled={product.stock === 0 || isAddingToCart}
      >
        <ShoppingCart className="h-5 w-5 mr-2" />
        Add to Cart
      </Button>

      <div className="space-y-3 pt-4">
        <div className="flex items-center gap-3 text-sm">
          <Truck className="h-5 w-5 text-muted-foreground" />
          <span>Free shipping on orders over EGP 500</span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <Shield className="h-5 w-5 text-muted-foreground" />
          <span>1 year warranty</span>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="font-semibold mb-2">Description</h3>
        <p className="text-muted-foreground leading-relaxed">
          {product.description}
        </p>
      </div>
    </div>
  );
};

export default ProductDetailsContent;
