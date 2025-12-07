export const formatEGPPrice = (price: number) => {
  return Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "EGP",
  }).format(price);
};
