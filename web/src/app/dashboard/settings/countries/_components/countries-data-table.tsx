import { getString } from "@/utils/getStr";
import { getAllCountries } from "@/actions/countries.actions";
import CountriesFilters from "./countries-filters";
import CountriesTableClient from "./countries-table-client";
import ErrorRes from "@/components/shared/error";

const CountriesDataTable = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  const name = getString(searchParams.name);

  const res = await getAllCountries({ name });

    if (!res.success || res.error) return <ErrorRes error={res} />;

  return (
    <div className="space-y-3">
      <CountriesFilters />
      <CountriesTableClient data={res.data || []} />
    </div>
  );
};

export default CountriesDataTable;
