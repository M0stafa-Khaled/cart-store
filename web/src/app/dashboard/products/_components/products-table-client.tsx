"use client";

import { DataTable } from "@/components/data-table";
import { useProdctColumns } from "./products-columns";
import { IPaginationMeta, IProduct } from "@/interfaces";

interface ProductsTableClientProps {
  data: IProduct[];
  meta?: IPaginationMeta;
}

const ProductsTableClient = ({ data, meta }: ProductsTableClientProps) => {
  const columns = useProdctColumns();

  return <DataTable columns={columns} data={data} meta={meta} />;
};

export default ProductsTableClient;
