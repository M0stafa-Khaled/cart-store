"use client";

import { DataTable } from "@/components/data-table";
import { useCountriesColumns } from "./countries-columns";
import { ICountry } from "@/interfaces";

const CountriesTableClient = ({ data }: { data: ICountry[] }) => {
  const columns = useCountriesColumns();
  return <DataTable columns={columns} data={data} />;
};

export default CountriesTableClient;
