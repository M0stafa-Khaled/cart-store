"use server";

import { APIRes, ICart } from "@/interfaces";
import { apiClient } from "@/lib/api-client";
import { API_ROUTES } from "@/lib/constants";

export const getCartAction = async () => {
  try {
    const res = await apiClient.get<APIRes<ICart>>(API_ROUTES.CART.MAIN);
    if (!res.success) throw res;

    return res;
  } catch (error) {
    return error as APIRes;
  }
};

export const addToCartItemAction = async (item: {
  productId: string;
  quantity: number;
  color?: string;
  size?: string;
}) => {
  try {
    const res = await apiClient.post<APIRes>(API_ROUTES.CART.MAIN, item);
    if (!res.success) throw res;

    return res;
  } catch (error) {
    return error as APIRes;
  }
};

export const updateCartItemAction = async (
  itemId: string,
  item: { quantity: number }
) => {
  try {
    const res = await apiClient.patch<APIRes>(
      `${API_ROUTES.CART.MAIN}/${itemId}`,
      item
    );
    if (!res.success) throw res;

    return res;
  } catch (error) {
    return error as APIRes;
  }
};

export const removeCartItemAction = async (itemId: string) => {
  try {
    const res = await apiClient.delete<APIRes>(
      `${API_ROUTES.CART.MAIN}/${itemId}`
    );
    if (!res.success) throw res;

    return res;
  } catch (error) {
    return error as APIRes;
  }
};

export const applyCouponToCartAction = async (coupon: string) => {
  try {
    const res = await apiClient.post<APIRes>(API_ROUTES.CART.APPLY_COUPON, {
      code: coupon,
    });
    if (!res.success) throw res;

    return res;
  } catch (error) {
    return error as APIRes;
  }
};

export const removeCouponFromCartAction = async () => {
  try {
    const res = await apiClient.delete<APIRes>(API_ROUTES.CART.REMOVE_COUPON);
    if (!res.success) throw res;

    return res;
  } catch (error) {
    return error as APIRes;
  }
};
