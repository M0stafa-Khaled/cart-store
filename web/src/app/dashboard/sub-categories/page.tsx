import { getAllCategoriesAction } from "@/actions/categories.actions";
import SubCategoriesDataTable from "./_components/sub-categories-data-table";
import Loader from "@/components/ui/loader";

import { Metadata } from "next";
import { Suspense } from "react";
import SubCategoriesHeader from "./_components/sub-categories-header";

export const metadata: Metadata = {
  title: "Sub Categories",
};

const SubCategoriesPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const categoriesRes = await getAllCategoriesAction({});
  const categories = categoriesRes.data || [];

  return (
    <div className="space-y-4">
      <SubCategoriesHeader categories={categories} />
      <Suspense
        fallback={
          <div className="flex items-center justify-center py-20 w-full">
            <Loader />
          </div>
        }
      >
        <SubCategoriesDataTable
          searchParams={searchParams}
          categories={categories}
        />
      </Suspense>
    </div>
  );
};

export default SubCategoriesPage;
