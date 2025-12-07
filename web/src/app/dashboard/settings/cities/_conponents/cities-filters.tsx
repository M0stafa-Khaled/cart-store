"use client";

import { useDebounce } from "@/hooks/use-debounce";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ICountry } from "@/interfaces";
import { Filter, Search, X } from "lucide-react";
import { Card } from "@/components/ui/card";

const CitiesFilters = ({ countries }: { countries: ICountry[] }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [name, setName] = useState<string>(searchParams.get("name") || "");
  const [country, setCountry] = useState<string | null>(
    searchParams.get("country") || null
  );

  const debouncedName = useDebounce(name, 350);
  const debouncedCountry = useDebounce(country, 350);

  const buildQueryString = useMemo(
    () => (updates: Record<string, string | number | null | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === undefined || value === "")
          params.delete(key);
        else params.set(key, String(value));
      });
      return params.toString();
    },
    [searchParams]
  );

  useEffect(() => {
    router.replace(
      `${pathname}?${buildQueryString({
        name: debouncedName,
        country: debouncedCountry,
      })}`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedName, debouncedCountry]);

  const clearFilters = () => {
    if (!name && !country) return;
    setName("");
    setCountry(null);
    router.replace(
      `${pathname}?${buildQueryString({ name: null, country: null })}`
    );
  };

  const hasActiveFilters = Object.values({ name, country }).some(
    (value) => !value
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
      <div className="grid gap-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <div className="relative sm:col-span-2 md:col-span-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Filter by name..."
            className="pl-8 h-10"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
        </div>
        <Select
          value={country || ""}
          onValueChange={(v) =>
            v !== "all" ? setCountry(v) : setCountry(null)
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Filter by country" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {countries.map((country) => (
              <SelectItem key={country.id} value={country.name}>
                {country.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </Card>
  );
};

export default CitiesFilters;
