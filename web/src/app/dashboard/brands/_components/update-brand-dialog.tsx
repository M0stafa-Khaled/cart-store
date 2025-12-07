"use client";

import { updateBrandAction } from "@/actions/brand.actions";
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
import { APIRes, IBrand } from "@/interfaces/index";
import { handleActionError } from "@/lib/error-handlers";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload, X } from "lucide-react";
import Image from "next/image";
import { ReactNode, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const updateBrandSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),
  image: z
    .instanceof(File)
    .refine((file) => file.size <= 5 * 1024 * 1024, {
      message: "Image must be less than 5MB",
    })
    .refine(
      (file) =>
        ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(
          file.type
        ),
      { message: "Only .jpg, .jpeg, .png and .webp formats are supported" }
    )
    .optional(),
});

type UpdateBrandFormData = z.infer<typeof updateBrandSchema>;

const UpdateBrandDialog = ({
  brand,
  children,
}: {
  brand: IBrand;
  children: ReactNode;
}) => {
  const [open, setOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<UpdateBrandFormData>({
    resolver: zodResolver(updateBrandSchema),
    defaultValues: {
      name: brand.name,
    },
  });

  const onSubmit = async (values: UpdateBrandFormData) => {
    try {
      const formData = new FormData();
      formData.append("name", values.name);

      if (values.image) {
        formData.append("image", values.image);
      }

      const res = await updateBrandAction(brand.id, formData);
      if (!res.success) throw res;

      toast.success(res.message);
      setImagePreview(null);
      setOpen(false);
    } catch (error) {
      handleActionError(error as APIRes);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("image", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    form.setValue("image", undefined);
    setImagePreview(null);
  };

  const currentImage = imagePreview || brand.image;

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        if (!open) {
          form.reset({
            name: brand.name,
          });
          setImagePreview(null);
        }
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Update Brand</DialogTitle>
          <DialogDescription>
            Make changes to the brand information.
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
                    <Input placeholder="Nike" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image"
              render={({
                field: { value: _value, onChange: _onChange, ...field },
              }) => (
                <FormItem>
                  <FormLabel>
                    Image{" "}
                    {!imagePreview &&
                      "(Optional - leave empty to keep current)"}
                  </FormLabel>
                  <FormControl>
                    <div className="space-y-3">
                      <div className="relative w-full h-48 rounded-lg overflow-hidden border">
                        <Image
                          src={currentImage}
                          alt="Preview"
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover"
                        />
                        {imagePreview && (
                          <button
                            type="button"
                            onClick={removeImage}
                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </div>

                      <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                        <div className="flex flex-col items-center justify-center">
                          <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">
                            <span className="font-semibold">
                              Click to change image
                            </span>
                          </p>
                          <p className="text-xs text-muted-foreground">
                            PNG, JPG, JPEG or WEBP (MAX. 5MB)
                          </p>
                        </div>
                        <Input
                          type="file"
                          className="hidden"
                          accept="image/png,image/jpeg,image/jpg,image/webp"
                          onChange={handleImageChange}
                          {...field}
                        />
                      </label>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" className="bg-black/70 hover:bg-black/60">
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="bg-main hover:bg-main/90"
              >
                {form.formState.isSubmitting ? (
                  <>
                    <Loader size={15} color="white" />
                    <span className="mx-2">Updating...</span>
                  </>
                ) : (
                  "Update"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateBrandDialog;
