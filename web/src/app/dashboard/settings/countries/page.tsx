import CountriesDataTable from "./_components/countries-data-table";
import Loader from "@/components/ui/loader";
import { Metadata } from "next";
import { Suspense } from "react";
import CountriesHeader from "./_components/countries-header";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Countries",
};

const CountriesPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  return (
    <div className="space-y-4">
      <Suspense
        fallback={
          <div>
            <div className="flex flex-col justify-between gap-2 sm:flex-row items-center">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
        }
      >
        <CountriesHeader />
      </Suspense>
      <Suspense
        fallback={
          <div className="flex items-center justify-center py-20 w-full">
            <Loader />
          </div>
        }
      >
        <CountriesDataTable searchParams={await searchParams} />
      </Suspense>
    </div>
  );
};

export default CountriesPage;
