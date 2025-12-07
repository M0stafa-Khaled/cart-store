"use server";

import { APIRes, ICategory, ICategoryParams } from "@/interfaces";
import { apiClient } from "@/lib/api-client";
import { API_ROUTES } from "@/lib/constants";
import { revalidatePath } from "next/cache";

export const getAllCategoriesAction = async ({
  name,
  sort,
}: Partial<ICategoryParams>) => {
  try {
    const querySearch = new URLSearchParams({
      ...(name && { name }),
      ...(sort && { sort }),
    });

    const res = await apiClient.get<APIRes<ICategory[]>>(
      `${API_ROUTES.CATEGORIES}${
        querySearch ? `?${querySearch.toString()}` : ""
      }`
    );

    if (!res.success) throw res;

    return res;
  } catch (error) {
    return error as APIRes;
  }
};

export const getCategoryByIdAction = async (id: string) => {
  try {
    const res = await apiClient.get<APIRes<ICategory>>(
      `${API_ROUTES.COUNTRIES}/${id}`
    );
    if (!res.success) throw res;

    return res;
  } catch (error) {
    return error as APIRes;
  }
};

export const createCategoryAction = async (formData: FormData) => {
  try {
    const res = await apiClient.post<APIRes<ICategory>>(
      API_ROUTES.CATEGORIES,
      formData
    );
    if (!res.success) throw res;

    revalidatePath("/dashboard/categories");
    return res;
  } catch (error) {
    return error as APIRes;
  }
};

export const updateCategoryAction = async (id: string, formData: FormData) => {
  try {
    const res = await apiClient.patch<APIRes<ICategory>>(
      `${API_ROUTES.CATEGORIES}/${id}`,
      formData
    );
    if (!res.success) throw res;

    revalidatePath("/dashboard/categories");
    return res;
  } catch (error) {
    return error as APIRes;
  }
};

export const deleteCategoryAction = async (id: string) => {
  try {
    const res = await apiClient.delete<APIRes<void>>(
      `${API_ROUTES.CATEGORIES}/${id}`
    );
    if (!res.success) throw res;

    revalidatePath("/dashboard/categories");
    return res;
  } catch (error) {
    return error as APIRes;
  }
};
