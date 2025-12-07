import { Badge } from "@/components/ui/badge";
import { IReview } from "@/interfaces";
import { formatDate } from "@/utils/formatDate";
import { Star, VerifiedIcon } from "lucide-react";

const UserReviewInfo = ({ review }: { review: IReview }) => {
  return (
    <div className="flex items-start justify-between mb-2">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h4 className="font-semibold">{review.user.name}</h4>
          <Badge
            variant="secondary"
            className="text-xs bg-green-100 text-green-700 border-green-200"
          >
            <VerifiedIcon className="h-3 w-3 mr-1" />
            Verified Purchase
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < review.rating
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground">
            {formatDate(review.createdAt)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default UserReviewInfo;
