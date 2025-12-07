"use client";
import { signOutAction } from "@/actions/auth.actions";
import { APIRes } from "@/interfaces";
import { handleActionError } from "@/lib/error-handlers";
import { signOut } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

export const useSignOut = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleSignOut = async () => {
    startTransition(async () => {
      try {
        await signOutAction();
        await signOut({ redirect: false });

        if (pathname !== "/") router.push("/auth/sign-in");
        toast.success("Signed out successfully");
      } catch (error) {
        handleActionError(error as APIRes);
      }
    });
  };
  return { handleSignOut, isPending };
};
