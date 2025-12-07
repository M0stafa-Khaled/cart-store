"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ICategory } from "@/interfaces";
import { Filter, Search, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";

const SubCategoriesFilters = ({ categories }: { categories: ICategory[] }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [name, setName] = useState(searchParams.get("name") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");

  const handleSearch = useDebouncedCallback((value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("name", value);
    } else {
      params.delete("name");
    }
    router.replace(`${pathname}?${params.toString()}`);
  }, 500);

  const handleCategoryChange = (value: string) => {
    setCategory(value);
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") {
      params.set("category", value);
    } else {
      params.delete("category");
    }
    router.replace(`${pathname}?${params.toString()}`);
  };

  const clearFilters = () => {
    setName("");
    setCategory("");
    router.replace(pathname);
  };

  const hasActiveFilters = Object.values({ name, category }).some(
    (value) => !!value
  );

  return (
    <Card className="p-4">
      <div className="flex items-center gap-2">
        <Filter className="w-5 h-5 text-muted-foreground" />
        <h3 className="font-semibold">Filters</h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="ml-auto gap-2"
          >
            <X className="w-4 h-4" />
            Clear All
          </Button>
        )}
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <div className="relative sm:col-span-2 md:col-span-2">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Filter by name..."
            className="pl-8 h-10"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              handleSearch(e.target.value);
            }}
          />
        </div>

        <Select value={category} onValueChange={handleCategoryChange}>
          <SelectTrigger className="h-10 w-full">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories?.map((cat) => (
              <SelectItem key={cat.id} value={cat.name}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </Card>
  );
};

export default SubCategoriesFilters;
