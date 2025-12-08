"use client";

import { useState } from "react";
import { Star, Edit, Trash2, MessageSquarePlus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { IReview } from "@/interfaces";
import { useSession } from "@/hooks/use-session";
import { deleteReviewAction } from "@/actions/reviews.actions";
import { toast } from "sonner";
import ReviewDialog from "./review-dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { handleActionError } from "@/lib/error-handlers";
import RatingDistribution from "./rating-distribution";
import UserReviewInfo from "./user-review-info";
import Image from "next/image";

interface ProductReviewsProps {
  reviews: IReview[];
  ratingAverage: number;
  ratingQuantity: number;
  productId: string;
  onReviewChange?: () => void;
}

const ProductReviews = ({
  reviews,
  ratingAverage,
  ratingQuantity,
  productId,
  onReviewChange,
}: ProductReviewsProps) => {
  const [showAll, setShowAll] = useState(false);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<IReview | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingReviewId, setDeletingReviewId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { user, isAuthenticated } = useSession();

  // 3 reviews by default
  const displayedReviews = showAll ? reviews : reviews.slice(0, 3);

  // Get user initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const isUserReview = reviews.find((r) => r.user.id === user?.id);

  const handleEditReview = (review: IReview) => {
    setEditingReview(review);
    setReviewDialogOpen(true);
  };

  const handleDeleteClick = (reviewId: string) => {
    setDeletingReviewId(reviewId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingReviewId) return;

    setIsDeleting(true);
    try {
      const response = await deleteReviewAction(deletingReviewId);
      if (response.success) {
        toast.success("Review deleted successfully");
        onReviewChange?.();
      } else {
        toast.error(response.message || "Failed to delete review");
      }
    } catch (error) {
      handleActionError(error);
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setDeletingReviewId(null);
    }
  };

  const handleReviewSuccess = () => {
    setEditingReview(null);
    onReviewChange?.();
  };

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold mb-8">Customer Reviews</h2>
      {!reviews || reviews.length === 0 ? (
        <Card className="p-12 text-center">
          {isAuthenticated && !isUserReview && (
            <div className="flex justify-center mb-8">
              <Button
                size="lg"
                onClick={() => {
                  setEditingReview(null);
                  setReviewDialogOpen(true);
                }}
                className="gap-2 bg-main hover:bg-main/90"
              >
                <MessageSquarePlus className="h-5 w-5" />
                Write a Review
              </Button>
            </div>
          )}
          <Star className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No reviews yet</h3>
          <p className="text-muted-foreground">
            Be the first to review this product
          </p>
        </Card>
      ) : (
        <>
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

          {isAuthenticated && !isUserReview && (
            <div className="flex justify-center mb-8">
              <Button
                size="lg"
                onClick={() => {
                  setEditingReview(null);
                  setReviewDialogOpen(true);
                }}
                className="gap-2 bg-main hover:bg-main/90"
              >
                <MessageSquarePlus className="h-5 w-5" />
                Write a Review
              </Button>
            </div>
          )}

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

                    {isAuthenticated && user?.id === review.user.id && (
                      <div className="flex items-center gap-4">
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditReview(review)}
                            className="text-muted-foreground hover:text-foreground"
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteClick(review.id)}
                            className="text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </>
                      </div>
                    )}
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
      )}

      <ReviewDialog
        open={reviewDialogOpen}
        onOpenChange={setReviewDialogOpen}
        productId={productId}
        existingReview={editingReview}
        onSuccess={handleReviewSuccess}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Review</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete your review? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProductReviews;
