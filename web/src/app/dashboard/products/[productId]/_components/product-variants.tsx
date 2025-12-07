import { IProduct } from "@/interfaces";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";

interface ProductVariantsAndMetaDataProps {
  product: IProduct;
}
const ProductVariantsAndMetaData = ({ product }: ProductVariantsAndMetaDataProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Variants & Metadata
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {product.colors && product.colors.length > 0 && (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Available Colors
              </label>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-md border bg-muted"
                  >
                    <div
                      className="h-4 w-4 rounded-full border"
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-sm capitalize">{color}</span>
                  </div>
                ))}
              </div>
            </div>
            <Separator />
          </>
        )}

        {product.sizes && product.sizes.length > 0 && (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Available Sizes
              </label>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size, index) => (
                  <Badge key={index} variant="outline" className="text-sm">
                    {size}
                  </Badge>
                ))}
              </div>
            </div>
            <Separator />
          </>
        )}

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Created</span>
            <span className="text-sm font-medium">
              {new Date(product.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour12: true,
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Last Updated</span>
            <span className="text-sm font-medium">
              {new Date(product.updatedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour12: true,
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </span>
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">
            Product ID
          </label>
          <code className="block px-3 py-2 rounded-md bg-muted text-sm font-mono">
            {product.id}
          </code>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductVariantsAndMetaData;
