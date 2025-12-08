"use client";

import {
  createSubCategoryAction,
  updateSubCategoryAction,
} from "@/actions/sub-categories.actions";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Loader from "@/components/ui/loader";
import { APIRes, ICategory, ISubCategory } from "@/interfaces/index";
import { handleActionError } from "@/lib/error-handlers";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReactNode, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Plus } from "lucide-react";

const subCategorySchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),
  categoryId: z.string().min(1, { message: "Please select a category" }),
});

export type SubCategoryForm = z.infer<typeof subCategorySchema>;

const SubCategoryDialog = ({
  subCategory,
  categories,
  children,
}: {
  subCategory?: ISubCategory;
  categories: ICategory[];
  children?: ReactNode;
}) => {
  const isEdit = !!subCategory;
  const [open, setOpen] = useState(false);

  const form = useForm<SubCategoryForm>({
    resolver: zodResolver(subCategorySchema),
    defaultValues: {
      name: subCategory?.name || "",
      categoryId: subCategory?.category.id || "",
    },
  });

  const onSubmit = async (values: SubCategoryForm) => {
    try {
      let res;
      if (isEdit) {
        res = await updateSubCategoryAction(subCategory.id, values);
      } else {
        res = await createSubCategoryAction(values);
      }
      if (!res.success) throw res;

      toast.success(res.message);
      form.reset()
      setOpen(false);
    } catch (error) {
      handleActionError(error as APIRes);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        if (!open) {
          form.reset({
            name: subCategory?.name || "",
            categoryId: subCategory?.category.id || "",
          });
        }
      }}
    >
      <DialogTrigger asChild>
        {children ? (
          children
        ) : (
          <Button className="bg-main hover:bg-main/90">
            <Plus className="mr-2 h-4 w-4" /> {isEdit ? "Update" : "Create"} Sub
            Category
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Update" : "Create"} Sub Category</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Make changes to the sub category information."
              : "Add a new sub category."}
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
                    <Input placeholder="Smartphones" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <DialogClose asChild disabled={form.formState.isSubmitting}>
                <Button type="button" className="bg-black/70 hover:bg-black/60">
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="bg-main hover:bg-main"
              >
                {form.formState.isSubmitting ? (
                  <>
                    <Loader size={15} color="white" />
                    <span className="mx-2">
                      {isEdit ? "Updating" : "Creating"}...
                    </span>
                  </>
                ) : isEdit ? (
                  "Update"
                ) : (
                  "Create"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default SubCategoryDialog;
