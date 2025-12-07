import { APIRes, IAuthRes, IUser, Role } from "@/interfaces";
import NextAuth, { DefaultSession, User } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { API_ROUTES, API_URL, NODE_ENV } from "@/lib/constants";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: IUser & DefaultSession["user"];
    accessToken: string;
    refreshToken: string;
    expiresAt: number;
    error?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    name: string;
    role: Role;
    isVerified: boolean;
    avatar: string;
    accessToken: string;
    refreshToken: string;
    expiresAt: number;
    error?: string;
  }
}

interface AuthUser extends User {
  role?: Role;
  avatar?: string | null;
  isVerified?: boolean;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: number;
}

const refreshAccessToken = async (token: JWT): Promise<JWT> => {
  try {
    const res = await fetch(`${API_URL}${API_ROUTES.AUTH.REFRESH_TOKEN}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-refresh-token": token.refreshToken,
      },
    });

    if (res.status === 401 || res.status === 403) {
      return {
        ...token,
        accessToken: "",
        refreshToken: "",
        expiresAt: 0,
        error: "RefreshAccessTokenError",
      };
    }

    if (!res.ok) throw new Error("Failed to refresh token");

    const refreshTokenRes: APIRes<IAuthRes> = await res.json();

    if (!refreshTokenRes.success) throw new Error(refreshTokenRes.message);

    const { user, accessToken, refreshToken, expiresIn }: IAuthRes =
      refreshTokenRes.data!;

    return {
      ...token,
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      isVerified: user.isVerified,
      accessToken,
      refreshToken,
      expiresAt: Date.now() + expiresIn * 1000,
      error: undefined,
    };
  } catch (_) {
    return {
      ...token,
      accessToken: "",
      refreshToken: "",
      expiresAt: 0,
      error: "RefreshAccessTokenError",
    };
  }
};

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize({ email, password }): Promise<AuthUser | null> {
        if (!email || !password)
          throw new Error("Email and password are required");

        try {
          const res = await fetch(`${API_URL}${API_ROUTES.AUTH.SIGN_IN}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
          });

          if (!res.ok) throw new Error("Invalid credentials");

          const json: APIRes<IAuthRes> = await res.json();

          if (!json.success) throw new Error("Invalid credentials");

          const { user, accessToken, refreshToken, expiresIn }: IAuthRes =
            json.data!;

          return {
            id: user?.id,
            email: user?.email,
            name: user?.name,
            role: user?.role,
            avatar: user?.avatar,
            isVerified: user?.isVerified,
            accessToken,
            refreshToken,
            expiresAt: Date.now() + expiresIn * 1000,
          };
        } catch (error) {
          throw error;
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/sign-in",
    error: "/auth/sign-in",
  },
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60,
  },

  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // Initial sign in
      if (user) {
        const authUser = user as AuthUser;
        return {
          ...token,
          id: user.id,
          name: authUser.name,
          email: authUser.email,
          role: authUser.role,
          avatar: authUser.avatar,
          isVerified: authUser.isVerified,
          accessToken: authUser.accessToken,
          refreshToken: authUser.refreshToken,
          expiresAt: authUser.expiresAt,
        };
      }

      if (trigger === "update" && session?.user) {
        if (session.user.name) token.name = session.user.name;
        if (session.user.email) token.email = session.user.email;
        if (session.user.role) token.role = session.user.role;
        if (session.user.avatar) token.avatar = session.user.avatar;
      }

      // handle session updates
      if (trigger === "update" && session)
        return {
          ...token,
          ...session,
        };

      if (Date.now() < token.expiresAt) {
        return token;
      }

      return refreshAccessToken(token);
    },

    async session({ session, token }) {
      if (token) {
        // If there's a refresh error, mark session as invalid
        if (token.error === "RefreshAccessTokenError") {
          session.error = token.error;
          session.accessToken = "";
          session.refreshToken = "";
          session.expiresAt = 0;
          return session;
        }

        session.user = {
          ...session.user,
          id: token.id,
          email: token.email,
          name: token.name,
          role: token.role,
          avatar: token.avatar,
          isVerified: token.isVerified,
        };
        session.accessToken = token.accessToken;
        session.refreshToken = token.refreshToken;
        session.expiresAt = token.expiresAt;
        session.error = token.error;
      }
      return session;
    },
  },
  debug: NODE_ENV === "development",
});
