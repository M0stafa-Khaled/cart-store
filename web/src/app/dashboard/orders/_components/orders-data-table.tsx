import { getAllOrdersAction } from "@/actions/orders.actions";
import { IOrderParams } from "@/interfaces";
import OrdersTableClient from "./orders-table-client";
import { OrdersFilters } from "./orders-filters";
import ErrorRes from "@/components/shared/error";

interface OrdersDataTableProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

const OrdersDataTable = async ({ searchParams }: OrdersDataTableProps) => {
  const params: IOrderParams = {
    page: Number(searchParams.page) || 1,
    limit: Number(searchParams.limit) || 20,
    sort: (searchParams.sort as string) || undefined,
    status: (searchParams.status as string) || undefined,
    paymentStatus: (searchParams.paymentStatus as string) || undefined,
    paymentMethod: (searchParams.paymentMethod as string) || undefined,
    isPaid: (searchParams.isPaid as string) || undefined,
    isDelivered: (searchParams.isDelivered as string) || undefined,
  };

  const res = await getAllOrdersAction(params);

  if (!res.success || !res.data || res.error) {
    return <ErrorRes error={res} />;
  }
  const { items: orders, meta } = res.data;

  return (
    <div className="space-y-4">
      <OrdersFilters />
      <OrdersTableClient orders={orders} meta={meta} />
    </div>
  );
};

export default OrdersDataTable;
