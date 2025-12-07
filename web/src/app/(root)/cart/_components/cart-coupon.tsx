import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { formatEGPPrice } from "@/utils/formatPrice";
import { Tag, X } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/context/CartContext";

const CartCoupon = () => {
  const [couponCode, setCouponCode] = useState("");
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  const { coupon, applyCoupon, removeCoupon } = useCart();

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setIsApplyingCoupon(true);
    await applyCoupon(couponCode);
    setCouponCode("");
    setIsApplyingCoupon(false);
  };

  const handleRemoveCoupon = async () => {
    await removeCoupon();
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Tag className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-lg">Apply Coupon</h3>
      </div>

      {coupon ? (
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Badge className="bg-primary">{coupon.code}</Badge>
              <span className="text-sm font-medium">
                {coupon.discountType === "PERCENTAGE"
                  ? `${coupon.discountValue}% OFF`
                  : `${formatEGPPrice(coupon.discountValue)} OFF`}
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 bg-main hover:bg-main/90"
              onClick={handleRemoveCoupon}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Coupon applied successfully!
          </p>
        </div>
      ) : (
        <div className="flex gap-2">
          <Input
            placeholder="Enter coupon code"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
            disabled={isApplyingCoupon}
          />
          <Button
            onClick={handleApplyCoupon}
            disabled={!couponCode.trim() || isApplyingCoupon}
            className="bg-main hover:bg-main/90"
          >
            Apply
          </Button>
        </div>
      )}
    </Card>
  );
};

export default CartCoupon;
