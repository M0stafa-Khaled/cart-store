"use server";

import { APIRes, IUser } from "@/interfaces";
import { apiClient } from "@/lib/api-client";
import { API_ROUTES } from "@/lib/constants";

export const getUserProfileAction = async () => {
  try {
    const res = await apiClient.get<APIRes<IUser>>(API_ROUTES.PROFILE);

    if (!res.success) throw res;

    return res;
  } catch (error) {
    return error as APIRes;
  }
};

export const updateUserProfileAction = async (formData: FormData) => {
  try {
    const res = await apiClient.patch<APIRes<IUser>>(
      API_ROUTES.PROFILE,
      formData
    );

    if (!res.success) throw res;

    return res;
  } catch (error) {
    return error as APIRes;
  }
};

export const deleteUserProfileAction = async () => {
  try {
    const res = await apiClient.delete<APIRes<IUser>>(API_ROUTES.PROFILE);

    if (!res.success) throw res;

    return res;
  } catch (error) {
    return error as APIRes;
  }
};
