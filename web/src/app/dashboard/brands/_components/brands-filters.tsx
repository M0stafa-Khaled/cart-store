"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";

const BrandsFilters = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [name, setName] = useState(searchParams.get("name") || "");

  const handleSearch = useDebouncedCallback((value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("name", value);
    } else {
      params.delete("name");
    }
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

export default BrandsFilters;
