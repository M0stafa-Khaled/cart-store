import { DiscountType } from "@prisma/client";

export const calcDiscount = (
  discountType: DiscountType,
  discountValue: number,
  price: number,
) => {
  if (discountType === "PERCENTAGE") {
    return price - price * (discountValue / 100);
  } else {
    return price - discountValue;
  }
};
