"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CarosuleProductCard } from "./carosule-product-card";
import { CarouselControls } from "./carousel-controls";
import { FloatingPromoCard } from "./floating-promo-card";
import { IProduct } from "@/interfaces";

interface ProductCarouselProps {
  products: IProduct[];
}

export const ProductCarousel = ({ products }: ProductCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % products.length);
    }, 10000);
    return () => clearInterval(interval);
  }, [products.length]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % products.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + products.length) % products.length);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 1, ease: "easeInOut" }}
      className="relative"
    >
      <div className="relative h-[600px] w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.8, rotateY: -20 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            exit={{ opacity: 0, scale: 0.8, rotateY: 20 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <CarosuleProductCard product={products[currentIndex]} />
          </motion.div>
        </AnimatePresence>

        <CarouselControls
          onPrev={prevSlide}
          onNext={nextSlide}
          currentIndex={currentIndex}
          totalItems={products.length}
          onDotClick={setCurrentIndex}
        />
      </div>

      {/* Floating Promo Cards */}
      <FloatingPromoCard
        icon="✓"
        title="Free Shipping"
        description="On orders over $100"
        position="bottom-left"
        gradientFrom="from-emerald-400"
        gradientTo="to-teal-600"
      />

      <FloatingPromoCard
        icon="%"
        title="30% Off"
        description="First purchase"
        position="top-right"
        delay={0.2}
        gradientFrom="from-orange-400"
        gradientTo="to-rose-600"
      />
    </motion.div>
  );
};
