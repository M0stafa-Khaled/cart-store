"use client";

import {
  SessionProvider as NextSessionProvider,
  signOut,
  useSession,
} from "next-auth/react";
import { type ReactNode, useEffect } from "react";
import { toast } from "sonner";

const SessionManager = ({ children }: { children: ReactNode }) => {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.error === "RefreshAccessTokenError") {
      toast.warning("Session expired. Please sign in again.");
      (async () => {
        await signOut({ callbackUrl: "/auth/sign-in", redirect: true });
      })();
    }
  }, [session]);

  return <>{children}</>;
};

const SessionProvider = ({ children }: { children: ReactNode }) => {
  return (
    <NextSessionProvider>
      <SessionManager>{children}</SessionManager>
    </NextSessionProvider>
  );
};

export default SessionProvider;
