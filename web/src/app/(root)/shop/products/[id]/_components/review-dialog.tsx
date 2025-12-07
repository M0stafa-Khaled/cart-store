"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  createReviewAction,
  updateReviewAction,
} from "@/actions/reviews.actions";
import { handleActionError } from "@/lib/error-handlers";

interface ReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productId: string;
  existingReview?: {
    id: string;
    rating: number;
    reviewText: string;
  } | null;
  onSuccess: () => void;
}

const ReviewDialog = ({
  open,
  onOpenChange,
  productId,
  existingReview,
  onSuccess,
}: ReviewDialogProps) => {
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [reviewText, setReviewText] = useState(
    existingReview?.reviewText || ""
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error("Please select a rating before submitting.");
      return;
    }

    if (!reviewText.trim()) {
      toast.error("Please write a review before submitting.");
      return;
    }

    setIsSubmitting(true);

    try {
      let res;
      if (existingReview) {
        res = await updateReviewAction(existingReview.id, {
          rating,
          reviewText,
        });
      } else {
        res = await createReviewAction({
          productId,
          rating,
          reviewText,
        });
      }

      if (res.success) {
        toast.success(
          existingReview
            ? "Your review has been updated."
            : "Your review has been submitted."
        );
        onOpenChange(false);
        onSuccess();
      } else throw res;
    } catch (error) {
      handleActionError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {existingReview ? "Edit Your Review" : "Write a Review"}
          </DialogTitle>
          <DialogDescription>
            Share your thoughts about this product with other customers.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label>Rating *</Label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`h-8 w-8 ${
                      star <= (hoveredRating || rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
              {rating > 0 && (
                <span className="text-sm text-muted-foreground ml-2">
                  {rating} {rating === 1 ? "star" : "stars"}
                </span>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="review">Your Review *</Label>
            <Textarea
              id="review"
              placeholder="Tell us what you think about this product..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              rows={5}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              {reviewText.length} / 500 characters
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            className="bg-main hover:bg-main/90"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Submitting..."
              : existingReview
                ? "Update Review"
                : "Submit Review"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewDialog;
