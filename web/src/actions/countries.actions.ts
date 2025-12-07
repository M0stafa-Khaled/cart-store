"use server";

import { APIRes, ICountry, ICountryParams } from "@/interfaces";
import { apiClient } from "@/lib/api-client";
import { API_ROUTES } from "@/lib/constants";
import { revalidatePath } from "next/cache";

export const getAllCountries = async (params?: ICountryParams) => {
  try {
    const querySearch = new URLSearchParams({
      ...(params?.name && { name: params?.name }),
    });

    const res = await apiClient.get<APIRes<ICountry[]>>(
      `${API_ROUTES.COUNTRIES}${
        querySearch ? `?${querySearch.toString()}` : ""
      }`
    );
    if (!res.success) throw res;
    return res;
  } catch (error) {
    return error as APIRes;
  }
};

export const createCountry = async (name: string) => {
  try {
    const res = await apiClient.post<APIRes<ICountry>>(API_ROUTES.COUNTRIES, {
      name,
    });
    if (!res.success) throw res;
    revalidatePath("/dashboard/settings/countries");
    return res;
  } catch (error) {
    return error as APIRes;
  }
};

export const updateCountry = async (id: string, name: string) => {
  try {
    const res = await apiClient.patch<APIRes<ICountry>>(
      `${API_ROUTES.COUNTRIES}/${id}`,
      {
        name,
      }
    );
    if (!res.success) throw res;
    revalidatePath("/dashboard/settings/countries");
    return res;
  } catch (error) {
    return error as APIRes;
  }
};

export const deleteCountry = async (id: string) => {
  try {
    const res = await apiClient.delete<APIRes<void>>(
      `${API_ROUTES.COUNTRIES}/${id}`
    );
    if (!res.success) throw res;
    revalidatePath("/dashboard/settings/countries");
    return res;
  } catch (error) {
    return error as APIRes;
  }
};
