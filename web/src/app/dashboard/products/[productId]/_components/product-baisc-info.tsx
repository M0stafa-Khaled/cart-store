import { IProduct } from "@/interfaces";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { Tag } from "lucide-react";

interface ProductBaiscInfoProps {
  product: IProduct;
}
const ProductBasicInfo = ({ product }: ProductBaiscInfoProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Tag className="h-5 w-5" />
          Product Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">
            Title
          </label>
          <p className="text-base font-semibold">{product.title}</p>
        </div>

        <Separator />

        <div className="space-2">
          <label className="text-sm font-medium text-muted-foreground">
            Description
          </label>
          <pre className="text-sm font-sans leading-relaxed">
            {product.description}
          </pre>
        </div>

        <Separator />

        <div className="grid grid-cols-2 gap-4">
          <div className="flex gap-2 items-center flex-wrap">
            <label className="text-sm font-medium text-muted-foreground">
              Category
            </label>
            <Badge variant="secondary" className="text-sm">
              {product.category.name}
            </Badge>
          </div>

          <div className="flex gap-2 items-center flex-wrap">
            <label className="text-sm font-medium text-muted-foreground">
              Sub-Category
            </label>
            <Badge variant="secondary" className="text-sm">
              {product.subCategory.name}
            </Badge>
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">
            Brand
          </label>
          <div className="flex items-center gap-2">
            <div className="relative h-8 w-8 overflow-hidden rounded border">
              <Image
                src={product.brand.image || "/product-placeholder.webp"}
                alt={product.brand.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
              />
            </div>
            <span className="font-medium">{product.brand.name}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductBasicInfo;
