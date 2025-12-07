import CouponDialog from "./coupon-dialog";

const CouponsHeader = () => {
  return (
    <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Coupons</h2>
        <p className="text-muted-foreground">
          Manage your coupons here. You can add, edit, or delete coupons.
        </p>
      </div>
      <CouponDialog />
    </div>
  );
};

export default CouponsHeader;
