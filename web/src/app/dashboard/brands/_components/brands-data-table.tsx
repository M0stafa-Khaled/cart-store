import { getAllBrandsAction } from "@/actions/brand.actions";
import { getString } from "@/utils/getStr";
import BrandsFilters from "./brands-filters";
import BrandsTableClient from "./brands-table-client";
import ErrorRes from "@/components/shared/error";

const BrandsDataTable = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  const name = getString(searchParams.name);
  const sort = getString(searchParams.sort) || "desc";

  const res = await getAllBrandsAction({ name, sort });

    if (!res.success || !res.data || res.error) {
    return <ErrorRes error={res} />;
  }

  return (
    <div className="space-y-3">
      <BrandsFilters />
      <BrandsTableClient data={res.data || []} />
    </div>
  );
};

export default BrandsDataTable;
