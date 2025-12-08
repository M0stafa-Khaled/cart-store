"use client";

import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { IProduct } from "@/interfaces";
import { formatEGPPrice } from "@/utils/formatPrice";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface ProductCardProps {
  product: IProduct;
}

export const CarosuleProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();
  const router = useRouter();

  const hasColor = product.colors?.length && product.colors.length > 0;
  const hasSize = product.sizes?.length && product.sizes.length > 0;

  const handleAddToCart = () => {
    if (hasColor || hasSize) {
      router.push(`/shop/products/${product.id}`);
      if (hasColor && hasSize)
        toast.info("Please select color and size", { position: "top-right" });
      else if (hasColor && !hasSize)
        toast.info("Please select color", { position: "top-right" });
      else if (!hasColor && hasSize)
        toast.info("Please select size", { position: "top-right" });
    } else {
      addToCart({
        productId: product.id,
        quantity: 1,
      });
    }
  };
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="relative h-full w-full bg-white rounded-3xl shadow-2xl overflow-hidden group cursor-pointer"
    >
      <div className="relative h-3/4 overflow-hidden">
        <motion.img
          src={product.imageCover}
          alt={product.title}
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileHover={{ opacity: 1, y: 0 }}
          className="absolute bottom-4 left-4 right-4"
        >
          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-xs font-medium rounded-full">
            {product.category.name}
          </span>
        </motion.div>
      </div>

      <div className="p-6 space-y-3">
        <div>
          <h3 className="font-semibold text-lg leading-tight line-clamp-2 text-slate-900">
            <Link href={`/shop/products/${product.id}`}>{product.title}</Link>
          </h3>
          <p className="text-muted-foreground text-xs">
            {product.description.length > 50
              ? product.description.substring(0, 50) + "..."
              : product.description}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold bg-linear-to-r from-main to-rose-600 bg-clip-text text-transparent">
            {formatEGPPrice(product.price)}
          </span>
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="p-3 bg-linear-to-r from-main to-rose-600 text-white rounded-full shadow-lg hover:shadow-xl transition-shadow"
            onClick={(e) => {
              e.stopPropagation();
              handleAddToCart();
            }}
          >
            <ShoppingBag className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};
