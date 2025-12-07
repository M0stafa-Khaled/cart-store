"use server";

import { CouponForm } from "@/app/dashboard/coupons/_components/coupon-dialog";
import { APIRes, ICoupon, ICouponParams, IPaginatedRes } from "@/interfaces";
import { apiClient } from "@/lib/api-client";
import { API_ROUTES } from "@/lib/constants";
import { revalidatePath } from "next/cache";

export const getAllCopons = async ({
  page,
  limit,
  code,
  sort,
}: Partial<ICouponParams>) => {
  try {
    const querySearch = new URLSearchParams({
      page: page?.toString() || "1",
      limit: limit?.toString() || "20",
      ...(code && { code }),
      ...(sort && { sort }),
    });

    const res = await apiClient.get<IPaginatedRes<ICoupon>>(
      `${API_ROUTES.COUPONS}${querySearch ? `?${querySearch.toString()}` : ""}`
    );

    if (!res.success) throw res;

    return res;
  } catch (error) {
    return error as APIRes;
  }
};

export const createCouponAction = async (data: CouponForm) => {
  try {
    const res = await apiClient.post<APIRes<ICoupon>>(API_ROUTES.COUPONS, data);
    if (!res.success) throw res;

    revalidatePath("/dashbord/coupons");
    return res;
  } catch (error) {
    return error as APIRes;
  }
};

export const updateCouponAction = async (id: string, data: CouponForm) => {
  try {
    const res = await apiClient.patch<APIRes<ICoupon>>(
      `${API_ROUTES.COUPONS}/${id}`,
      data
    );
    if (!res.success) throw res;

    revalidatePath("/dashbord/coupons");
    return res;
  } catch (error) {
    return error as APIRes;
  }
};

export const deleteCouponAction = async (id: string) => {
  try {
    const res = await apiClient.delete<APIRes<void>>(
      `${API_ROUTES.COUPONS}/${id}`
    );
    if (!res.success) throw res;

    revalidatePath("/dashbord/coupons");
    return res;
  } catch (error) {
    return error as APIRes;
  }
};
