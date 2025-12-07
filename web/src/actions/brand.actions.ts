"use server";

import { APIRes, IBrand, IBrandParams } from "@/interfaces";
import { apiClient } from "@/lib/api-client";
import { API_ROUTES } from "@/lib/constants";
import { revalidatePath } from "next/cache";

export const getAllBrandsAction = async (params: IBrandParams) => {
  try {
    const querySearch = new URLSearchParams({
      ...(params.name && { name: params.name }),
      ...(params.sort && { sort: params.sort }),
    });

    const res = await apiClient.get<APIRes<IBrand[]>>(
      `${API_ROUTES.BRANDS}${querySearch ? `?${querySearch.toString()}` : ""}`
    );
    if (!res.success) throw res;

    return res;
  } catch (error) {
    return error as APIRes;
  }
};

export const getBrandByIdAction = async (id: string) => {
  try {
    const res = await apiClient.get<APIRes<IBrand>>(
      `${API_ROUTES.BRANDS}/${id}`
    );
    if (!res.success) throw res;

    return res;
  } catch (error) {
    return error as APIRes;
  }
};

export const createBrandAction = async (formData: FormData) => {
  try {
    const res = await apiClient.post<APIRes<IBrand>>(
      API_ROUTES.BRANDS,
      formData
    );
    if (!res.success) throw res;

    revalidatePath("/dashboard/brands");
    return res;
  } catch (error) {
    return error as APIRes;
  }
};

export const updateBrandAction = async (id: string, formData: FormData) => {
  try {
    const res = await apiClient.patch<APIRes<IBrand>>(
      `${API_ROUTES.BRANDS}/${id}`,
      formData
    );
    if (!res.success) throw res;

    revalidatePath("/dashboard/brands");
    return res;
  } catch (error) {
    return error as APIRes;
  }
};

export const deleteBrandAction = async (id: string) => {
  try {
    const res = await apiClient.delete<APIRes<void>>(
      `${API_ROUTES.BRANDS}/${id}`
    );
    if (!res.success) throw res;

    revalidatePath("/dashboard/brands");
    return res;
  } catch (error) {
    return error as APIRes;
  }
};
