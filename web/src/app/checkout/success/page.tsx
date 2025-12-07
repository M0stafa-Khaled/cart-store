"use client";

import { useEffect, useState } from "react";
import { useSearchParams, notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  Package,
  ArrowRight,
  Home,
  Mail,
  CreditCard,
  Sparkles,
  ShoppingBag,
  MapPin,
} from "lucide-react";
import Link from "next/link";
import Loader from "@/components/ui/loader";
import { getMyOrderByIdAction } from "@/actions/orders.actions";
import { IOrder } from "@/interfaces";
import { formatEGPPrice } from "@/utils/formatPrice";

const CheckoutSuccessPage = () => {
  const searchParams = useSearchParams();
  const [showConfetti, setShowConfetti] = useState(false);
  const [order, setOrder] = useState<IOrder | null>(null);
  const [isLoadingOrder, setIsLoadingOrder] = useState(true);

  const orderId = searchParams.get("order_id");

  useEffect(() => {
    setShowConfetti(true);

    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        setIsLoadingOrder(false);
        return;
      }

      try {
        const res = await getMyOrderByIdAction(orderId);
        if (res.success && res.data) {
          setOrder(res.data);
        } else {
          throw res;
        }
      } catch (_) {
        notFound();
      } finally {
        setIsLoadingOrder(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (isLoadingOrder)
    return (
      <div className="flex items-center justify-center py-8">
        <Loader />
      </div>
    );

  if (!order) return notFound();

  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 via-emerald-50 to-teal-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-200/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-200/30 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-200/20 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-${Math.random() * 20}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`,
              }}
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{
                  backgroundColor: [
                    "#10b981",
                    "#059669",
                    "#14b8a6",
                    "#0d9488",
                    "#f59e0b",
                    "#ef4444",
                  ][Math.floor(Math.random() * 6)],
                  transform: `rotate(${Math.random() * 360}deg)`,
                }}
              />
            </div>
          ))}
        </div>
      )}

      <div className="container py-12 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 transition-all duration-1000 opacity-100 translate-y-0">
            <div className="relative inline-block mb-6">
              {/* Animated rings */}
              <div className="absolute inset-0 animate-ping">
                <div className="w-32 h-32 rounded-full bg-green-500/20" />
              </div>
              <div className="absolute inset-0 animate-pulse delay-300">
                <div className="w-32 h-32 rounded-full bg-green-500/10" />
              </div>

              <div className="relative bg-linear-to-br from-green-500 to-emerald-600 w-32 h-32 rounded-full flex items-center justify-center shadow-2xl shadow-green-500/50 animate-scale-in">
                <CheckCircle2 className="w-16 h-16 text-white animate-check-draw" />
              </div>

              <Sparkles className="absolute -top-2 -right-2 w-8 h-8 text-yellow-400 animate-bounce" />
              <Sparkles className="absolute -bottom-2 -left-2 w-6 h-6 text-yellow-400 animate-bounce delay-300" />
            </div>

            <h1 className="text-5xl font-bold mb-4 bg-linear-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Payment Successful!
            </h1>
            <p className="text-xl text-gray-600 mb-2">
              Thank you for your purchase
            </p>
            <p className="text-sm text-gray-500">
              Your order has been confirmed and will be shipped soon
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card
              className={`p-8 bg-white/80 backdrop-blur-sm border-green-100 shadow-xl hover:shadow-2xl transition-all duration-500 opacity-100 translate-x-0`}
              style={{ transitionDelay: "200ms" }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-linear-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Order Confirmed
                </h2>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-linear-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    Order Number
                  </p>
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-green-600 shrink-0" />
                    <code className="text-sm font-mono text-green-700 break-all">
                      {order.orderNumber}
                    </code>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Items</p>
                      <p className="text-lg font-semibold text-gray-800">
                        {order.orderItems.length}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Total</p>
                      <p className="text-lg font-semibold text-green-600">
                        {formatEGPPrice(order.totalPrice)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium text-gray-800 mb-1">
                        Shipping To
                      </p>
                      <p className="text-sm text-gray-600">
                        {order.shippingAddress.address},{" "}
                        {order.shippingAddress.city.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {order.shippingAddress.phone}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-linear-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-100">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-purple-600" />
                    <span className="font-medium text-gray-800">
                      Payment Status
                    </span>
                  </div>
                  <Badge className="bg-green-500 hover:bg-green-600">
                    {order.isPaid ? "Paid" : "Pending"}
                  </Badge>
                </div>

                <div className="flex items-start gap-3 p-4 bg-green-50 rounded-xl border border-green-100">
                  <Mail className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium text-gray-800 mb-1">
                      Confirmation Email Sent
                    </p>
                    <p className="text-sm text-gray-600">
                      We&apos;ve sent a confirmation email with your order
                      details and tracking information
                    </p>
                  </div>
                </div>

                <div className="pt-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span>Order processing started</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse delay-300" />
                    <span>Payment verified</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-2 h-2 rounded-full bg-gray-300" />
                    <span>Preparing for shipment</span>
                  </div>
                </div>
              </div>
            </Card>

            <Card
              className={`p-8 bg-white/80 backdrop-blur-sm border-emerald-100 shadow-xl hover:shadow-2xl transition-all duration-500 opacity-100 translate-x-0`}
              style={{ transitionDelay: "400ms" }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-linear-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">
                  What&apos;s Next?
                </h2>
              </div>

              <div className="space-y-4">
                <div className="group p-4 bg-linear-to-br from-emerald-50 to-teal-50 rounded-xl border border-emerald-100 hover:border-emerald-300 transition-all cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
                      1
                    </div>
                    <p className="font-medium text-gray-800">
                      Track your order
                    </p>
                  </div>
                  <p className="text-sm text-gray-600 mt-2 ml-11">
                    Monitor your shipment status in real-time
                  </p>
                </div>

                <div className="group p-4 bg-linear-to-br from-emerald-50 to-teal-50 rounded-xl border border-emerald-100 hover:border-emerald-300 transition-all cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
                      2
                    </div>
                    <p className="font-medium text-gray-800">
                      Prepare for delivery
                    </p>
                  </div>
                  <p className="text-sm text-gray-600 mt-2 ml-11">
                    Estimated delivery: 3-5 business days
                  </p>
                </div>

                <div className="group p-4 bg-linear-to-br from-emerald-50 to-teal-50 rounded-xl border border-emerald-100 hover:border-emerald-300 transition-all cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
                      3
                    </div>
                    <p className="font-medium text-gray-800">Enjoy!</p>
                  </div>
                  <p className="text-sm text-gray-600 mt-2 ml-11">
                    We hope you love your purchase
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Action Buttons */}
          <Card
            className={`p-8 bg-white/80 backdrop-blur-sm border-gray-200 shadow-xl transition-all duration-500 opacity-100 translate-y-0`}
            style={{ transitionDelay: "600ms" }}
          >
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/profile/my-orders" className="flex-1">
                <Button
                  size="lg"
                  className="w-full gap-2 bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 transition-all duration-300 group"
                >
                  <Package className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  View Order Details
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>

              <Link href="/" className="flex-1">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full gap-2 border-2 border-gray-300 hover:border-green-500 hover:bg-green-50 transition-all duration-300 group"
                >
                  <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  Continue Shopping
                </Button>
              </Link>
            </div>

            <Separator className="my-6" />

            <div className="text-center">
              <p className="text-sm text-gray-600 mb-4">
                Need help with your order?
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <Link
                  href="/support"
                  className="text-green-600 hover:text-green-700 font-medium hover:underline transition-colors"
                >
                  Contact Support
                </Link>
                <span className="text-gray-300">•</span>
                <Link
                  href="/faq"
                  className="text-green-600 hover:text-green-700 font-medium hover:underline transition-colors"
                >
                  FAQs
                </Link>
                <span className="text-gray-300">•</span>
                <Link
                  href="/returns"
                  className="text-green-600 hover:text-green-700 font-medium hover:underline transition-colors"
                >
                  Return Policy
                </Link>
              </div>
            </div>
          </Card>

          {/* Trust Badges */}
          <div
            className={`mt-8 grid grid-cols-3 gap-4 transition-all duration-500 opacity-100 translate-y-0`}
            style={{ transitionDelay: "800ms" }}
          >
            <div className="text-center p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-xs font-semibold text-gray-700">
                Secure Payment
              </p>
            </div>
            <div className="text-center p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Package className="w-6 h-6 text-emerald-600" />
              </div>
              <p className="text-xs font-semibold text-gray-700">
                Fast Shipping
              </p>
            </div>
            <div className="text-center p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200">
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Mail className="w-6 h-6 text-teal-600" />
              </div>
              <p className="text-xs font-semibold text-gray-700">
                24/7 Support
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes confetti {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }

        @keyframes scale-in {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes check-draw {
          0% {
            stroke-dashoffset: 100;
          }
          100% {
            stroke-dashoffset: 0;
          }
        }

        .animate-confetti {
          animation: confetti linear forwards;
        }

        .animate-scale-in {
          animation: scale-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        .animate-check-draw {
          stroke-dasharray: 100;
          animation: check-draw 0.6s ease-out 0.3s forwards;
        }

        .delay-300 {
          animation-delay: 300ms;
        }

        .delay-500 {
          animation-delay: 500ms;
        }

        .delay-1000 {
          animation-delay: 1000ms;
        }
      `}</style>
    </div>
  );
};

export default CheckoutSuccessPage;
