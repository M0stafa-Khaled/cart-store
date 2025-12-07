import { Metadata } from "next";
import { Suspense } from "react";
import OrdersHeader from "./_components/orders-header";
import OrdersDataTable from "./_components/orders-data-table";
import Loader from "@/components/ui/loader";

export const metadata: Metadata = {
  title: "Orders",
};

const OrdersPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  return (
    <div className="space-y-4">
      <OrdersHeader />
      <Suspense
        fallback={
          <div className="flex items-center justify-center py-20 w-full">
            <Loader />
          </div>
        }
      >
        <OrdersDataTable searchParams={await searchParams} />
      </Suspense>
    </div>
  );
};

export default OrdersPage;
