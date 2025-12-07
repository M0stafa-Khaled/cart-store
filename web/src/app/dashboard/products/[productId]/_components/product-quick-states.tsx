import { IProduct } from "@/interfaces";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatEGPPrice } from "@/utils/formatPrice";
import {
  DollarSign,
  Package,
  Percent,
  ShoppingCart,
  Star,
  TrendingUp,
} from "lucide-react";

interface ProductQuickStatsProps {
  product: IProduct;
}
const ProductQuickStats = ({ product }: ProductQuickStatsProps) => {
  const hasDiscount =
    product.discountValue > 0 && product.priceAfterDiscount < product.price;
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Quick Stats
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Price</span>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex items-baseline gap-2">
            {hasDiscount ? (
              <>
                <span className="text-2xl font-bold text-green-600">
                  {formatEGPPrice(product.priceAfterDiscount)}
                </span>
                <span className="text-lg text-muted-foreground line-through">
                  {formatEGPPrice(product.price)}
                </span>
              </>
            ) : (
              <span className="text-2xl font-bold">
                {formatEGPPrice(product.price)}
              </span>
            )}
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Stock</span>
            <Package className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold">{product.stock}</span>
            <Badge
              variant={product.stock > 10 ? "default" : "destructive"}
              className={`text-xs ${product.stock > 10 ? "bg-green-600" : "bg-destructive"}`}
            >
              {product.stock > 10 ? "In Stock" : "Low Stock"}
            </Badge>
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Units Sold</span>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </div>
          <span className="text-2xl font-bold">{product.sold}</span>
        </div>

        <Separator />
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Discount</span>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </div>
          <span
            className={`font-bold ${!product.discountType ? "text-lg" : "text-2xl"}`}
          >
            {product.discountType ? (
              <>
                {product.discountType === "PERCENTAGE"
                  ? `${product.discountValue}%`
                  : `${formatEGPPrice(product.discountValue)}`}
              </>
            ) : (
              "No Discount"
            )}
          </span>
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Rating</span>
            <Star className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              <span className="text-2xl font-bold">
                {product.ratingAverage.toFixed(1)}
              </span>
            </div>
            <span className="text-sm text-muted-foreground">
              ({product.ratingQuantity} reviews)
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductQuickStats;
