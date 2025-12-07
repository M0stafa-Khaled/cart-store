import { getAllUserOrdersAction } from "@/actions/orders.actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatEGPPrice } from "@/utils/formatPrice";

const UserQuickState = async ({ userId }: { userId: string }) => {
  const { data } = await getAllUserOrdersAction(userId, {});
  const totalOrders = data?.length;
  const totalPrice = data?.reduce((acc, order) => acc + order.totalPrice, 0);
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Activity Overview</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap justify-center items-center gap-4 ">
        <div className="text-center p-4 bg-muted/50 rounded-lg">
          <div className="text-2xl font-bold">{totalOrders}</div>
          <div className="text-xs text-muted-foreground">Orders</div>
        </div>
        <div className="text-center p-4 bg-muted/50 rounded-lg">
          <div className="text-2xl font-bold">
            {formatEGPPrice(totalPrice || 0)}
          </div>
          <div className="text-xs text-muted-foreground">Total Price</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserQuickState;
