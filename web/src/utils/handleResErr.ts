"use client";
import { APIRes } from "@/interfaces";
import { toast } from "sonner";

export const handleResErr = (error: APIRes) => {
  if (
    error?.message &&
    (!Array.isArray(error?.error) || !error?.error?.length)
  ) {
    toast.error(error?.message || "An unexpected error occurred.");
    return;
  }

  if (error?.error && Array.isArray(error?.error)) {
    error.error.forEach((err) => {
      toast.error(err?.errors[0]);
    });
    return;
  }

  return toast.error("An unexpected error occurred.");
};
