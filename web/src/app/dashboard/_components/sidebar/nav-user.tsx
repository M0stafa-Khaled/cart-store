"use client";

import { BadgeCheck, ChevronsUpDown, Home, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Skeleton } from "@/components/ui/skeleton";
import { useSignOut } from "@/hooks/use-signout";
import Image from "next/image";

export const NavUser = () => {
  const { isMobile } = useSidebar();
  const { data: session, status } = useSession();

  const router = useRouter();

  const { handleSignOut } = useSignOut();

  if (status === "loading")
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <div className="w-full">
            <div className="flex items-center gap-3 rounded-lg px-2 py-2">
              <Skeleton className="h-10 w-10 rounded-full bg-accent-foreground/20" />
              <div className="grid flex-1 text-left text-sm leading-tight">
                <Skeleton className="mb-1 h-4 w-24 bg-accent-foreground/20" />
                <Skeleton className="h-3 w-32 bg-accent-foreground/20" />
              </div>
              <Skeleton className="ml-auto h-4 w-4 bg-accent-foreground/20" />
            </div>
          </div>
        </SidebarMenuItem>
      </SidebarMenu>
    );

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                {session?.user?.avatar ? (
                  <Image
                    src={session?.user.avatar}
                    alt={session?.user.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover object-top"
                  />
                ) : (
                  <AvatarFallback>
                    {session?.user?.name
                      .split(" ")
                      .map((name) => name[0])
                      .join("")}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {session?.user?.name}
                </span>
                <span className="truncate text-xs">{session?.user?.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  {session?.user?.avatar ? (
                    <Image
                      src={session?.user.avatar}
                      alt={session?.user.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover object-top"
                    />
                  ) : (
                    <AvatarFallback className="rounded-lg">
                      {session?.user?.name
                        ?.split(" ")
                        .map((name) => name[0])
                        .join("")}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    {session?.user?.name}
                  </span>
                  <span className="truncate text-xs">
                    {session?.user?.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => router.push("/")}>
                <Home />
                Home
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/profile")}>
                <BadgeCheck />
                Account
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};
