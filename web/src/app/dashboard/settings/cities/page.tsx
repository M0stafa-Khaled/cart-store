import CitiesDataTable from "@/app/dashboard/settings/cities/_conponents/cities-data-table";
import Loader from "@/components/ui/loader";
import { Metadata } from "next";
import { Suspense } from "react";
import CitiesHeader from "./_conponents/cities-header";
import { getAllCountries } from "@/actions/countries.actions";

export const metadata: Metadata = {
  title: "Cities",
};

const CitiesPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const countires = await getAllCountries({});
  return (
    <div className="space-y-4">
      <CitiesHeader countries={countires.data || []} />
      <Suspense
        fallback={
          <div className="flex items-center justify-center py-20 w-full">
            <Loader />
          </div>
        }
      >
        <CitiesDataTable
          countries={countires.data || []}
          searchParams={searchParams}
        />
      </Suspense>
    </div>
  );
};

export default CitiesPage;
