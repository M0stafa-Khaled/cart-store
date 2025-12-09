"use server";

import { APIRes, ICategory, IHomePage } from "@/interfaces";
import { apiClient } from "@/lib/api-client";
import { API_ROUTES } from "@/lib/constants";

export const getHomepageDataAction = async () => {
  try {
    const res = await apiClient.get<APIRes<IHomePage>>(API_ROUTES.HOME.PAGE);
    if (!res.success) throw res;
    return res;
  } catch (error) {
    return error as APIRes;
  }
};

export const getHomeCategoriesAction = async () => {
  try {
    const res = await apiClient.get<APIRes<ICategory[]>>(
      API_ROUTES.HOME.CATEGORIES
    );
    if (!res.success) throw res;
    return res;
  } catch (error) {
    return error as APIRes;
  }
};
