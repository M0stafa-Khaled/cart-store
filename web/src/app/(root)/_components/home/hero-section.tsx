"use client";

import { useState } from "react";
import { HeroContent } from "./hero/hero-content";
import { ProductCarousel } from "./hero/product-carousel";
import { AnimatedBackground } from "./hero/animated-background";
import { IProduct } from "@/interfaces";

export const HeroSection = ({ products }: { products: IProduct[] }) => {
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;

    // Increased multiplier for more dramatic movement
    const x = (clientX / innerWidth - 0.5) * 150;
    const y = (clientY / innerHeight - 0.5) * 150;

    setMousePosition({ x, y });
  };

  return (
    <section
      className="relative min-h-screen w-full overflow-hidden bg-linear-to-br from-slate-50 via-white to-blue-50/30"
      onMouseMove={handleMouseMove}
    >
      <AnimatedBackground mousePosition={mousePosition} />

      <div className="relative z-10 container pt-6 pb-20 lg:pt-16 lg:pb-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <HeroContent />
          <ProductCarousel products={products} />
        </div>
      </div>
    </section>
  );
};
