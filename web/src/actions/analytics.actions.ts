"use server";

import { APIRes, IDashboardData, IAnalyticsParams } from "@/interfaces";
import { apiClient } from "@/lib/api-client";
import { API_ROUTES } from "@/lib/constants";

export const getDashboardStatsAction = async (params?: IAnalyticsParams) => {
  try {
    const query = new URLSearchParams();
    if (params?.startDate) query.append("startDate", params.startDate);
    if (params?.endDate) query.append("endDate", params.endDate);

    const res = await apiClient.get<APIRes<IDashboardData>>(
      `${API_ROUTES.ANALYTICS}/stats?${query.toString()}`
    );
    if (!res.success) throw res;
    return res;
  } catch (error) {
    return error as APIRes;
  }
};
