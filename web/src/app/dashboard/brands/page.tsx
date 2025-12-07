import BrandsDataTable from "./_components/brands-data-table";
import Loader from "@/components/ui/loader";

import { Metadata } from "next";
import { Suspense } from "react";
import BrandsHeader from "./_components/brands-header";

export const metadata: Metadata = {
  title: "Brands",
};

const BrandsPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  return (
    <div className="space-y-4">
      <BrandsHeader />
      <Suspense
        fallback={
          <div className="flex items-center justify-center py-20 w-full">
            <Loader />
          </div>
        }
      >
        <BrandsDataTable searchParams={await searchParams} />
      </Suspense>
    </div>
  );
};

export default BrandsPage;
