"use server";

import { CityForm } from "@/app/dashboard/settings/cities/_conponents/city-dialog";
import { APIRes, ICity, ICityParams } from "@/interfaces";
import { apiClient } from "@/lib/api-client";
import { API_ROUTES } from "@/lib/constants";
import { revalidatePath } from "next/cache";

export const getAllCities = async (params?: ICityParams) => {
  try {
    const querySearch = new URLSearchParams({
      ...(params?.name && { name: params?.name }),
      ...(params?.country && { country: params?.country }),
      ...(params?.sort && { sort: params?.sort }),
    });

    const res = await apiClient.get<APIRes<ICity[]>>(
      `${API_ROUTES.CITIES}${querySearch ? `?${querySearch.toString()}` : ""}`
    );
    if (!res.success) throw res;
    return res;
  } catch (error) {
    return error as APIRes;
  }
};
export const createCityAction = async (body: CityForm) => {
  try {
    const res = await apiClient.post<APIRes<ICity>>(API_ROUTES.CITIES, body);
    if (!res.success) throw res;

    revalidatePath("/dashboard/settings/cities");

    return res;
  } catch (error) {
    return error as APIRes;
  }
};

export const updateCityAction = async (id: string, body: CityForm) => {
  try {
    const res = await apiClient.patch<APIRes<ICity>>(
      `${API_ROUTES.CITIES}/${id}`,
      body
    );

    if (!res.success) throw res;

    revalidatePath("/dashboard/settings/cities");

    return res;
  } catch (error) {
    return error as APIRes;
  }
};

export const deleteCityAction = async (id: string) => {
  try {
    const res = await apiClient.delete<APIRes<void>>(
      `${API_ROUTES.CITIES}/${id}`
    );
    if (!res.success) throw res;

    revalidatePath("/dashboard/settings/cities");

    return res;
  } catch (error) {
    return error as APIRes;
  }
};
