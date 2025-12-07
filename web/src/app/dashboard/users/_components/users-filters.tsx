"use client";
import type { IUserParams, Role } from "@/interfaces";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useDebounce } from "@/hooks/use-debounce";
import { Filter, X } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";
import { Card } from "@/components/ui/card";

const UsersFilters = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [q, setQ] = useState<string | null>(searchParams.get("q") ?? null);
  const filters = useMemo(
    () => ({
      role: (searchParams.get("role") as Role | null) ?? null,
      active: searchParams.get("active"),
      isVerified: searchParams.get("isVerified"),
    }),
    [searchParams]
  );

  const debouncedQ = useDebounce(q, 350);

  const buildQueryString = useMemo(
    () => (updates: Record<string, string | number | null | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (
          value === null ||
          value === undefined ||
          value === "all" ||
          value === ""
        )
          params.delete(key);
        else params.set(key, String(value));
      });
      return params.toString();
    },
    [searchParams]
  );

  const setFilters = (updates: Partial<IUserParams>) => {
    const qs = buildQueryString(
      updates as Record<string, string | number | null>
    );
    router.replace(`${pathname}?${qs}`);
  };

  useEffect(() => {
    setFilters({ q: debouncedQ });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQ]);

  const hasActiveFilters = Object.values(filters).some((value) => !!value);

  const clearFilters = () => {
    setQ(null);
    setFilters({
      q: null,
      role: undefined,
      active: undefined,
      isVerified: undefined,
    });
  };

  const { open } = useSidebar();
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
      <div
        className={`grid grid-cols-1  ${
          open ? "lg:grid-cols-2" : "lg:grid-cols-4"
        } md:grid-cols-2 xl:grid-cols-4 gap-2`}
      >
        <Input
          placeholder="Search users..."
          value={q || ""}
          onChange={(e) => setQ(e.target.value)}
        />

        <Select
          value={filters.role ?? "all"}
          onValueChange={(v) => setFilters({ role: v })}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Role (all)" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="ADMIN">Admin</SelectItem>
            <SelectItem value="USER">User</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.active ?? "all"}
          onValueChange={(v) => setFilters({ active: v === "true" })}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Active (all)" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="true">Active</SelectItem>
            <SelectItem value="false">Inactive</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.isVerified ?? "all"}
          onValueChange={(v) => setFilters({ isVerified: v === "true" })}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Verified (all)" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="true">Verified</SelectItem>
            <SelectItem value="false">Not verified</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </Card>
  );
};

export default UsersFilters;
