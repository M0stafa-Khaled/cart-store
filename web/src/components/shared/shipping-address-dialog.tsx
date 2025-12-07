"use client";

import { useState, useEffect, ReactNode } from "react";
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  createShippingAddressAction,
  updateShippingAddressAction,
} from "@/actions/shipping-addresses.actions";
import { getAllCities } from "@/actions/cities.actions";
import { toast } from "sonner";
import { Loader2, Pencil, Plus } from "lucide-react";
import { ICity, ICountry, IShippingAddress } from "@/interfaces";
import { handleActionError } from "@/lib/error-handlers";
import { getAllCountries } from "@/actions/countries.actions";
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

interface AddShippingAddressDialogProps {
  onSuccess?: () => void;
  children?: ReactNode;
  address?: IShippingAddress;
}

const shippingAddressSchema = z.object({
  countryId: z.string().nonempty("Country is required"),
  cityId: z.string().nonempty("City is required"),
  phone: z.coerce.number<number>().min(10, "Invalid phone nubmber"),
  address: z.string().nonempty("Address is required"),
});

export type ShippingAddressForm = z.infer<typeof shippingAddressSchema>;

export const ShippingAddressDialog = ({
  onSuccess,
  children,
  address,
}: AddShippingAddressDialogProps) => {
  const isEdit = !!address;
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [cities, setCities] = useState<ICity[]>([]);
  const [countries, setCountries] = useState<ICountry[]>([]);

  const form = useForm<ShippingAddressForm>({
    resolver: zodResolver(shippingAddressSchema),
    defaultValues: {
      countryId: address?.city.country.id || "",
      cityId: address?.city.id || "",
      phone: Number(address?.phone) || Number(""),
      address: address?.address || "",
    },
  });

  useEffect(() => {
    if (open) {
      loadCities();
      loadCountires();
    }
  }, [open]);

  const loadCities = async () => {
    try {
      const response = await getAllCities({});
      if (response.success && response.data) {
        setCities(response.data);
      }
    } catch (error) {
      handleActionError(error);
    }
  };

  const loadCountires = async () => {
    try {
      const response = await getAllCountries({});
      if (response.success && response.data) {
        setCountries(response.data);
      }
    } catch (error) {
      handleActionError(error);
    }
  };

  const handleSubmit = async (data: ShippingAddressForm) => {
    setIsLoading(true);

    let res;
    try {
      if (isEdit) {
        res = await updateShippingAddressAction(address.id, data);
      } else {
        res = await createShippingAddressAction(data);
      }

      if (res.success) {
        toast.success(
          res.message ||
            (isEdit
              ? "Shipping address updated successfully"
              : "Shipping address added successfully")
        );
        setOpen(false);
        form.reset();
        onSuccess?.();
      } else {
        throw res;
      }
    } catch (error) {
      handleActionError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCities = cities.filter((city) => {
    return city.country.id === form.watch("countryId");
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        form.reset();
      }}
    >
      <DialogTrigger asChild>
        {children ? (
          children
        ) : (
          <Button variant="outline" className="gap-2">
            {isEdit ? (
              <>
                <Pencil className="w-4 h-4" />
                Update Address
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Add Address
              </>
            )}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <DialogHeader>
              <DialogTitle>
                {isEdit ? "Update" : "Add"} Shipping Address
              </DialogTitle>
              <DialogDescription>
                {isEdit ? "Update" : "Add"} your shipping address
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="countryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a country" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {countries.map((country) => (
                            <SelectItem key={country.id} value={country.id}>
                              {country.name}
                            </SelectItem>
                          ))}
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
                  name="cityId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={!form.watch("countryId")}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a city" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {filteredCities.map((city) => (
                            <SelectItem key={city.id} value={city.id}>
                              {city.name}
                            </SelectItem>
                          ))}
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
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="01234567890"
                          {...field}
                          inputMode="numeric"
                          pattern="[0-9]*"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Street Address</FormLabel>
                      <FormControl>
                        <Input placeholder="123 Main St, Apt 4B" {...field} />
                      </FormControl>
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
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-main hvoer:bg-main"
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEdit ? "Update" : "Add"} Address
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
