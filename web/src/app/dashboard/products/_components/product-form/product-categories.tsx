"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IBrand, ICategory, ISubCategory } from "@/interfaces";
import { UseFormReturn, useWatch } from "react-hook-form";

interface ProductCategoriesProps {
  form: UseFormReturn<any>;
  categories: ICategory[];
  subCategories: ISubCategory[];
  brands: IBrand[];
}

export const ProductCategories = ({
  form,
  categories,
  subCategories,
  brands,
}: ProductCategoriesProps) => {
  // Watch the category field to filter subcategories
  const selectedCategoryId = useWatch({
    control: form.control,
    name: "categoryId",
  });

  const filteredSubCategories = subCategories.filter(
    (sub) => sub.category.id === selectedCategoryId
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Categories & Brand</CardTitle>
        <CardDescription>
          Select the category, subcategory, and brand for this product.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                  form.setValue("subCategoryId", "");
                }}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger className="w-full h-11!">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.length ? (
                    categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="disabled" disabled>
                      No categories available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="subCategoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subcategory</FormLabel>
              <Select
                key={selectedCategoryId}
                onValueChange={field.onChange}
                value={field.value}
                disabled={!selectedCategoryId}
              >
                <FormControl>
                  <SelectTrigger className="w-full h-11!">
                    <SelectValue placeholder="Select subcategory" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {filteredSubCategories.length ? (
                    filteredSubCategories.map((subCategory) => (
                      <SelectItem key={subCategory.id} value={subCategory.id}>
                        {subCategory.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="disabled" disabled>
                      No subcategories available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="brandId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Brand</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full h-11!">
                    <SelectValue placeholder="Select brand" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {brands.length ? (
                    brands.map((brand) => (
                      <SelectItem key={brand.id} value={brand.id}>
                        {brand.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="disabled" disabled>
                      No brands available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};
