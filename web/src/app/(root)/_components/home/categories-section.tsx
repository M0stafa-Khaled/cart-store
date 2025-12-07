"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ICategory } from "@/interfaces";

export const CategoriesSection = ({
  categories,
}: {
  categories: ICategory[];
}) => {
  return (
    <section className="py-16 bg-linear-to-b from-slate-50 to-white">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Shop by Category
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Explore our wide range of categories and find exactly what you need
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                href={`/shop/products?category=${category.name}`}
                className="group block"
              >
                <div className="relative overflow-hidden rounded-2xl bg-white shadow-md hover:shadow-xl transition-all duration-300">
                  <div className="aspect-square relative">
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <h3 className="text-lg font-semibold mb-1">
                      {category.name}
                    </h3>
                    {category._count && (
                      <p className="text-sm text-white/80">
                        {category._count.products} Products
                      </p>
                    )}
                    <div className="mt-2 flex items-center text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      Shop Now <ArrowRight className="ml-1 w-4 h-4" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
