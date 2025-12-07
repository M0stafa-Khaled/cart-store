"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useDebouncedCallback } from "use-debounce";

const CountriesFilters = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [name, setName] = useState<string>(searchParams.get("name") || "");

  const handleSearch = useDebouncedCallback((value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("name", value);
    } else {
      params.delete("name");
    }
    params.set("page", "1");
    router.replace(`${pathname}?${params.toString()}`);
  }, 500);

  return (
    <div className="relative max-w-lg">
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
  );
};

export default CountriesFilters;
