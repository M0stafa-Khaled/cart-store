"use client";

import { DataTable } from "@/components/data-table";
import { ICategory } from "@/interfaces";
import { useCategoriesColumns } from "./categories-columns";

const CategoriesTableClient = ({ data }: { data: ICategory[] }) => {
  const columns = useCategoriesColumns();
  return <DataTable columns={columns} data={data} />;
};

export default CategoriesTableClient;
