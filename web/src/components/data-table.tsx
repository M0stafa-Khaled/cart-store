"use client";
import type { ReactNode } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { IPaginationMeta } from "@/interfaces";
import { cn } from "@/lib/utils";
import PaginationDataTable from "./pagination-table";

export type ColumnDef<T> = {
  key: keyof T | "actions";
  header: ReactNode;
  cell?: (row: T) => ReactNode;
  className?: string;
};

export interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  emptyMessage?: string;
  meta?: IPaginationMeta;
}

export function DataTable<T extends object>({
  columns,
  data,
  emptyMessage = "No results.",
  meta,
}: DataTableProps<T>) {
  return (
    <>
      <div className="grid rounded-md border max-w-full">
        <Table className="overflow-hidden">
          <TableHeader>
            <TableRow>
              {columns.map((col) => (
                <TableHead
                  key={String(col.key)}
                  className={cn(col.className, "text-center")}
                >
                  {col.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data && data.length > 0 ? (
              data.map((row, rIdx) => (
                <TableRow key={rIdx}>
                  {columns.map((col, cIdx) => (
                    <TableCell
                      key={String(col.key) + cIdx}
                      className={cn(col.className, "text-center py-3")}
                    >
                      {col.cell
                        ? col.cell(row)
                        : ((row[col.key as keyof T] as unknown as ReactNode) ??
                          "Not Available")}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  className="h-24 text-center"
                  colSpan={columns.length}
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {meta && <PaginationDataTable meta={meta} />}
    </>
  );
}
