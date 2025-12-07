"use client";

import { checkAuthAction } from "@/actions/auth.actions";
import { useSession } from "@/hooks/use-session";
import { signOut } from "next-auth/react";
import { ReactNode, useEffect } from "react";
import { toast } from "sonner";

const PersistAuth = ({ children }: { children: ReactNode }) => {
  const { session } = useSession();
  useEffect(() => {
    if (!session?.accessToken) return;
    (async () => {
      const res = await checkAuthAction();
      if (!res.success || !res.data?.auth) {
        signOut({ redirect: true, redirectTo: "/auth/sign-in" });
        toast.warning("Session expired. Please sign in again.");
      }
    })();
  }, [session?.accessToken]);

  return children;
};

export default PersistAuth;
