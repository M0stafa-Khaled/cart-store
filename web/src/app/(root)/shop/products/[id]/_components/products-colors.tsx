"use client";
import { Dispatch, SetStateAction } from "react";

interface ProductColorsProps {
  colors: string[] | null;
  selectedColor: string;
  setSelectedColor: Dispatch<SetStateAction<string>>;
}

const ProductColors = ({
  colors,
  selectedColor,
  setSelectedColor,
}: ProductColorsProps) => {
  if (!colors || colors.length === 0) return null;
  return (
    <div>
      <label className="text-sm font-medium mb-2 block">
        Color: <span className="text-muted-foreground">{selectedColor}</span>
      </label>
      <div className="flex gap-2">
        {colors.map((color) => (
          <button
            key={color}
            onClick={() => setSelectedColor(color)}
            className={`px-4 py-2 rounded-md border-2 transition-all ${
              selectedColor === color
                ? `border-main bg-main/10`
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            {color}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductColors;
