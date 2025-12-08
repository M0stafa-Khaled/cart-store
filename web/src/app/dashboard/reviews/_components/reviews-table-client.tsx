"use client";

import { DataTable } from "@/components/data-table";
import { IPaginationMeta, IReview } from "@/interfaces";
import { useReviewsColumns } from "./reviews-columns";

interface ReviewsTableClientProps {
  reviews: IReview[];
  meta: IPaginationMeta;
}

const ReviewsTableClient = ({ reviews, meta }: ReviewsTableClientProps) => {
  const columns = useReviewsColumns();

  return <DataTable columns={columns} data={reviews} meta={meta} />;
};

export default ReviewsTableClient;
