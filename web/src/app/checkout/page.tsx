"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import Loader from "@/components/ui/loader";
import { formatEGPPrice } from "@/utils/formatPrice";
import { ShoppingBag, ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { checkoutAction } from "@/actions/orders.actions";
import { getShippingAddressesAction } from "@/actions/shipping-addresses.actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { IShippingAddress } from "@/interfaces";
import { handleActionError } from "@/lib/error-handlers";
import CheckoutShippingAddress from "./_components/checkout-shipping-address";
import CheckoutPaymentMethod from "./_components/checkout-payment-method";
import CheckoutOrderItems from "./_components/checkout-order-items";

const CheckoutPage = () => {
  const router = useRouter();
  const { cartItems, isLoading, subTotal, discount, totalPrice, coupon } =
    useCart();

  const [paymentMethod, setPaymentMethod] = useState<"CASH" | "CREDIT_CARD">(
    "CASH"
  );
  const [selectedAddress, setSelectedAddress] = useState<string>("");
  const [shippingAddresses, setShippingAddresses] = useState<
    IShippingAddress[]
  >([]);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [shippingCost, setShippingCost] = useState(0);

  useEffect(() => {
    loadShippingAddresses();
  }, []);

  useEffect(() => {
    if (selectedAddress) {
      const address = shippingAddresses.find((a) => a.id === selectedAddress);
      if (address) {
        setShippingCost(address.city.shippingPrice);
      }
    }
  }, [selectedAddress, shippingAddresses]);

  const loadShippingAddresses = async () => {
    setIsLoadingAddresses(true);
    try {
      const res = await getShippingAddressesAction();
      if (res.success && res.data) {
        setShippingAddresses(res.data);
        if (res.data.length > 0) {
          setSelectedAddress(res.data[0].id);
        }
      } else throw res;
    } catch (error) {
      handleActionError(error);
    } finally {
      setIsLoadingAddresses(false);
    }
  };

  const handleCheckout = async () => {
    if (!selectedAddress) {
      toast.error("Please select a shipping address");
      return;
    }

    setIsProcessing(true);
    try {
      const res = await checkoutAction(
        {
          paymentMethod,
          shippingAddressId: selectedAddress,
        },
        {
          success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success`,
          cancell_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/cancel`,
        }
      );

      if (res.success && res.data) {
        if (paymentMethod === "CREDIT_CARD") {
          if ("checkoutUrl" in res.data) {
            window.location.href = res.data.checkoutUrl;
          } else throw res;
        } else {
          toast.success("Order placed successfully!");
          router.push("/profile/my-orders");
        }
      } else throw res;
    } catch (error) {
      handleActionError(error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading || isLoadingAddresses) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
          <div className="relative mb-8">
            <div className="absolute inset-0 blur-3xl rounded-full" />
            <ShoppingBag className="w-32 h-32 text-primary/20 relative" />
          </div>
          <h2 className="text-3xl font-bold mb-4 text-primary/60">
            Your cart is empty
          </h2>
          <p className="text-muted-foreground mb-8 max-w-md">
            Add some items to your cart before proceeding to checkout
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

  const finalTotal = totalPrice + shippingCost;

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Checkout</h1>
        <p className="text-muted-foreground">
          Complete your order in just a few steps
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <CheckoutShippingAddress
            shippingAddresses={shippingAddresses}
            selectedAddress={selectedAddress}
            setSelectedAddress={setSelectedAddress}
            loadShippingAddresses={loadShippingAddresses}
          />

          <CheckoutPaymentMethod
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
          />

          <CheckoutOrderItems />
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-4">
            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-4">Order Summary</h3>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
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

                {coupon && (
                  <div className="flex items-center gap-2 text-sm">
                    <Badge className="bg-primary">{coupon.code}</Badge>
                    <span className="text-xs text-muted-foreground">
                      applied
                    </span>
                  </div>
                )}

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-medium">
                    {shippingCost > 0
                      ? formatEGPPrice(shippingCost)
                      : "Select address"}
                  </span>
                </div>

                <Separator />

                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Total</span>
                  <span className="text-2xl font-bold text-primary">
                    {formatEGPPrice(finalTotal)}
                  </span>
                </div>
              </div>

              <Button
                className="w-full mt-6 gap-2 bg-main hover:bg-main/90"
                size="lg"
                onClick={handleCheckout}
                disabled={
                  isProcessing ||
                  !selectedAddress ||
                  shippingAddresses.length === 0
                }
              >
                {isProcessing ? (
                  <>
                    <Loader />
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    Place Order
                  </>
                )}
              </Button>

              <div className="mt-4 space-y-2 text-xs text-muted-foreground">
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

export default CheckoutPage;
