"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface FloatingPromoCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  position: "top-right" | "bottom-left";
  delay?: number;
  gradientFrom: string;
  gradientTo: string;
}

export function FloatingPromoCard({
  icon,
  title,
  description,
  position,
  delay = 0,
  gradientFrom,
  gradientTo,
}: FloatingPromoCardProps) {
  const positionClasses = {
    "top-right": "-top-12 -right-12",
    "bottom-left": "-bottom-12 -left-12",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 + delay, duration: 0.6 }}
      className={`absolute ${positionClasses[position]} hidden lg:block`}
    >
      <motion.div
        animate={{ y: [0, position === "top-right" ? 10 : -10, 0] }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          delay,
        }}
        className="p-4 bg-white rounded-2xl shadow-xl"
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 bg-linear-to-br ${gradientFrom} ${gradientTo} rounded-xl flex items-center justify-center text-white font-bold text-xl`}
          >
            {icon}
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-900">{title}</div>
            <div className="text-xs text-slate-600">{description}</div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
