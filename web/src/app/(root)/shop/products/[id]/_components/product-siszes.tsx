"use client";
import { Dispatch, SetStateAction } from "react";

interface ProductSizesProps {
  sizes: string[] | null;
  selectedSize: string;
  setSelectedSize: Dispatch<SetStateAction<string>>;
}

const ProductSizes = ({
  sizes,
  selectedSize,
  setSelectedSize,
}: ProductSizesProps) => {
  if (!sizes || sizes.length === 0) return null;
  return (
    <div>
      <label className="text-sm font-medium mb-2 block">
        Size: <span className="text-muted-foreground">{selectedSize}</span>
      </label>
      <div className="flex gap-2">
        {sizes.map((size) => (
          <button
            key={size}
            onClick={() => setSelectedSize(size)}
            className={`px-4 py-2 rounded-md border-2 transition-all ${
              selectedSize === size
                ? "border-primary bg-primary/10"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductSizes;
