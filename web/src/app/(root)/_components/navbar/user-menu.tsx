import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  LogIn,
  LogOut,
  Package,
  Settings,
  User as UserIcon,
  UserPlus,
} from "lucide-react";
import Link from "next/link";
import { IUser } from "@/interfaces";
import { useSignOut } from "@/hooks/use-signout";
import { User } from "next-auth";

const UserMenu = ({
  isAuthenticated,
  user,
}: {
  isAuthenticated: boolean;
  user: (IUser & User) | undefined;
}) => {
  const { handleSignOut } = useSignOut();

  if (isAuthenticated)
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={user?.avatar || undefined}
                className="object-cover"
              />
              <AvatarFallback>
                {user?.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium capitalize">{user?.name}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/profile" className="cursor-pointer">
              <UserIcon className="mr-2 h-4 w-4" />
              Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/profile/my-orders" className="cursor-pointer">
              <Package className="mr-2 h-4 w-4" />
              My Orders
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/settings" className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Link>
          </DropdownMenuItem>
          {user?.role === "ADMIN" && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard" className="cursor-pointer">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Dashbard
                </Link>
              </DropdownMenuItem>
            </>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer text-red-600 hover:text-red-500!"
            onClick={handleSignOut}
          >
            <LogOut className="mr-2 h-4 w-4 text-red-500" />
            <span>Logout</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  return (
    <div className="hidden md:flex items-center gap-2">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/auth/sign-in">
          <LogIn className="mr-2 h-4 w-4" />
          Sign In
        </Link>
      </Button>
      <Button size="sm" asChild className="bg-main hover:bg-main/90 rounded-md">
        <Link href="/auth/sign-up">
          <UserPlus className="mr-2 h-4 w-4" />
          Sign Up
        </Link>
      </Button>
    </div>
  );
};

export default UserMenu;
