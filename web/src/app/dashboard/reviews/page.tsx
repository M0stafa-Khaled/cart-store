import { Metadata } from "next";
import { Suspense } from "react";
import ReviewsHeader from "./_components/reviews-header";
import ReviewsDataTable from "./_components/reviews-data-table";
import Loader from "@/components/ui/loader";

export const metadata: Metadata = {
  title: "Reviews",
};

const ReviewsPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  return (
    <div className="space-y-4">
      <ReviewsHeader />
      <Suspense
        fallback={
          <div className="flex items-center justify-center py-20 w-full">
            <Loader />
          </div>
        }
      >
        <ReviewsDataTable searchParams={await searchParams} />
      </Suspense>
    </div>
  );
};

export default ReviewsPage;
