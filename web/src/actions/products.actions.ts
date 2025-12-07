"use server";

import { APIRes, IPaginatedRes, IProduct, IProductParams } from "@/interfaces";
import { apiClient } from "@/lib/api-client";
import { API_ROUTES } from "@/lib/constants";
import { revalidatePath } from "next/cache";

export const getAllProductsAction = async ({
  page,
  limit,
  sort,
  search,
  title,
  category,
  subCategory,
  brand,
  reviews,
  minPrice,
  maxPrice,
}: IProductParams) => {
  try {
    const querySearch = new URLSearchParams({
      page: page?.toString() || "1",
      limit: limit?.toString() || "20",
      ...(sort && { sort }),
      ...(search && { search }),
      ...(title && { title }),
      ...(category && { category }),
      ...(subCategory && { subCategory }),
      ...(brand && { brand }),
      ...(minPrice && { minPrice }),
      ...(maxPrice && { maxPrice }),
      ...(reviews && { reviews: reviews?.toString() }),
    });
    const res = await apiClient.get<IPaginatedRes<IProduct>>(
      `${API_ROUTES.PRODUCTS}${querySearch ? `?${querySearch.toString()}` : ""}`
    );

    if (!res.success) throw res;
    return res;
  } catch (error) {
    return error as APIRes;
  }
};

export const getProductByIdAction = async (
  id: string,
  { reviews }: { reviews?: boolean }
) => {
  try {
    const res = await apiClient.get<APIRes<IProduct>>(
      `${API_ROUTES.PRODUCTS}/${id}${reviews ? `?reviews=${reviews}` : ""}`
    );
    if (!res.success) throw res;
    return res;
  } catch (error) {
    return error as APIRes;
  }
};

export const createProductAction = async (formData: FormData) => {
  try {
    const res = await apiClient.post<APIRes<IProduct>>(
      API_ROUTES.PRODUCTS,
      formData
    );
    if (!res.success) throw res;

    revalidatePath("/dashboard/products");
    revalidatePath("/");
    revalidatePath("/products");
    return res;
  } catch (error) {
    return error as APIRes;
  }
};

export const updateProductAction = async (id: string, formData: FormData) => {
  try {
    const res = await apiClient.patch<APIRes<IProduct>>(
      `${API_ROUTES.PRODUCTS}/${id}`,
      formData
    );
    if (!res.success) throw res;

    revalidatePath("/dashboard/products");
    revalidatePath("/");
    revalidatePath("/products");
    return res;
  } catch (error) {
    return error as APIRes;
  }
};

export const deleteProductAction = async (id: string) => {
  try {
    const res = await apiClient.delete<APIRes>(`${API_ROUTES.PRODUCTS}/${id}`);

    if (!res.success) throw res;
    revalidatePath("/dashboard/products");
    revalidatePath("/");
    revalidatePath("/products");
    return res;
  } catch (error) {
    return error as APIRes;
  }
};
