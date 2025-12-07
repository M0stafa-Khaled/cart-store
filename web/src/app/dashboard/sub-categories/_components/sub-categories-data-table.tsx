import { getAllSubCategoriesAction } from "@/actions/sub-categories.actions";
import { ICategory } from "@/interfaces";
import { getString } from "@/utils/getStr";
import SubCategoriesFilters from "./sub-categories-filters";
import SubCategoriesTableClient from "./sub-categories-table-client";
import ErrorRes from "@/components/shared/error";

const SubCategoriesDataTable = async ({
  searchParams,
  categories,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
  categories: ICategory[];
}) => {
  const {
    name: nameParam,
    sort: sortParam,
    category: categoryParam,
  } = await searchParams;
  const name = getString(nameParam);
  const sort = getString(sortParam) || "desc";
  const category = getString(categoryParam);

  const res = await getAllSubCategoriesAction({ name, sort, category });

  if (!res.success || res.error) return <ErrorRes error={res} />;

  return (
    <div className="space-y-3">
      <SubCategoriesFilters categories={categories} />
      <SubCategoriesTableClient data={res.data || []} categories={categories} />
    </div>
  );
};

export default SubCategoriesDataTable;
