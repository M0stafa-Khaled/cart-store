import CitiesFilters from "./cities-filters";
import { getString } from "@/utils/getStr";
import { getAllCities } from "@/actions/cities.actions";
import CitiesTableClient from "./cities-table-client";
import { ICountry } from "@/interfaces";
import ErrorRes from "@/components/shared/error";

const CitiesDataTable = async ({
  searchParams,
  countries,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
  countries: ICountry[];
}) => {
  const sp = await searchParams;
  const name = getString(sp.name);
  const country = getString(sp.country);
  const sort = getString(sp.sort);
  const res = await getAllCities({ name, country, sort });

  if (!res.success || res.error) return <ErrorRes error={res} />;


  return (
    <div className="space-y-3">
      <CitiesFilters countries={countries || []} />
      <CitiesTableClient
        countries={countries || []}
        data={res?.data || []}
      />
    </div>
  );
};

export default CitiesDataTable;
