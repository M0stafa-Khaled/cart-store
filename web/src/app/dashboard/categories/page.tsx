import CategoriesDataTable from "./_components/categories-data-table";
import Loader from "@/components/ui/loader";

import { Metadata } from "next";
import { Suspense } from "react";
import CategoriesHeader from "./_components/categories-header";

export const metadata: Metadata = {
  title: "Categories",
};

const CategoriesPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  return (
    <div className="space-y-4">
      <CategoriesHeader />
      <Suspense
        fallback={
          <div className="flex items-center justify-center py-20 w-full">
            <Loader />
          </div>
        }
      >
        <CategoriesDataTable searchParams={await searchParams} />
      </Suspense>
    </div>
  );
};

export default CategoriesPage;
