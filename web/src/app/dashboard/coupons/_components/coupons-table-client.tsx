"use client";

import { DataTable } from "@/components/data-table";
import { ICoupon, IPaginationMeta } from "@/interfaces";
import { useCouponsColumns } from "./coupons-columns";

const CouponsTableClient = ({
  data,
  meta,
}: {
  data: ICoupon[];
  meta?: IPaginationMeta;
}) => {
  const columns = useCouponsColumns();
  return <DataTable columns={columns} data={data} meta={meta} />;
};

export default CouponsTableClient;
