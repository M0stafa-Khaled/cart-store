"use client";
import { IPaginationMeta } from "@/interfaces";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const PaginationDataTable = ({ meta }: { meta: IPaginationMeta }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page") ?? meta.page ?? 20);
  const currentLimit = Number(searchParams.get("limit") ?? meta.limit ?? 10);
  const buildQueryString = (
    updates: Record<string, string | number | null>
  ) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === undefined || value === "")
        params.delete(key);
      else params.set(key, String(value));
    });
    return params.toString();
  };

  const setPage = (page: number) => {
    const qs = buildQueryString({ page, limit: currentLimit });
    router.push(`${pathname}?${qs}`);
  };

  const setLimit = (limit: number) => {
    // Reset to first page when limit changes
    const qs = buildQueryString({ page: 1, limit });
    router.push(`${pathname}?${qs}`);
  };


  return (
    <div className="w-full flex flex-col md:flex-row items-center justify-between gap-2 mt-4">
      <div className="flex items-center gap-2">
        <Label className="whitespace-nowrap">Rows per page:</Label>
        <Select
          value={String(currentLimit)}
          onValueChange={(rowsPerPage) => setLimit(Number(rowsPerPage))}
        >
          <SelectTrigger>
            <SelectValue placeholder={String(currentLimit)} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="20">20</SelectItem>
            <SelectItem value="50">50</SelectItem>
            <SelectItem value="100">100</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-2">
        <span className="text-sm text-muted-foreground whitespace-nowrap">
          {meta.page} of {meta.totalPages}
        </span>

        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <Button
                variant="outline"
                size="sm"
                aria-label="Go to previous page"
                disabled={!meta.hasPrevPage}
                onClick={() => meta.hasPrevPage && setPage(currentPage - 1)}
              >
                <ChevronLeftIcon className="h-4 w-4" />
                Previous
              </Button>
            </PaginationItem>
            <PaginationItem>
              <Button
                variant="outline"
                size="sm"
                aria-label="Go to next page"
                disabled={!meta.hasNextPage}
                onClick={() => meta.hasNextPage && setPage(currentPage + 1)}
              >
                Next
                <ChevronRightIcon className="h-4 w-4" />
              </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default PaginationDataTable;
