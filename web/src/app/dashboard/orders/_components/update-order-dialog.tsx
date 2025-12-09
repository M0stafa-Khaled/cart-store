"use client";

import { ReactNode, useState } from "react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateOrderAction } from "@/actions/orders.actions";
import { toast } from "sonner";
import { IOrder } from "@/interfaces";
import { Edit, Loader2 } from "lucide-react";
import { handleActionError } from "@/lib/error-handlers";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface UpdateOrderDialogProps {
  order: IOrder;
  userId: string;
  children?: ReactNode;
}
const updateOrderSchema = z.object({
  status: z.enum(["PENDING", "COMPLETED", "CANCELLED"]).optional(),
  isDelivered: z.boolean().optional(),
});

export type UpdateOrderForm = z.infer<typeof updateOrderSchema>;

export const UpdateOrderDialog = ({
  order,
  userId,
  children,
}: UpdateOrderDialogProps) => {
  const [open, setOpen] = useState(false);

  const form = useForm<UpdateOrderForm>({
    resolver: zodResolver(updateOrderSchema),
    defaultValues: {
      status: order.status,
      isDelivered: order.isDelivered,
    },
  });

  const handleSubmit = async (data: UpdateOrderForm) => {
    try {
      const res = await updateOrderAction(order.id, data, userId);

      if (res.success) {
        toast.success("Order updated successfully");
        setOpen(false);
      } else {
        toast.error(res.message || "Failed to update order");
      }
    } catch (error) {
      handleActionError(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children ? (
          children
        ) : (
          <Button variant="outline" size="sm" className="gap-2">
            <Edit className="w-4 h-4" />
            Update
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <DialogHeader>
              <DialogTitle>Update Order</DialogTitle>
              <DialogDescription>
                Update the order status and payment information
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue
                              placeholder="Select order status"
                              className="w-full"
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={"PENDING"}>Pending</SelectItem>
                          <SelectItem value={"COMPLETED"}>Completed</SelectItem>
                          <SelectItem value={"CANCELLED"}>Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="isDelivered"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Delivery Status</FormLabel>
                      <Select
                        onValueChange={(value) =>
                          field.onChange(value === "true")
                        }
                        defaultValue={String(field.value)}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue
                              placeholder="Select delivery status"
                              className="w-full"
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={"true"}>Delivered</SelectItem>
                          <SelectItem value={"false"}>Not Delivered</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={form.formState.isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="bg-main hover:bg-main/90"
              >
                {form.formState.isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Update Order
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
