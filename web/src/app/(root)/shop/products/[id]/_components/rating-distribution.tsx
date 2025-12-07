import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { IReview } from "@/interfaces";
import { Star } from "lucide-react";

const RatingDistribution = ({ reviews }: { reviews: IReview[] }) => {
  const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => {
    const count = reviews.filter((r) => r.rating === rating).length;
    const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
    return { rating, count, percentage };
  });
  return (
    <Card className="p-6 md:col-span-2">
      <h3 className="font-semibold mb-4">Rating Distribution</h3>
      <div className="space-y-3">
        {ratingDistribution.map(({ rating, count, percentage }) => (
          <div key={rating} className="flex items-center gap-3">
            <div className="flex items-center gap-1 w-16">
              <span className="text-sm font-medium">{rating}</span>
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            </div>
            <Progress value={percentage} className="flex-1 h-2 "  />
            <span className="text-sm text-muted-foreground w-12 text-right">
              {count}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default RatingDistribution;
