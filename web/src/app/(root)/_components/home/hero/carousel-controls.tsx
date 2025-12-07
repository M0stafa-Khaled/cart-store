"use client";

import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CarouselControlsProps {
  onPrev: () => void;
  onNext: () => void;
  currentIndex: number;
  totalItems: number;
  onDotClick: (index: number) => void;
}

export const CarouselControls = ({
  onPrev,
  onNext,
  currentIndex,
  totalItems,
  onDotClick,
}: CarouselControlsProps) => {
  return (
    <>
      <motion.button
        whileHover={{ scale: 1.1, x: -5 }}
        whileTap={{ scale: 0.9 }}
        onClick={onPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-xl hover:bg-white transition-all"
        aria-label="Previous product"
      >
        <ChevronLeft className="w-6 h-6 text-slate-900" />
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.1, x: 5 }}
        whileTap={{ scale: 0.9 }}
        onClick={onNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-xl hover:bg-white transition-all"
        aria-label="Next product"
      >
        <ChevronRight className="w-6 h-6 text-slate-900" />
      </motion.button>

      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {Array.from({ length: totalItems }).map((_, index) => (
          <motion.button
            key={index}
            onClick={() => onDotClick(index)}
            className={`h-2 rounded-full transition-all ${
              index === currentIndex
                ? "w-8 bg-linear-to-r from-orange-600 to-rose-600"
                : "w-2 bg-slate-300 hover:bg-slate-400"
            }`}
            whileHover={{ scale: 1.2 }}
            aria-label={`Go to product ${index + 1}`}
          />
        ))}
      </div>
    </>
  );
};
