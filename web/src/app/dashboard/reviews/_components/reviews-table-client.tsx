"use client";

import { DataTable } from "@/components/data-table";
import { IPaginationMeta, IReview } from "@/interfaces";
import { useReviewsColumns } from "./reviews-columns";
import { Card } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";

interface ReviewsTableClientProps {
  reviews: IReview[];
  meta: IPaginationMeta;
}

const ReviewsTableClient = ({ reviews, meta }: ReviewsTableClientProps) => {
  const columns = useReviewsColumns();

  if (reviews.length === 0) {
    return (
      <Card className="p-12">
        <div className="flex flex-col items-center justify-center text-center text-muted-foreground">
          <MessageSquare className="h-16 w-16 mb-4 opacity-50" />
          <h3 className="text-lg font-semibold mb-2">No reviews found</h3>
          <p className="text-sm">
            Reviews from customers will appear here once they start reviewing
            products.
          </p>
        </div>
      </Card>
    );
  }

  return <DataTable columns={columns} data={reviews} meta={meta} />;
};

export default ReviewsTableClient;
