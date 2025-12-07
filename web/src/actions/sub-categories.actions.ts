"use server";

import { SubCategoryForm } from "@/app/dashboard/sub-categories/_components/sub-category-dialog";
import { APIRes, ISubCategory, ISubCategoryParams } from "@/interfaces";
import { apiClient } from "@/lib/api-client";
import { API_ROUTES } from "@/lib/constants";
import { revalidatePath } from "next/cache";

export const getAllSubCategoriesAction = async (params: ISubCategoryParams) => {
  try {
    const querySearch = new URLSearchParams({
      ...(params.name && { name: params.name }),
      ...(params.sort && { sort: params.sort }),
      ...(params.category && { category: params.category }),
    });

    const res = await apiClient.get<APIRes<ISubCategory[]>>(
      `${API_ROUTES.SUB_CATEGORIES}${
        querySearch ? `?${querySearch.toString()}` : ""
      }`
    );
    if (!res.success) throw res;

    return res;
  } catch (error) {
    return error as APIRes;
  }
};

export const getSubCategoryByIdAction = async (id: string) => {
  try {
    const res = await apiClient.get<APIRes<ISubCategory>>(
      `${API_ROUTES.SUB_CATEGORIES}/${id}`
    );
    if (!res.success) throw res;

    return res;
  } catch (error) {
    return error as APIRes;
  }
};

export const createSubCategoryAction = async (data: SubCategoryForm) => {
  try {
    const res = await apiClient.post<APIRes<ISubCategory>>(
      API_ROUTES.SUB_CATEGORIES,
      data
    );
    if (!res.success) throw res;

    revalidatePath("/dashboard/sub-categories");
    return res;
  } catch (error) {
    return error as APIRes;
  }
};

export const updateSubCategoryAction = async (
  id: string,
  data: SubCategoryForm
) => {
  try {
    const res = await apiClient.patch<APIRes<ISubCategory>>(
      `${API_ROUTES.SUB_CATEGORIES}/${id}`,
      data
    );
    if (!res.success) throw res;

    revalidatePath("/dashboard/sub-categories");
    return res;
  } catch (error) {
    return error as APIRes;
  }
};

export const deleteSubCategoryAction = async (id: string) => {
  try {
    const res = await apiClient.delete<APIRes<void>>(
      `${API_ROUTES.SUB_CATEGORIES}/${id}`
    );
    if (!res.success) throw res;

    revalidatePath("/dashboard/sub-categories");
    return res;
  } catch (error) {
    return error as APIRes;
  }
};
