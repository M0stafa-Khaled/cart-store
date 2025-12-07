import CouponsDataTable from "./_components/coupons-data-table";
import Loader from "@/components/ui/loader";
import { Skeleton } from "@/components/ui/skeleton";
import { Metadata } from "next";
import { Suspense } from "react";
import CouponsHeader from "./_components/coupons-header";

export const metadata: Metadata = {
  title: "Coupons",
};

const CouponsPage = async ({
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
        <CouponsHeader />
      </Suspense>
      <Suspense
        fallback={
          <div className="flex items-center justify-center py-20 w-full">
            <Loader />
          </div>
        }
      >
        <CouponsDataTable searchParams={await searchParams} />
      </Suspense>
    </div>
  );
};

export default CouponsPage;
