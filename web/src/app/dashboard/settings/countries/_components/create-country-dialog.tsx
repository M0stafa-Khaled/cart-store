"use client";

import { createCountry } from "@/actions/countries.actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Loader from "@/components/ui/loader";
import { APIRes } from "@/interfaces";
import { handleActionError } from "@/lib/error-handlers";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const createCountrySchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),
});

export type CreateCountryForm = z.infer<typeof createCountrySchema>;

const CreateCountryDialog = () => {
  const [open, setOpen] = useState(false);
  const form = useForm<CreateCountryForm>({
    resolver: zodResolver(createCountrySchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (values: CreateCountryForm) => {
    try {
      const res = await createCountry(values.name);
      if (!res.success) throw res;

      toast.success(res.message);
      form.reset();
      setOpen(false);
    } catch (error) {
      handleActionError(error as APIRes);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-main hover:bg-main/90">
          <Plus className="mr-2 h-4 w-4" /> Add Country
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Country</DialogTitle>
          <DialogDescription>
            Create a new country to your store.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Country name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button className="bg-black/70 hover:bg-black/60">
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                onClick={form.handleSubmit(onSubmit)}
                className="bg-main hover:bg-main/90"
              >
                {form.formState.isSubmitting ? (
                  <>
                    <Loader size={15} color="white" />
                    <span className="mx-2">Saving...</span>
                  </>
                ) : (
                  "Save"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCountryDialog;
