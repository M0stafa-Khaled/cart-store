import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useCart } from "@/context/CartContext";
import { formatEGPPrice } from "@/utils/formatPrice";
import { Package } from "lucide-react";
import Image from "next/image";

const CheckoutOrderItems = () => {
  const { cartItems } = useCart();
  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Package className="w-5 h-5 text-main" />
        </div>
        <div>
          <h2 className="text-xl font-semibold">Order Items</h2>
          <p className="text-sm text-muted-foreground">
            {cartItems.length} item{cartItems.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {cartItems.map((item) => (
          <div key={item.id} className="flex gap-4 p-3 rounded-lg border">
            <div className="relative w-16 h-16 shrink-0 rounded-lg overflow-hidden bg-muted">
              <Image
                src={item.product.imageCover}
                alt={item.product.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-contain object-center"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium line-clamp-1 text-sm">
                {item.product.title}
              </h3>
              <div className="flex flex-wrap gap-1 mt-1">
                {item.color && (
                  <Badge variant="outline" className="text-xs">
                    {item.color}
                  </Badge>
                )}
                {item.size && (
                  <Badge variant="outline" className="text-xs">
                    {item.size}
                  </Badge>
                )}
                <Badge variant="outline" className="text-xs">
                  Qty: {item.quantity}
                </Badge>
              </div>
            </div>
            <div className="text-right">
              <div className="font-semibold text-sm">
                {formatEGPPrice(item.total)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default CheckoutOrderItems;
