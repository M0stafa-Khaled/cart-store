"use server";

import { ForgotPasswordForm } from "@/app/auth/forgot-password/page";
import { ResetPasswordForm } from "@/app/auth/reset-password/page";
import { SignUpForm } from "@/app/auth/sign-up/page";
import type { APIRes, IAuthRes, ISignInInputs } from "@/interfaces";
import { apiClient } from "@/lib/api-client";
import { API_ROUTES, API_URL } from "@/lib/constants";
import { signIn } from "@/lib/next-auth/auth";
import { getServerSession } from "@/lib/next-auth/auth-helper";
import { AuthError } from "next-auth";

export const signInAction = async (
  credentials: ISignInInputs
): Promise<APIRes<IAuthRes> & { callbackUrl?: string }> => {
  try {
    const res = await signIn("credentials", {
      email: credentials.email,
      password: credentials.password,
      redirect: false,
    });
    return {
      success: true,
      message: "Sign in successfully",
      data: res.user,
      callbackUrl: res.url,
    };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return {
            success: false,
            message: "Invalid email or password",
            error: error.message,
          };
        case "CallbackRouteError":
          return {
            success: false,
            message: error.cause?.err?.message || "Authentication failed",
            error: error.message,
          };

        default:
          return {
            success: false,
            message: "Authentication failed. Please try again.",
            error: "Authentication failed. Please try again.",
          };
      }
    }

    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
      message: "An unexpected error occurred. Please try again.",
    };
  }
};

export const verifyEmailAction = async (
  token: string
): Promise<APIRes<void>> => {
  const res = await fetch(
    `${API_URL}${API_ROUTES.AUTH.VERIFY_EMAIL}?token=${token}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return await res.json();
};

export const signOutAction = async () => {
  const session = await getServerSession();

  if (!session?.accessToken) {
    return { success: true, message: "Signed out successfully" };
  }

  try {
    const res = await fetch(`${API_URL}${API_ROUTES.AUTH.SIGNOUT}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
    });

    const json: APIRes<void> = await res.json();
    return json;
  } catch {
    return { success: true, message: "Signed out successfully" };
  }
};

export const signUpAction = async (body: SignUpForm) => {
  const res = await apiClient.post<APIRes<IAuthRes>>(
    API_ROUTES.AUTH.SIGN_UP,
    body
  );

  return res;
};

export const checkAuthAction = async () => {
  try {
    const session = await getServerSession();
    if (!session?.accessToken) {
      return {
        success: false,
        message: "Not authenticated",
        data: {
          auth: false,
        },
      };
    }
    const res = await fetch(`${API_URL}/auth/check-auth`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
    });
    const json: APIRes<{ auth: boolean }> = await res.json();
    return json;
  } catch (_error) {
    return {
      success: false,
      message: "Not authenticated",
      data: { auth: false },
    };
  }
};

export const forgotPasswordAction = async (data: ForgotPasswordForm) => {
  try {
    const res = await apiClient.post<APIRes>(
      API_ROUTES.AUTH.FORGOT_PASSWORD,
      data
    );
    if (!res.success) throw res;

    return res;
  } catch (error) {
    return error as APIRes;
  }
};


export  const resetPasswordAction = async (data: ResetPasswordForm) => {
  try {
    const res = await apiClient.post<APIRes>(
      API_ROUTES.AUTH.RESET_PASSWORD,
      data
    );
    if (!res.success) throw res;

    return res;
  } catch (error) {
    return error as APIRes;
  }
} 