"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";

const CouponsFilters = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [code, setCode] = useState(searchParams.get("code") || "");

  const handleSearch = useDebouncedCallback((value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("code", value);
    } else {
      params.delete("code");
    }
    params.set("page", "1");
    router.replace(`${pathname}?${params.toString()}`);
  }, 500);

  return (
    <div className="relative max-w-lg">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Filter by code..."
        className="pl-8 h-10"
        value={code}
        onChange={(e) => {
          setCode(e.target.value);
          handleSearch(e.target.value);
        }}
      />
    </div>
  );
};

export default CouponsFilters;
