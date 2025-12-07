"use client";

import { createCountry, updateCountry } from "@/actions/countries.actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
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
import { APIRes, ICountry } from "@/interfaces";
import { handleActionError } from "@/lib/error-handlers";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useState, ReactNode } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const countrySchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),
});

export type CountryForm = z.infer<typeof countrySchema>;

const CountryDialog = ({
  country,
  children,
}: {
  children?: ReactNode;
  country?: ICountry;
}) => {
  const isEdit = !!country;
  const [open, setOpen] = useState(false);
  const form = useForm<CountryForm>({
    resolver: zodResolver(countrySchema),
    defaultValues: {
      name: country?.name || "",
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (values: CountryForm) => {
    try {
      let res;
      if (isEdit) res = await updateCountry(country.id, values.name);
      else res = await createCountry(values.name);

      if (!res.success) throw res;
      toast.success(res.message);
      setOpen(false);
    } catch (error) {
      handleActionError(error as APIRes);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children ? (
          children
        ) : (
          <Button className="bg-main hover:bg-main/90">
            <Plus className="mr-2 h-4 w-4" /> Add Country
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Update" : "Create"} Country</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update country details."
              : "Add new country to your system"}
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
                    <Input placeholder="Egypt" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
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

export default CountryDialog;
