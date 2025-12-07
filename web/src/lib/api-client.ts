/**
 * * API Client for making requests to backend
 * * This utility handles authentication tokens and provides type safety API calls
 * * Implements automatic token refresh on 401 errors with retry logic
 */
import type { APIRes, IRefreshTokenRes } from "@/interfaces";
import { API_ROUTES, API_URL } from "./constants";
import { auth } from "./next-auth/auth";

/* ----------------------------------------------------
    * Global Token State
---------------------------------------------------- */
let currentTokens: {
  accessToken: string;
  refreshToken: string;
} | null = null;

type TokenProvider = () => Promise<{
  accessToken: string;
  refreshToken: string;
} | null>;

let globalTokenProvider: TokenProvider | null = null;

const setTokenProvider = (provider: TokenProvider) => {
  globalTokenProvider = provider;
};

class ApiClient {
  private baseUrl: string;
  private isRefreshing = false;
  private refreshSubscribers: ((t: string | null) => void)[] = [];
  private tokenProvider: TokenProvider | null = null;

  constructor(baseUrl: string = API_URL, tokenProvider?: TokenProvider) {
    this.baseUrl = baseUrl;
    this.tokenProvider = tokenProvider || globalTokenProvider;
  }

  /* Load tokens from provider or global */
  private async getTokens() {
    if (currentTokens) return currentTokens;

    const provider = this.tokenProvider || globalTokenProvider;
    if (!provider) return null;

    const tokens = await provider();
    if (tokens) currentTokens = tokens;
    return currentTokens;
  }

  private subscribeTokenRefresh(cb: (token: string | null) => void) {
    this.refreshSubscribers.push(cb);
  }

  private onTokenRefreshed(token: string | null) {
    this.refreshSubscribers.forEach((cb) => cb(token));
    this.refreshSubscribers = [];
  }

  private async refreshAccessToken(
    oldAccessToken: string,
    refreshToken: string
  ): Promise<string | null> {
    try {
      const res = await fetch(
        `${this.baseUrl}${API_ROUTES.AUTH.REFRESH_TOKEN}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${oldAccessToken}`,
            "x-refresh-token": refreshToken,
          },
        }
      );

      if (!res.ok) return null;

      const json: APIRes<IRefreshTokenRes> = await res.json();
      if (!json.success) return null;

      const newAcc = json.data?.accessToken || null;
      if (newAcc) {
        currentTokens = {
          accessToken: newAcc,
          refreshToken,
        };
      }

      return newAcc;
    } catch {
      return null;
    }
  }

  private async redirectToSignIn(): Promise<never> {
    if (typeof window !== "undefined") {
      const { signOut } = await import("next-auth/react");

      await signOut({ redirect: false });

      const current = window.location.pathname + window.location.search;
      const cb = encodeURIComponent(current);
      window.location.href = `/auth/sign-in?error=SessionExpired&callbackUrl=${cb}`;
      return new Promise<never>(() => {});
    }
    return new Promise<never>(() => {});
  }

  private async request<T>(
    endpoint: string,
    options: {
      method: "GET" | "POST" | "PATCH" | "DELETE";
      body?: unknown;
      isRetry?: boolean;
    }
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const tokens = await this.getTokens();
    const accessToken = tokens?.accessToken;
    const refreshToken = tokens?.refreshToken;

    const headers: HeadersInit = {};

    // Only set Content-Type for non-FormData requests
    const isFormData = options.body instanceof FormData;
    if (!isFormData) {
      headers["Content-Type"] = "application/json";
    }

    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }

    const config: RequestInit = {
      method: options.method,
      headers,
    };

    if (options.body) {
      // If it's FormData, pass it directly; otherwise stringify
      config.body = isFormData
        ? (options.body as FormData)
        : JSON.stringify(options.body);
    }

    let res: Response;

    try {
      res = await fetch(url, config);
    } catch (err) {
      throw {
        message: "Internal server error",
        success: false,
        error: err,
      };
    }
    /* 401 — need refresh */
    if (res.status === 401 && !options.isRetry) {
      if (!refreshToken) {
        await this.redirectToSignIn();
        throw new Error("Authentication required");
      }

      if (this.isRefreshing) {
        return new Promise<T>((resolve, reject) => {
          this.subscribeTokenRefresh(async (newToken) => {
            if (!newToken) {
              await this.redirectToSignIn();
              return reject(new Error("Session expired"));
            }

            try {
              const result = await this.request<T>(endpoint, {
                ...options,
                isRetry: true,
              });
              resolve(result);
            } catch (err) {
              reject(err);
            }
          });
        });
      }

      this.isRefreshing = true;

      try {
        const newToken = await this.refreshAccessToken(
          accessToken!,
          refreshToken
        );

        if (!newToken) {
          currentTokens = null;
          this.onTokenRefreshed(null);
          await this.redirectToSignIn();
          throw new Error("Session expired");
        }

        this.onTokenRefreshed(newToken);

        return this.request<T>(endpoint, {
          ...options,
          isRetry: true,
        });
      } finally {
        this.isRefreshing = false;
      }
    }

    /* Other non-OK responses */
    if (!res.ok) {
      const error: APIRes = await res.json();
      throw error;
    }
    return await res.json();
  }

  get<T>(endpoint: string) {
    return this.request<T>(endpoint, {
      method: "GET",
    });
  }

  post<T>(endpoint: string, data?: unknown) {
    return this.request<T>(endpoint, {
      method: "POST",
      body: data,
    });
  }

  patch<T>(endpoint: string, data?: unknown) {
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: data,
    });
  }

  delete<T>(endpoint: string) {
    return this.request<T>(endpoint, {
      method: "DELETE",
    });
  }
}

/* Create API instance */
const api = new ApiClient();

export const clearApiTokens = () => {
  currentTokens = null;
};

/* Provide tokens from NextAuth */
setTokenProvider(async () => {
  if (currentTokens) return currentTokens;

  const session = await auth();
  if (!session?.accessToken || !session.refreshToken) return null;

  currentTokens = {
    accessToken: session.accessToken,
    refreshToken: session.refreshToken,
  };

  return currentTokens;
});

export { api as apiClient };
