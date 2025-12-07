"use client";

import { motion, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";

interface AnimatedBackgroundProps {
  mousePosition: {
    x: number;
    y: number;
  };
}

export const AnimatedBackground = ({
  mousePosition,
}: AnimatedBackgroundProps) => {
  // Use spring animations for smooth movement
  const springConfig = { stiffness: 120, damping: 25 };

  const mouseX = useSpring(0, springConfig);
  const mouseY = useSpring(0, springConfig);

  useEffect(() => {
    mouseX.set(mousePosition.x);
    mouseY.set(mousePosition.y);
  }, [mousePosition.x, mousePosition.y, mouseX, mouseY]);

  // Create inverted values for opposite movement
  const invertedX = useTransform(mouseX, (value) => -value);
  const invertedY = useTransform(mouseY, (value) => -value);

  // Create half speed values for center orb
  const halfX = useTransform(mouseX, (value) => value * 0.5);
  const halfY = useTransform(mouseY, (value) => value * 0.5);

  // Additional movement variations
  const slowX = useTransform(mouseX, (value) => value * 0.7);
  const slowY = useTransform(mouseY, (value) => value * 0.7);
  const slowInvertedX = useTransform(mouseX, (value) => value * -0.6);
  const slowInvertedY = useTransform(mouseY, (value) => value * -0.6);

  return (
    <>
      {/* Top Right Orb - Warm Coral/Peach */}
      <motion.div
        className="pointer-events-none absolute top-20 right-20 w-[600px] h-[600px] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(233, 69, 96, 1) 0%, rgba(251, 113, 133, 0.7) 100%)",
          x: mouseX,
          y: mouseY,
        }}
      />

      {/* Bottom Left Orb - Cool Blue/Teal */}
      <motion.div
        className="pointer-events-none absolute bottom-20 left-20 w-[600px] h-[600px] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(147, 197, 253, 0.7) 0%, rgba(94, 234, 212, 0.7) 100%)",
          x: invertedX,
          y: invertedY,
        }}
      />

      {/* Center Accent Orb - Subtle Purple with pulse */}
      <motion.div
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(216, 180, 254, 0.5) 0%, rgba(251, 207, 232, 0.5) 100%)",
          x: halfX,
          y: halfY,
        }}
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{
          scale: { duration: 6, repeat: Infinity, ease: "easeInOut" },
        }}
      />

      {/* Additional Accent Orbs for more depth */}
      <motion.div
        className="pointer-events-none absolute top-1/3 right-1/3 w-[350px] h-[350px] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(253, 186, 116, 0.5) 0%, rgba(252, 165, 165, 0.5) 100%)",
          x: slowX,
          y: slowY,
        }}
      />

      <motion.div
        className="pointer-events-none absolute bottom-1/3 left-1/3 w-[350px] h-[350px] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(165, 243, 252, 0.5) 0%, rgba(167, 243, 208, 0.5) 100%)",
          x: slowInvertedX,
          y: slowInvertedY,
        }}
      />
    </>
  );
};
