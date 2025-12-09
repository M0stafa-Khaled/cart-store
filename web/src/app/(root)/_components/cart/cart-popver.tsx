import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart } from "lucide-react";
import { X } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatEGPPrice } from "@/utils/formatPrice";
import Image from "next/image";
import { truncateText } from "@/utils/truncateText";

const CartPopver = () => {
  const { cartItems, itemCount, subTotal, removeFromCart } = useCart();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {itemCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-600">
              {itemCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Shopping Cart</h3>
            <Badge variant="secondary">{itemCount} items</Badge>
          </div>
          <Separator />

          <div className="space-y-3 max-h-[300px] overflow-y-auto">
            {itemCount ? (
              cartItems.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <div className="h-16 w-16 rounded-md bg-muted overflow-hidden">
                    <Image
                      src={item.product.imageCover}
                      alt={item.product.title}
                      width={64}
                      height={64}
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      {truncateText(item.product.title, 25)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Qty: {item.quantity} × {formatEGPPrice(item.price)}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-center text-sm text-muted-foreground">
                Your cart is empty.
              </p>
            )}
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span className="font-semibold">{formatEGPPrice(subTotal)}</span>
            </div>
            <Button className="w-full bg-main hover:bg-main/90" asChild>
              <Link href="/cart">View Cart</Link>
            </Button>
            <Button className="w-full" variant="outline" asChild>
              <Link href="/checkout">Checkout</Link>
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default CartPopver;
