import { getAllReviewsAction } from "@/actions/reviews.actions";
import ReviewsTableClient from "./reviews-table-client";
import ReviewsFilters from "./reviews-filters";
import { getString } from "@/utils/getStr";
import ErrorRes from "@/components/shared/error";

interface ReviewsDataTableProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

const ReviewsDataTable = async ({ searchParams }: ReviewsDataTableProps) => {
  const page = Number(getString(searchParams.page) ?? 1);
  const limit = Number(getString(searchParams.limit) ?? 20);
  const sort = getString(searchParams.sort);
  const minRating = getString(searchParams.minRating);
  const maxRating = getString(searchParams.maxRating);
  const product = getString(searchParams.product);
  const user = getString(searchParams.user);

  const res = await getAllReviewsAction({
    page,
    limit,
    sort,
    minRating,
    maxRating,
    product,
    user,
  });

  if (!res.success || res.error || !res.data) return <ErrorRes error={res} />;

  const { items: reviews, meta } = res.data;

  return (
    <div className="space-y-4">
      <ReviewsFilters />
      <ReviewsTableClient reviews={reviews} meta={meta} />
    </div>
  );
};

export default ReviewsDataTable;
