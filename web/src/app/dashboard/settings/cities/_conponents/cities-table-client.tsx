"use client";

import { DataTable } from "@/components/data-table";
import { useCitiesColumns } from "./cities-columns";
import { ICity, ICountry } from "@/interfaces";

const CitiesTableClient = ({
  data,
  countries,
}: {
  data: ICity[];
  countries: ICountry[];
}) => {
  const columns = useCitiesColumns(countries);
  return <DataTable columns={columns} data={data} />;
};

export default CitiesTableClient;
