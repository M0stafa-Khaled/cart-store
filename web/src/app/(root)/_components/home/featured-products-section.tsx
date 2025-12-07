"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import Productcard from "../products/product-card";
import { IProduct } from "@/interfaces";

export const FeaturedProductsSection = ({
  products,
}: {
  products: IProduct[];
}) => {
  return (
    <section className="py-16 bg-white">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-600 px-4 py-2 rounded-full mb-4">
            <Star className="w-4 h-4 fill-current" />
            <span className="font-semibold text-sm">Featured</span>
          </div>
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Best Selling Products
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Discover our most popular items loved by thousands of customers
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
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
