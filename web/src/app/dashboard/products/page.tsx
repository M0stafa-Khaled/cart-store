import Loader from "@/components/ui/loader";
import { Suspense } from "react";
import ProductsHeader from "./_components/products-header";
import ProductsDataTable from "./_components/products-data-table";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Products",
};

const ProductsPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  return (
    <div className="space-y-4">
      <ProductsHeader />
      <Suspense
        fallback={
          <div className="flex items-center justify-center py-20 w-full">
            <Loader />
          </div>
        }
      >
        <ProductsDataTable searchParams={await searchParams} />
      </Suspense>
    </div>
  );
};

export default ProductsPage;
