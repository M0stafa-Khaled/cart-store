import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useCart } from "@/context/CartContext";
import { formatEGPPrice } from "@/utils/formatPrice";
import { Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const CartItems = () => {
  const { cartItems, removeFromCart, isLoading, updateCartItem } = useCart();
  return cartItems.map((item) => (
    <Card
      key={item.id}
      className="p-4 hover:shadow-lg transition-shadow duration-300"
    >
      <div className="flex gap-4">
        <div className="relative w-24 h-24 sm:w-32 sm:h-32 shrink-0 rounded-lg overflow-hidden bg-muted">
          <Image
            src={item.product.imageCover}
            alt={item.product.title}
            fill
            className="object-cover"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between gap-2 mb-2">
            <Link
              href={`/shop/products/${item.product.id}`}
              className="font-semibold text-lg hover:text-primary transition-colors line-clamp-2"
            >
              {item.product.title}
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={() => removeFromCart(item.id)}
              disabled={isLoading}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex flex-wrap gap-2 mb-3">
            {item.color && (
              <Badge variant="secondary" className="gap-1">
                <div
                  className="w-3 h-3 rounded-full border"
                  style={{ backgroundColor: item.color }}
                />
                {item.color}
              </Badge>
            )}
            {item.size && <Badge variant="secondary">Size: {item.size}</Badge>}
          </div>

          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-primary">
                {formatEGPPrice(item.price)}
              </span>
              {item.product.priceAfterDiscount < item.product.price && (
                <span className="text-sm text-muted-foreground line-through">
                  {formatEGPPrice(item.product.price)}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => updateCartItem(item.id, item.quantity - 1)}
                disabled={item.quantity <= 1 || isLoading}
              >
                <Minus className="w-4 h-4" />
              </Button>
              <span className="w-12 text-center font-semibold">
                {item.quantity}
              </span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => updateCartItem(item.id, item.quantity + 1)}
                disabled={item.quantity >= item.product.stock || isLoading}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Item Total</span>
              <span className="text-lg font-bold">
                {formatEGPPrice(item.total)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  ));
};

export default CartItems;
