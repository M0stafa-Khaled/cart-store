import { redirect } from "next/navigation";
import { auth } from "./auth";

export const getServerSession = async () => {
  const session = await auth();

  // Check if session has error (refresh token failed, user deleted, etc.)
  if (session?.error === "RefreshAccessTokenError") {
    return null;
  }

  return session;
};


export const requireAuth = async (callbackUrl?: string) => {
  const session = await auth();

  if (!session || session.error === "RefreshAccessTokenError" || !session.accessToken) {
    const redirectUrl = `/auth/sign-in${callbackUrl ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : "?error=SessionExpired"}`;
    redirect(redirectUrl);
  }

  return session;
};

export const requireAdmin = async (callbackUrl?: string) => {
  const session = await requireAuth(callbackUrl);

  if (session.user.role !== "ADMIN") redirect("/");
  return session;
};

export const isAuthenticated = async () => {
  const session = await auth();
  return !!session && !session.error && !!session.accessToken;
};

export const isAdmin = async () => {
  const session = await auth();
  return session?.user.role === "ADMIN" && !session.error;
};
