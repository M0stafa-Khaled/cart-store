"use client";

import { DataTable } from "@/components/data-table";
import { IBrand } from "@/interfaces";
import { useBrandsColumns } from "./brands-columns";

const BrandsTableClient = ({ data }: { data: IBrand[] }) => {
  const columns = useBrandsColumns();
  return <DataTable columns={columns} data={data} />;
};

export default BrandsTableClient;
