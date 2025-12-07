"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export function DashboardBreadcrumb() {
  const pathname = usePathname();

  const segments = pathname.split("/").filter((segment) => segment !== "");

  const breadcrumbs = segments.map((segment, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/");
    const name = segment;

    const isLast = index === segments.length - 1;

    return {
      name,
      href,
      isLast,
    };
  });

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbs.map((breadcrumb) => (
          <span key={breadcrumb.href} className="flex items-center">
            <BreadcrumbItem>
              {breadcrumb.isLast ? (
                <BreadcrumbPage className="capitalize">
                  {breadcrumb.name}
                </BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  {breadcrumb.href === "/dashboard" ? (
                    <Link href="/dashboard" className="flex items-center gap-1">
                      <Home className="h-4 w-4" />
                      <span className="hidden sm:inline">Dashboard</span>
                    </Link>
                  ) : (
                    <Link
                      href={breadcrumb.href}
                      className="capitalize hover:underline"
                    >
                      {breadcrumb.name}
                    </Link>
                  )}
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {!breadcrumb.isLast && <BreadcrumbSeparator />}
          </span>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
