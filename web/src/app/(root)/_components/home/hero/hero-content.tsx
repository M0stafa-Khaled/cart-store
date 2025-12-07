"use client";

import { motion } from "framer-motion";
import { ShoppingBag, ArrowRight } from "lucide-react";
import Link from "next/link";

const STATS = [
  { value: "500+", label: "Premium Products" },
  { value: "50K+", label: "Happy Customers" },
  { value: "4.9★", label: "Average Rating" },
];

export const HeroContent = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="space-y-8"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="inline-block"
      >
        <span className="px-4 py-2 bg-linear-to-r from-main to-rose-600 text-white text-sm font-medium rounded-full shadow-lg">
          New Collection 2025
        </span>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="text-6xl lg:text-7xl font-bold leading-tight"
      >
        <span className="bg-linear-to-r from-slate-900 via-slate-700 to-slate-900 bg-clip-text text-transparent">
          Elevate Your
        </span>
        <br />
        <span className="bg-linear-to-r from-main to-rose-600 bg-clip-text text-transparent">
          Style Journey
        </span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="text-xl text-slate-800 leading-relaxed max-w-lg"
      >
        Discover curated collections of premium products designed for those who
        appreciate quality, craftsmanship, and timeless elegance.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="flex flex-wrap gap-4"
      >
        <motion.button whileTap={{ scale: 0.95 }}>
          <Link
            href="/shop/products"
            className="group px-8 py-4 bg-linear-to-r from-main to-rose-600 text-white font-semibold rounded-2xl shadow-xl flex items-center gap-2 transition-all hover:shadow-2xl"
          >
            <ShoppingBag className="w-5 h-5" />
            Shop Now
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.button>

        <motion.button whileTap={{ scale: 0.95 }}>
          <Link
            href="/shop/products"
            className="px-8 py-4 bg-white text-slate-900 font-semibold rounded-2xl shadow-lg border-2 border-slate-200 hover:border-orange-300 transition-all"
          >
            Explore Collections
          </Link>
        </motion.button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="flex gap-8 pt-8"
      >
        {STATS.map((stat, index) => (
          <div key={index}>
            <div className="text-3xl font-bold text-slate-900">
              {stat.value}
            </div>
            <div className="text-sm text-slate-600">{stat.label}</div>
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
};
