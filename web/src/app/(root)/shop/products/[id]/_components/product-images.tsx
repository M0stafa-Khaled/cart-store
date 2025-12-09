"use client";

import { Badge } from "@/components/ui/badge";
import { IProduct } from "@/interfaces";
import Image from "next/image";
import { useState } from "react";

const ProductImages = ({ product }: { product: IProduct }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const images = [product.imageCover, ...(product.images || [])];
  const hasDiscount =
    product.discountValue > 0 && product.priceAfterDiscount < product.price;

  return (
    <div className="space-y-4">
      <div className="relative aspect-square rounded-lg overflow-hidden bg-white">
        <Image
          src={images[selectedImage] || "/product-placeholder.webp"}
          alt={product.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-contain object-center"
          priority
          loading="eager"
        />
        {hasDiscount && (
          <div className="absolute top-4 right-4">
            <Badge className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 text-sm font-semibold">
              {product.discountType === "PERCENTAGE"
                ? `-${product.discountValue}%`
                : `-$${product.discountValue}`}
            </Badge>
          </div>
        )}
      </div>
      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`relative aspect-square rounded-lg overflow-hidden border-2 bg-white transition-all ${
                selectedImage === index
                  ? "border-main"
                  : "border-transparent hover:border-gray-300"
              }`}
            >
              <Image
                src={image || "/product-placeholder.webp"}
                alt={`${product.title} ${index + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-contain object-center"
                priority
                loading="eager"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImages;
