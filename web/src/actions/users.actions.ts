"use server";
import { APIRes, IPaginatedRes } from "@/interfaces";
import { IUser, IUserParams } from "@/interfaces";
import { apiClient } from "@/lib/api-client";
import { API_ROUTES } from "@/lib/constants";
import { revalidatePath } from "next/cache";

export const getAllUsersAction = async (params: Partial<IUserParams> = {}) => {
  try {
    const { page, limit, sort, q, role, active, isVerified } = params;

    const querySearch = new URLSearchParams({
      page: page?.toString() || "1",
      limit: limit?.toString() || "20",
      ...(q && { q }),
      ...(role && { role }),
      ...(active && { active: active?.toString() }),
      ...(isVerified && { isVerified: isVerified?.toString() }),
      ...(sort && { sort }),
    });

    const res = await apiClient.get<IPaginatedRes<IUser>>(
      `${API_ROUTES.USERS}${querySearch ? `?${querySearch.toString()}` : ""}`
    );

    return res;
  } catch (error) {
    return error as APIRes;
  }
};

export const getUserByIdAction = async (id: string) => {
  try {
    const res = await apiClient.get<APIRes<IUser>>(`${API_ROUTES.USERS}/${id}`);

    if (!res.success) throw res;
    return res;
  } catch (error) {
    return error as APIRes;
  }
};

export const createUserAction = async (formData: FormData) => {
  try {
    const res = await apiClient.post<APIRes<IUser>>(API_ROUTES.USERS, formData);

    if (!res.success) throw res;

    revalidatePath("/dashboard/users");
    return res;
  } catch (error) {
    return error as APIRes;
  }
};

export const updateUserAction = async (id: string, formData: FormData) => {
  try {
    const res = await apiClient.patch<APIRes<IUser>>(
      `${API_ROUTES.USERS}/${id}`,
      formData
    );

    if (!res.success) throw res;

    revalidatePath("/dashboard/users");
    revalidatePath(`/dashboard/users/${id}`);
    return res;
  } catch (error) {
    return error as APIRes;
  }
};

export const deleteUserAction = async (id: string) => {
  try {
    const res = await apiClient.delete<APIRes>(`${API_ROUTES.USERS}/${id}`);

    if (!res.success) throw res;

    revalidatePath("/dashboard/users");
    revalidatePath(`/dashboard/users/${id}`);
    return res;
  } catch (error) {
    return error as APIRes;
  }
};
