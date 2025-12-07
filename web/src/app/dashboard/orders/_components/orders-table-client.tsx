"use client";

import { DataTable } from "@/components/data-table";
import { IOrder, IPaginationMeta } from "@/interfaces";
import { useOrdersColumns } from "./orders-columns";

interface OrdersTableClientProps {
  orders: IOrder[];
  meta: IPaginationMeta;
}

const OrdersTableClient = ({ orders, meta }: OrdersTableClientProps) => {
  const columns = useOrdersColumns();
  return <DataTable columns={columns} data={orders} meta={meta} />;
};

export default OrdersTableClient;
