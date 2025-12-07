"use server";

import { ShippingAddressForm } from "@/components/shared/shipping-address-dialog";
import { APIRes, IShippingAddress } from "@/interfaces";
import { apiClient } from "@/lib/api-client";
import { API_ROUTES } from "@/lib/constants";
import { revalidatePath } from "next/cache";

export const getShippingAddressesAction = async () => {
  try {
    const res = await apiClient.get<APIRes<IShippingAddress[]>>(
      API_ROUTES.SHIPPING_ADDRESSES
    );

    if (!res.success) throw res;
    return res;
  } catch (error) {
    return error as APIRes;
  }
};

export const createShippingAddressAction = async (
  data: ShippingAddressForm
) => {
  try {
    const res = await apiClient.post<APIRes<IShippingAddress>>(
      API_ROUTES.SHIPPING_ADDRESSES,
      data
    );

    if (!res.success) throw res;
    revalidatePath("/checkout");
    revalidatePath("/profile");
    return res;
  } catch (error) {
    return error as APIRes;
  }
};

export const updateShippingAddressAction = async (
  id: string,
  data: ShippingAddressForm
) => {
  try {
    const res = await apiClient.patch<APIRes<IShippingAddress>>(
      `${API_ROUTES.SHIPPING_ADDRESSES}/${id}`,
      data
    );

    if (!res.success) throw res;
    revalidatePath("/checkout");
    revalidatePath("/profile");
    return res;
  } catch (error) {
    return error as APIRes;
  }
};

export const deleteShippingAddressAction = async (id: string) => {
  try {
    const res = await apiClient.delete<APIRes>(
      `${API_ROUTES.SHIPPING_ADDRESSES}/${id}`
    );

    if (!res.success) throw res;
    revalidatePath("/checkout");
    revalidatePath("/profile");
    return res;
  } catch (error) {
    return error as APIRes;
  }
};
