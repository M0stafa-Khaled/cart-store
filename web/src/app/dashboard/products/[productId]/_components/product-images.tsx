import { IProduct } from "@/interfaces";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Package } from "lucide-react";

interface ProductImagesProps {
  product: IProduct;
}

const ProductImages = ({ product }: ProductImagesProps) => {
  const hasDiscount =
    product.discountValue > 0 && product.priceAfterDiscount < product.price;
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Product Media
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Main Image */}
        <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-muted">
          <Image
            src={product.imageCover}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
            priority
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

        {/* Additional Images */}
        {product.images && product.images.length > 0 && (
          <div className="grid grid-cols-4 gap-3">
            {product.images.map((image, index) => (
              <div
                key={index}
                className="relative aspect-square max-w-[120px] overflow-hidden rounded-md border bg-muted hover:border-primary transition-colors cursor-pointer"
              >
                <Image
                  src={image || "/product-placeholder.webp"}
                  alt={`${product.title} - ${index + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductImages;
