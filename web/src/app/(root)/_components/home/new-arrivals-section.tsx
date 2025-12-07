"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import Productcard from "../products/product-card";
import { IProduct } from "@/interfaces";

export const NewArrivalsSection = ({ products }: { products: IProduct[] }) => {
  return (
    <section className="py-16 bg-linear-to-b from-white to-slate-50">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-800 px-4 py-2 rounded-full mb-4">
            <Sparkles className="w-4 h-4" />
            <span className="font-semibold text-sm">New Arrivals</span>
          </div>
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Fresh & Trending
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Check out our latest additions to the collection
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Productcard product={product} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
