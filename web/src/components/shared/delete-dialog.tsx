"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { buttonVariants } from "@/components/ui/button";
import { OctagonAlert } from "lucide-react";
import { useState, useTransition, type PropsWithChildren } from "react";
import { toast } from "sonner";
import { APIRes } from "@/interfaces";
import { handleActionError } from "@/lib/error-handlers";

type DeleteDialogProps = PropsWithChildren<{
  id: string;
  name?: string;
  deleteHandler: (id: string) => Promise<APIRes<void>>;
}>;

const DeleteDialog = ({
  id,
  name,
  children,
  deleteHandler,
}: DeleteDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const onConfirm = async () => {
    setError(null);
    startTransition(async () => {
      try {
        const res = await deleteHandler(id);
        if (!res.success) throw res;

        toast.success(res.message);
        setIsOpen(false);
      } catch (error) {
        handleActionError(error as APIRes);
        setError((error as APIRes).message);
      }
    });
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader className="items-center text-center">
          <AlertDialogTitle>
            <div className="mb-2 mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
              <OctagonAlert className="h-7 w-7 text-destructive" />
            </div>
            Delete {name ? `\"${name}\"` : "this item"}?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-[15px] text-center">
            This action cannot be undone and will permanently remove the &apos;
            {name}&apos;.
          </AlertDialogDescription>
        </AlertDialogHeader>
        {error && (
          <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <AlertDialogFooter className="mt-2 sm:justify-center gap-2">
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              onConfirm();
            }}
            disabled={isPending}
            className={buttonVariants({ variant: "destructive" })}
          >
            {isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteDialog;
