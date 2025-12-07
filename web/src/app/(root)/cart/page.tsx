"use client";

import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Loader from "@/components/ui/loader";
import { formatEGPPrice } from "@/utils/formatPrice";
import { ShoppingBag, ArrowRight, Package } from "lucide-react";
import Link from "next/link";
import CartItems from "./_components/cart-items";
import CartCoupon from "./_components/cart-coupon";

const CartPage = () => {
  const { cartItems, isLoading, subTotal, discount, totalPrice, itemCount } =
    useCart();

  if (isLoading && cartItems.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container py-16">
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
          <div className="relative mb-8">
            <div className="absolute inset-0 blur-3xl rounded-full" />
            <ShoppingBag className="w-32 h-32 text-primary/20 relative" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Your cart is empty</h2>
          <p className="text-muted-foreground mb-8 max-w-md">
            Looks like you haven&apos;t added anything to your cart yet. Start
            shopping to fill it up!
          </p>
          <Link href="/shop/products">
            <Button size="lg" className="gap-2 bg-main hover:bg-main/90">
              Start Shopping
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Shopping Cart</h1>
        <p className="text-muted-foreground">
          {itemCount} {itemCount === 1 ? "item" : "items"} in your cart
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <CartItems />
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-4 space-y-4">
            <CartCoupon />

            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-primary" />
                Order Summary
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Subtotal ({itemCount} items)
                  </span>
                  <span className="font-medium">
                    {formatEGPPrice(subTotal)}
                  </span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Discount</span>
                    <span className="font-medium text-green-600">
                      -{formatEGPPrice(discount)}
                    </span>
                  </div>
                )}

                <Separator />

                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Total</span>
                  <span className="text-2xl font-bold text-primary">
                    {formatEGPPrice(totalPrice)}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Button
                  className="w-full gap-2 bg-main hover:bg-main/90"
                  size="lg"
                  asChild
                >
                  <Link href="/checkout" className="block mt-6">
                    Proceed to Checkout
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>

                <Link href="/shop/products" className="block mt-3">
                  <Button
                    variant="outline"
                    className="w-full bg-main hover:bg-main/90"
                  >
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </Card>

            <Card className="p-4 bg-muted/50">
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span>Secure checkout</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span>Easy returns within 30 days</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
