"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

interface ProductVariantsProps {
  form: UseFormReturn<any>;
  colorInput: string;
  sizeInput: string;
  onColorInputChange: (value: string) => void;
  onSizeInputChange: (value: string) => void;
  onAddColor: () => void;
  onAddSize: () => void;
  onRemoveColor: (index: number) => void;
  onRemoveSize: (index: number) => void;
}

export const ProductVariants = ({
  form,
  colorInput,
  sizeInput,
  onColorInputChange,
  onSizeInputChange,
  onAddColor,
  onAddSize,
  onRemoveColor,
  onRemoveSize,
}: ProductVariantsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Variants (Optional)</CardTitle>
        <CardDescription>
          Add available colors and sizes for this product.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <FormField
          control={form.control}
          name="colors"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Colors</FormLabel>
              <FormControl>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter color (e.g., Red, Blue)"
                      value={colorInput}
                      onChange={(e) => onColorInputChange(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          onAddColor();
                        }
                      }}
                    />
                    <Button type="button" onClick={onAddColor}>
                      Add
                    </Button>
                  </div>
                  {field.value && field.value.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {field.value.map((color: string, index: number) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="pl-3 pr-1 py-1 border border-gray-400"
                        >
                          {color}
                          <button
                            type="button"
                            onClick={() => onRemoveColor(index)}
                            className="ml-2 hover:bg-white rounded-full p-0.5"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="sizes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sizes</FormLabel>
              <FormControl>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter size (e.g., S, M, L, XL)"
                      value={sizeInput}
                      onChange={(e) => onSizeInputChange(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          onAddSize();
                        }
                      }}
                    />
                    <Button type="button" onClick={onAddSize}>
                      Add
                    </Button>
                  </div>
                  {field.value && field.value.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {field.value.map((size: string, index: number) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="pl-3 pr-1 py-1 border border-gray-400"
                        >
                          {size}
                          <button
                            type="button"
                            onClick={() => onRemoveSize(index)}
                            className="ml-2 hover:bg-white rounded-full p-0.5"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};
