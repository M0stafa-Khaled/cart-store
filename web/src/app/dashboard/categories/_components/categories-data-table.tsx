import { getAllCategoriesAction } from "@/actions/categories.actions";
import { getString } from "@/utils/getStr";
import CategoriesFilters from "./categories-filters";
import CategoriesTableClient from "./categories-table-client";
import ErrorRes from "@/components/shared/error";

const CategoriesDataTable = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  const name = getString(searchParams.name);
  const sort = getString(searchParams.sort) || "desc";

  const res = await getAllCategoriesAction({ name, sort });

  if (!res.success || !res.data || res.error) {
    return <ErrorRes error={res} />;
  }
  return (
    <div className="space-y-3">
      <CategoriesFilters />
      <CategoriesTableClient data={res.data || []} />
    </div>
  );
};

export default CategoriesDataTable;
