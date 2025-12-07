"use server";

import { APIRes, IPaginatedRes, IReview, IReviewParams } from "@/interfaces";
import { apiClient } from "@/lib/api-client";
import { API_ROUTES } from "@/lib/constants";
import { revalidatePath } from "next/cache";

interface CreateReview {
  productId: string;
  rating: number;
  reviewText: string;
}

interface UpdateReview {
  rating?: number;
  reviewText?: string;
}
export const getAllReviewsAction = async ({
  page,
  limit,
  sort,
  minRating,
  maxRating,
  product,
  user,
}: IReviewParams) => {
  try {
    const querySearch = new URLSearchParams({
      page: page?.toString() || "1",
      limit: limit?.toString() || "20",
      ...(sort && { sort }),
      ...(minRating && { minRating }),
      ...(maxRating && { maxRating }),
      ...(product && { product }),
      ...(user && { user }),
    });

    const res = await apiClient.get<IPaginatedRes<IReview>>(
      API_ROUTES.REVIEWS + (querySearch ? `?${querySearch.toString()}` : "")
    );
    if (!res.success) throw res;

    return res;
  } catch (error) {
    return error as APIRes;
  }
};

export const createReviewAction = async (data: CreateReview) => {
  try {
    const res = await apiClient.post<APIRes>(API_ROUTES.REVIEWS, data);
    if (!res.success) throw res;

    revalidatePath("/shop/products");
    return res;
  } catch (error) {
    return error as APIRes;
  }
};

export const updateReviewAction = async (
  reviewId: string,
  data: UpdateReview
) => {
  try {
    const res = await apiClient.patch<APIRes>(
      `${API_ROUTES.REVIEWS}/${reviewId}`,
      data
    );
    if (!res.success) throw res;

    revalidatePath("/shop/products");
    return res;
  } catch (error) {
    return error as APIRes;
  }
};

export const deleteReviewAction = async (reviewId: string) => {
  try {
    const res = await apiClient.delete<APIRes>(
      `${API_ROUTES.REVIEWS}/${reviewId}`
    );
    if (!res.success) throw res;

    revalidatePath("/shop/products");
    revalidatePath("/dashboard/reviews");
    revalidatePath("/dashboard/products");
    return res;
  } catch (error) {
    return error as APIRes;
  }
};
