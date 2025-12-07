"use client";
import { createCityAction, updateCityAction } from "@/actions/cities.actions";
import { ICity, ICountry, APIRes } from "@/interfaces";
import { toast } from "sonner";
import { z } from "zod";
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
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ReactNode, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";

import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Loader from "@/components/ui/loader";
import { handleActionError } from "@/lib/error-handlers";

const citySchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),
  countryId: z.string().nonempty({ message: "Country is required" }),
  shippingPrice: z
    .string({})
    .min(0, { message: "Shipping price must be at least 0" }),
});

export type CityForm = z.infer<typeof citySchema>;

const CityDialog = ({
  countries,
  city,
  children,
}: {
  countries: ICountry[];
  city?: ICity;
  children?: ReactNode;
}) => {
  const isEdit = !!city;
  const [dialogOpen, setDialogOpen] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const form = useForm<CityForm>({
    resolver: zodResolver(citySchema),
    defaultValues: {
      name: city?.name || "",
      countryId: city?.country.id || "",
      shippingPrice: city?.shippingPrice.toString() || "",
    },
  });

  const onSubmit = async (body: CityForm) => {
    try {
      let res;
      if (isEdit) {
        res = await updateCityAction(city.id, body);
      } else {
        res = await createCityAction(body);
      }
      if (!res.success) throw res;

      toast.success(res.message);
      form.reset();
      setDialogOpen(false);
    } catch (error) {
      const apiError = error as APIRes;
      handleActionError(apiError);
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        {children ? (
          children
        ) : (
          <Button className="gap-2 bg-main hover:bg-main/90">
            <Plus className="h-4 w-4" /> Add City
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-4"
          >
            <DialogHeader>
              <DialogTitle>{isEdit ? "Update" : "Add"} city</DialogTitle>
              <DialogDescription>
                {isEdit ? "Updade city details" : "Add new city to the system"}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="shippingPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Shipping Price</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Shipping price"
                        type="number"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="countryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={popoverOpen}
                            className="justify-between h-10"
                          >
                            {field.value
                              ? countries.find(
                                  (country) => country.id === field.value
                                )?.name
                              : "Select country..."}
                            <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[280px] p-0">
                          <Command>
                            <CommandInput placeholder="Search country..." />
                            <CommandList>
                              <CommandEmpty>No country found.</CommandEmpty>
                              <CommandGroup>
                                {countries.map((country) => (
                                  <CommandItem
                                    key={country.id}
                                    value={country.id}
                                    onSelect={(currentValue) => {
                                      field.onChange(currentValue);
                                      setPopoverOpen(false);
                                    }}
                                  >
                                    <CheckIcon
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        field.value === country.id
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                    {country.name}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button className="bg-black/70 hover:bg-black/60">
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

export default CityDialog;
