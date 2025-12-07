import { getAllCopons } from "@/actions/coupons.actions";
import { getString } from "@/utils/getStr";
import CouponsFilters from "./coupons-filters";
import CouponsTableClient from "./coupons-table-client";
import ErrorRes from "@/components/shared/error";

const CouponsDataTable = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  const code = getString(searchParams.code);
  const sort = getString(searchParams.sort) || "desc";
  const page = Number(getString(searchParams.page)) || 1;
  const limit = Number(getString(searchParams.limit)) || 10;

  const res = await getAllCopons({ code, sort, page, limit });

  if (!res.success || !res.data || res.error) {
    return <ErrorRes error={res} />;
  }

  return (
    <div className="space-y-3">
      <CouponsFilters />
      <CouponsTableClient data={res.data?.items || []} meta={res.data?.meta} />
    </div>
  );
};

export default CouponsDataTable;
