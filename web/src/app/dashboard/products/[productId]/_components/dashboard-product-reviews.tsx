"use client";

import { deleteReviewAction } from "@/actions/reviews.actions";
import RatingDistribution from "@/app/(root)/shop/products/[id]/_components/rating-distribution";
import UserReviewInfo from "@/app/(root)/shop/products/[id]/_components/user-review-info";
import DeleteDialog from "@/components/shared/delete-dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { IProduct } from "@/interfaces";
import { Star, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const DashboardProductReviews = ({
  product: { reviews, ratingAverage, ratingQuantity },
}: {
  product: IProduct;
}) => {
  const [showAll, setShowAll] = useState(false);
  const displayedReviews = showAll ? reviews : reviews.slice(0, 3);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };
  return (
    <>
      <h2 className="text-2xl font-bold mb-8">Customer Reviews</h2>
      <div className="grid md:grid-cols-3 gap-8 mb-8">
        <Card className="p-6 text-center">
          <div className="text-5xl font-bold mb-2">
            {ratingAverage.toFixed(1)}
          </div>
          <div className="flex items-center justify-center mb-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-5 w-5 ${
                  i < Math.round(ratingAverage)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-muted-foreground">
            Based on {ratingQuantity} review
            {ratingQuantity !== 1 ? "s" : ""}
          </p>
        </Card>

        <RatingDistribution reviews={reviews} />
      </div>

      <Separator className="my-8" />

      <div className="space-y-6">
        <h3 className="text-xl font-semibold">
          Top Reviews ({reviews.length})
        </h3>

        {displayedReviews.map((review) => (
          <Card
            key={review.id}
            className="p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start gap-4">
              <Avatar className="h-12 w-12">
                {review.user.avatar ? (
                  <Image
                    src={review.user.avatar}
                    alt={review.user.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover object-top"
                  />
                ) : (
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                    {getInitials(review.user.name)}
                  </AvatarFallback>
                )}
              </Avatar>

              <div className="flex-1">
                <UserReviewInfo review={review} />
                <p className="text-muted-foreground leading-relaxed mb-4">
                  {review.reviewText}
                </p>

                <div className="flex items-center gap-4">
                  <DeleteDialog
                    deleteHandler={deleteReviewAction}
                    id={review.id}
                    name={`Review by ${review.user.name}`}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </DeleteDialog>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {reviews.length > 3 && (
        <div className="text-center mt-8">
          <Button
            variant="outline"
            size="lg"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? "Show Less" : `Show All ${reviews.length} Reviews`}
          </Button>
        </div>
      )}
    </>
  );
};

export default DashboardProductReviews;
