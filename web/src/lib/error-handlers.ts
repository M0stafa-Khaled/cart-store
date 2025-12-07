"use client";
import type { APIRes } from "@/interfaces";
import { toast } from "sonner";

export const getErrorMessage = (error: unknown): string => {
  let message;

  if (typeof error === "string") message = error;
  else if (
    error &&
    typeof error === "object" &&
    "message" in error &&
    typeof error.message === "string"
  )
    message = error.message;
  else if (error instanceof Error) message = error.message;
  else return "An unexpected error occurred";

  return message;
};

export const handleActionError = (error: unknown, fallbackMessage?: string) => {
  const err = error as APIRes
  const message = getErrorMessage(err) || fallbackMessage || "Action Failed";
  if (message && (!Array.isArray(err?.error) || !err?.error?.length)) {
    toast.error(message || "An unexpected error occurred.");
    return;
  }

  if (err?.error && Array.isArray(err?.error)) {
    err.error.forEach((er) => {
      toast.error(er?.errors[0]);
    });
    return;
  }

  return toast.error(message);
};
