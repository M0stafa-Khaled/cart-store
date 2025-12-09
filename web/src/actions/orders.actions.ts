"use server";

import { UpdateOrderForm } from "@/app/dashboard/orders/_components/update-order-dialog";
import { APIRes, IOrder, IOrderParams, IPaginatedRes } from "@/interfaces";
import { apiClient } from "@/lib/api-client";
import { API_ROUTES } from "@/lib/constants";
import { revalidatePath } from "next/cache";

export const getAllOrdersAction = async ({
  page,
  limit,
  sort,
  isDelivered,
  isPaid,
  paymentMethod,
  paymentStatus,
  status,
  user,
}: IOrderParams) => {
  try {
    const querySearch = new URLSearchParams({
      page: page?.toString() || "1",
      limit: limit?.toString() || "20",
      ...(sort && { sort }),
      ...(isDelivered && { isDelivered }),
      ...(isPaid && { isPaid }),
      ...(paymentMethod && { paymentMethod }),
      ...(paymentStatus && { paymentStatus }),
      ...(status && { status }),
      ...(user && { user }),
    });
    const res = await apiClient.get<IPaginatedRes<IOrder>>(
      `${API_ROUTES.ORDERS.ADMIN.MAIN}${
        querySearch ? `?${querySearch.toString()}` : ""
      }`
    );

    if (!res.success) throw res;
    return res;
  } catch (error) {
    return error as APIRes;
  }
};

export const getAllUserOrdersAction = async (
  userId: string,
  {
    sort,
    isDelivered,
    isPaid,
    paymentMethod,
    paymentStatus,
    status,
  }: IOrderParams
) => {
  try {
    const querySearch = new URLSearchParams({
      ...(sort && { sort }),
      ...(isDelivered && { isDelivered }),
      ...(isPaid && { isPaid }),
      ...(paymentMethod && { paymentMethod }),
      ...(paymentStatus && { paymentStatus }),
      ...(status && { status }),
    });
    const res = await apiClient.get<APIRes<IOrder[]>>(
      `${API_ROUTES.ORDERS.ADMIN.USER}/${userId}${
        querySearch ? `?${querySearch.toString()}` : ""
      }`
    );
    if (!res.success) throw res;
    return res;
  } catch (error) {
    return error as APIRes;
  }
};

export const getOrderByIdAction = async (id: string) => {
  try {
    const res = await apiClient.get<APIRes<IOrder>>(
      `${API_ROUTES.ORDERS.ADMIN.MAIN}/${id}`
    );

    if (!res.success) throw res;
    return res;
  } catch (error) {
    return error as APIRes;
  }
};

export const updateOrderAction = async (
  id: string,
  data: UpdateOrderForm,
  userId: string
) => {
  try {
    const res = await apiClient.patch<APIRes<IOrder>>(
      `${API_ROUTES.ORDERS.ADMIN.MAIN}/${id}`,
      data
    );

    if (!res.success) throw res;
    revalidatePath("/dashboard/orders");
    revalidatePath(`dashboard/users/${userId}`);
    return res;
  } catch (error) {
    return error as APIRes;
  }
};

export const checkoutAction = async (
  data: {
    paymentMethod: "CASH" | "CREDIT_CARD";
    shippingAddressId: string;
  },
  { success_url, cancell_url }: { success_url?: string; cancell_url?: string }
) => {
  try {
    const res = await apiClient.post<
      APIRes<IOrder | { order: IOrder; checkoutUrl: string }>
    >(
      `${API_ROUTES.ORDERS.USER.CHECKOUT}?success_url=${success_url}&cancel_url=${cancell_url}`,
      data
    );
    console.log("res: ", res);
    if (!res.success) throw res;
    revalidatePath("/cart");
    return res;
  } catch (error) {
    console.log("err: ", error);
    return error as APIRes;
  }
};

export const getAllMyOrdersAction = async () => {
  try {
    const res = await apiClient.get<APIRes<IOrder[]>>(
      `${API_ROUTES.ORDERS.USER.MY_ORDERS}`
    );

    if (!res.success) throw res;
    return res;
  } catch (error) {
    return error as APIRes;
  }
};

export const getMyOrderByIdAction = async (id: string) => {
  try {
    const res = await apiClient.get<APIRes<IOrder>>(
      `${API_ROUTES.ORDERS.USER.MY_ORDERS}/${id}`
    );

    if (!res.success) throw res;
    return res;
  } catch (error) {
    return error as APIRes;
  }
};
