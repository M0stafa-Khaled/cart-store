import { AppSidebar } from "./_components/sidebar/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { DashboardBreadcrumb } from "./_components/sidebar/dashboard-breadcrumb";
import type { Metadata } from "next";
import { requireAdmin } from "@/lib/next-auth/auth-helper";
import { ReactNode } from "react";

export const generateMetadata = () => {
  return {
    title: {
      template: "Dashboard | %s",
      default: "Dashboard",
    },
  } satisfies Metadata;
};

const DashboardLayout = async ({ children }: { children: ReactNode }) => {
  await requireAdmin("/dashboard");

  return (
    <SidebarProvider>
      <AppSidebar collapsible="icon" />
      <SidebarInset>
        <header className="rounded-t-2xl sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 flex justify-between h-14 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <DashboardBreadcrumb />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default DashboardLayout;
