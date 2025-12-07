"use client";

import { motion } from "framer-motion";
import { AlertTriangle, Home, RefreshCcw } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface ErrorPageProps {
  error?: {
    message?: string;
    code?: number | string;
  };
}

const ErrorPage = ({ error }: ErrorPageProps) => {
  const message = error?.message?.includes("undefined")
    ? "Internal Server Error"
    : error?.message?.includes("null")
      ? "Internal Server Error"
      : error?.message;
  const code = error?.code || 500;
  console.log(error);
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 bg-linear-to-b from-gray-50 to-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-lg"
      >
        <div className="relative bg-white/80 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl p-8 md:p-12 text-center overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-white/50 to-transparent" />

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-8 relative inline-block"
          >
            <div className="absolute inset-0 bg-red-100 rounded-full blur-xl opacity-50 animate-pulse" />
            <div className="relative bg-white p-4 rounded-full shadow-sm">
              <AlertTriangle className="w-12 h-12 text-red-500" />
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-6xl font-black text-transparent bg-clip-text bg-linear-to-r from-gray-900 via-gray-700 to-gray-900 mb-2"
          >
            {code}
          </motion.h1>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-2xl font-bold text-gray-800 mb-4"
          >
            Oops! Something went wrong
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed"
          >
            {message}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              onClick={() => {
                window.location.reload();
              }}
              variant="outline"
              size="lg"
              className="group border-gray-200 hover:border-gray-300 hover:bg-gray-50"
            >
              <RefreshCcw className="w-4 h-4 mr-2 group-hover:rotate-180 transition-transform duration-500" />
              Try Again
            </Button>

            <Button
              asChild
              size="lg"
              className="bg-main hover:bg-main/90 text-white shadow-lg shadow-gray-900/20 hover:shadow-gray-900/30 transition-all duration-300"
            >
              <Link href="/">
                <Home className="w-4 h-4 mr-2" />
                Back to Home
              </Link>
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default ErrorPage;
