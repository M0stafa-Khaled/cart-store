"use client";

import { useSession as useNextAuthSession } from "next-auth/react";

/**
 * Custom hook to access session data
 * Provides type-safe access to user information and tokens
 */
export function useSession() {
  const { data: session, status, update } = useNextAuthSession();

  // Session is invalid if there's a refresh error or no access token when authenticated
  const hasSessionError =
    session?.error === "RefreshAccessTokenError" ||
    (status === "authenticated" && !session?.accessToken);

  return {
    session,
    status,
    update,
    isLoading: status === "loading",
    isAuthenticated: status === "authenticated" && !hasSessionError,
    isUnauthenticated: status === "unauthenticated" || hasSessionError,
    user: session?.user,
    accessToken: session?.accessToken,
    refreshToken: session?.refreshToken,
    error: session?.error,
    hasSessionError,
  };
}
