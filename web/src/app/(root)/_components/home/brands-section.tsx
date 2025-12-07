"use client";

import LogoLoop from "@/components/LogoLoop";
import { IBrand } from "@/interfaces";
import { motion } from "framer-motion";
import Image from "next/image";

export const BrandsSection = ({
  brands,
}: {
  brands: IBrand[];
}) => {
  return (
    <section className="py-16 bg-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12 container"
      >
        <h2 className="text-4xl font-bold text-slate-900 mb-4">Top Brands</h2>
        <p className="text-slate-600 max-w-2xl mx-auto">
          Shop from the world&apos;s leading brands
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <LogoLoop
          logos={brands.map((brand) => ({
            node: (
              <Image
                src={brand.image}
                alt={brand.name}
                width={200}
                height={200}
              />
            ),
            href: `/shop/products?brand=${brand.name}`,
            title: brand.name,
            ariaLabel: brand.name,
          }))}
          speed={100}
          direction="left"
          logoHeight={128}
          gap={40}
          hoverSpeed={0}
          scaleOnHover
          fadeOut
          fadeOutColor="#fff"
          ariaLabel="Top Brands"
        />
      </motion.div>
    </section>
  );
};
