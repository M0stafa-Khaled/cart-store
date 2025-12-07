import { buttonVariants } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

const UsersHeader = () => {
  return (
    <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Users</h2>
        <p className="text-muted-foreground">
          Manage your users here. You can add, edit, or delete users.
        </p>
      </div>
      <Link
        href="/dashboard/users/create"
        className={buttonVariants({
          className: "bg-main! hover:bg-main/90!",
        })}
      >
        <Plus className="mr-2 h-4 w-4" /> Create User
      </Link>
    </div>
  );
};

export default UsersHeader;
