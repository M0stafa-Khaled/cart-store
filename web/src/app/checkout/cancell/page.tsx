"use client";

import { notFound, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  XCircle,
  ArrowLeft,
  Home,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";

const CancelContent = () => {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const orderId = searchParams.get("order_id");

  if (!orderId) return notFound();

  return (
    <div className="min-h-screen bg-linear-to-br from-red-50 via-orange-50 to-yellow-50 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-red-200/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-200/30 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-yellow-200/20 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      <div className="container py-12 relative z-10">
        <div className="max-w-2xl mx-auto">
          <div
            className={`text-center mb-12 transition-all duration-1000 opacity-100 translate-y-0`}
          >
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 animate-ping">
                <div className="w-32 h-32 rounded-full bg-red-500/20" />
              </div>
              <div className="absolute inset-0 animate-pulse delay-300">
                <div className="w-32 h-32 rounded-full bg-red-500/10" />
              </div>

              <div className="relative bg-linear-to-br from-red-500 to-orange-600 w-32 h-32 rounded-full flex items-center justify-center shadow-2xl shadow-red-500/50 animate-scale-in">
                <XCircle className="w-16 h-16 text-white" />
              </div>
            </div>

            <h1 className="text-5xl font-bold mb-4 bg-linear-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
              Payment Cancelled
            </h1>
            <p className="text-xl text-gray-600 mb-2">
              Your payment was not completed
            </p>
            <p className="text-sm text-gray-500">
              Don&apos;t worry, no charges were made to your account
            </p>
          </div>

          <Card
            className={`p-8 bg-white/80 backdrop-blur-sm border-orange-100 shadow-xl mb-8 transition-all duration-500 opacity-100 translate-y-0`}
            style={{ transitionDelay: "200ms" }}
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              What happened?
            </h2>
            <p className="text-gray-600 mb-6">
              The payment process was cancelled before completion. This could be
              because:
            </p>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-red-500 mt-2" />
                <span className="text-gray-600">
                  You clicked the back button or closed the payment window
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-red-500 mt-2" />
                <span className="text-gray-600">
                  The payment session expired due to inactivity
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-red-500 mt-2" />
                <span className="text-gray-600">
                  You chose to cancel the transaction
                </span>
              </li>
            </ul>

            {(orderId || error) && (
              <div className="space-y-3 mb-6">
                {error && (
                  <div className="p-4 bg-red-50 rounded-xl border border-red-200 flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium text-red-800 mb-1">
                        Error Details
                      </p>
                      <p className="text-sm text-red-600">
                        {error
                          .replace(/_/g, " ")
                          .replace(/\b\w/g, (l) => l.toUpperCase())}
                      </p>
                    </div>
                  </div>
                )}

                {orderId && (
                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                      Order Reference
                    </p>
                    <code className="text-sm font-mono text-gray-700 break-all">
                      {orderId}
                    </code>
                  </div>
                )}
              </div>
            )}

            <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
              <p className="text-sm text-blue-800">
                <strong>Good news:</strong> Your cart items are still saved! You
                can return to checkout whenever you&apos;re ready.
              </p>
            </div>
          </Card>

          {/* Action Buttons */}
          <div
            className={`flex flex-col sm:flex-row gap-4 transition-all duration-500 opacity-100 translate-y-0`}
            style={{ transitionDelay: "400ms" }}
          >
            <Link href="/cart" className="flex-1">
              <Button
                size="lg"
                className="w-full gap-2 bg-main hover:bg-main/90 text-white shadow-lg shadow-main/30 hover:shadow-xl hover:shadow-main/40 transition-all duration-300 group"
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                Return to Cart
              </Button>
            </Link>

            <Link href="/checkout" className="flex-1">
              <Button
                size="lg"
                variant="outline"
                className="w-full gap-2 border-2 border-main hover:border-main hover:bg-main/10 transition-all duration-300 group"
              >
                <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                Try Again
              </Button>
            </Link>

            <Link href="/" className="flex-1">
              <Button
                size="lg"
                variant="outline"
                className="w-full gap-2 border-2 border-gray-300 hover:border-main hover:bg-main/10 transition-all duration-300 group"
              >
                <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Continue Shopping
              </Button>
            </Link>
          </div>

          <div
            className={`mt-8 text-center transition-all duration-500 opacity-100 translate-y-0`}
            style={{ transitionDelay: "600ms" }}
          >
            <p className="text-sm text-gray-600 mb-4">
              Need help completing your order?
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Link
                href="/support"
                className="text-main hover:text-main/90 font-medium hover:underline transition-colors"
              >
                Contact Support
              </Link>
              <span className="text-gray-300">•</span>
              <Link
                href="/faq"
                className="text-main hover:text-main/90 font-medium hover:underline transition-colors"
              >
                Payment FAQs
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style>{`
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

        .animate-scale-in {
          animation: scale-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
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

const CheckoutCancelPage = () => {
  return <CancelContent />;
};

export default CheckoutCancelPage;
