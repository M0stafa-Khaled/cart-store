"use client";

import {
  createCouponAction,
  updateCouponAction,
} from "@/actions/coupons.actions";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { APIRes, ICoupon } from "@/interfaces/index";
import { handleActionError } from "@/lib/error-handlers";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { ReactNode, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const CouponSchema = z.object({
  code: z.string().min(3, { message: "Code must be at least 3 characters" }),
  discountType: z.enum(["PERCENTAGE", "FIXED"]),
  discountValue: z.coerce.number<number>().min(1, "Value must be at least 1"),
  maxUsage: z.coerce.number<number>().min(1, "Max usage must be at least 1"),
  minOrderValue: z.coerce.number<number>().optional(),
  expiredAt: z.string().refine((val) => new Date(val) > new Date(), {
    message: "Expiration date must be in the future",
  }),
  isActive: z.boolean().optional(),
});

export type CouponForm = z.infer<typeof CouponSchema>;

const CouponDialog = ({
  coupon,
  children,
}: {
  coupon?: ICoupon;
  children?: ReactNode;
}) => {
  const isEdit = !!coupon;
  const [open, setOpen] = useState(false);
  const form = useForm<CouponForm>({
    resolver: zodResolver(CouponSchema),
    defaultValues: {
      code: coupon?.code || "",
      discountType: coupon?.discountType || "PERCENTAGE",
      discountValue: coupon?.discountValue || 0,
      maxUsage: coupon?.maxUsage || 0,
      minOrderValue: coupon?.minOrderValue || 0,
      expiredAt: coupon?.expiredAt
        ? new Date(coupon?.expiredAt).toISOString().slice(0, 16)
        : "",
      isActive: coupon?.isActive || false,
    },
  });

  const onSubmit = async (values: CouponForm) => {
    try {
      let res;
      if (isEdit) {
        res = await updateCouponAction(coupon.id, {
          ...values,
          expiredAt: new Date(values.expiredAt).toISOString(),
        });
      } else {
        res = await createCouponAction(values);
      }
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
            <Plus className="mr-2 h-4 w-4" /> Create Coupon
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Update Coupon" : "Add Coupon"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update coupon details."
              : "Add a new discount coupon for your customers."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Code</FormLabel>
                  <FormControl>
                    <Input placeholder="SUMMER2024" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="discountType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={"PERCENTAGE"}>
                          Percentage (%)
                        </SelectItem>
                        <SelectItem value={"FIXED"}>Fixed Amount</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="discountValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Value</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="maxUsage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Usage</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="minOrderValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Min Order Value
                      <span className="text-muted-foreground">(optional)</span>
                    </FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="expiredAt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expiration Date</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Active Status</FormLabel>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
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

export default CouponDialog;
