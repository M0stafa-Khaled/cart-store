"use client";

import { DataTable } from "@/components/data-table";
import { ICategory, ISubCategory } from "@/interfaces";
import { useSubCategoriesColumns } from "./sub-categories-columns";

const SubCategoriesTableClient = ({
  data,
  categories,
}: {
  data: ISubCategory[];
  categories: ICategory[];
}) => {
  const columns = useSubCategoriesColumns(categories);
  return <DataTable columns={columns} data={data} />;
};

export default SubCategoriesTableClient;
