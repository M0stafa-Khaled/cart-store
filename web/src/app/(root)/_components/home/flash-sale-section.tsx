"use client";

import { motion } from "framer-motion";
import { Clock, Flame } from "lucide-react";
import Productcard from "../products/product-card";
import { IProduct } from "@/interfaces";

export const FlashSaleSection = ({ products }: { products: IProduct[] }) => {
  return (
    <section className="py-16 bg-linear-to-br from-gray-50 via-red-50 to-white">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-full mb-4">
            <Flame className="w-5 h-5 animate-bounce" />
            <span className="font-semibold text-sm">Flash Sale</span>
            <Clock className="w-5 h-5 animate-spin" />
          </div>
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Limited Time Offers
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Grab these amazing deals before they&apos;re gone!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Productcard product={product} showBadge />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
