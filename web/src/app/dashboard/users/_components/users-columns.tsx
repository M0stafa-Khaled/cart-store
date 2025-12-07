"use client";
import {
  MoreHorizontal,
  ShieldCheck,
  UserIcon,
  CheckCircle2,
  XCircle,
  Edit,
  Trash,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@/components/data-table";
import { IUser } from "@/interfaces";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Mars, Venus } from "lucide-react";
import { useRouter } from "next/navigation";
import DeleteDialog from "@/components/shared/delete-dialog";
import { deleteUserAction } from "@/actions/users.actions";
import Image from "next/image";

export const useUserColumns = (): ColumnDef<IUser>[] => {
  const router = useRouter();

  return [
    {
      key: "avatar",
      header: "Profile Image",
      cell: (row) => (
        <Avatar className="w-14 h-14 mx-auto">
          {row.avatar ? (
            <Image
              src={row.avatar}
              alt={row.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover object-top"
            />
          ) : (
            <AvatarFallback>
              {row.name
                .split(" ")
                .map((name) => name[0])
                .join("")}
            </AvatarFallback>
          )}
        </Avatar>
      ),
    },
    {
      key: "name",
      header: "Name",
    },
    { key: "phone", header: "Phone" },
    { key: "email", header: "Email" },
    {
      key: "role",
      header: "Role",
      cell: (row) =>
        row.role === "ADMIN" ? (
          <Badge
            className={
              "mx-auto flex items-center gap-1 bg-purple-600/20 hover:bg-purple-600/10 text-purple-500 border-purple-600/60 shadow-none"
            }
          >
            <ShieldCheck className="h-3 w-3" />
            Admin
          </Badge>
        ) : (
          <Badge className="mx-auto flex items-center gap-1 bg-gray-600/20 hover:bg-gray-600/10 text-gray-500 border-gray-600/60 shadow-none">
            <UserIcon className="h-3 w-3" />
            User
          </Badge>
        ),
    },
    {
      key: "gender",
      header: "Gender",
      cell: (row) =>
        row.gender === "MALE" ? (
          <Badge className="mx-auto rounded-full bg-blue-600/20 hover:bg-blue-600/10 text-blue-500 border-blue-600/60 shadow-none flex items-center gap-1">
            <Mars className="h-3 w-3" />
            Male
          </Badge>
        ) : (
          <Badge className="mx-auto rounded-full bg-pink-600/20 hover:bg-pink-600/10 text-pink-500 border-pink-600/60 shadow-none flex items-center gap-1">
            <Venus className="h-3 w-3" />
            Female
          </Badge>
        ),
    },
    {
      key: "active",
      header: "Active",
      cell: (row) =>
        row.active ? (
          <Badge className="mx-auto bg-emerald-600/20 hover:bg-emerald-600/10 text-emerald-500 border-emerald-600/60 shadow-none rounded-full flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" />
            Active
          </Badge>
        ) : (
          <Badge className="mx-auto bg-red-600/20 hover:bg-red-600/10 text-red-500 border-red-600/60 shadow-none rounded-full flex items-center gap-1">
            <XCircle className="h-3 w-3" />
            Inactive
          </Badge>
        ),
    },
    {
      key: "isVerified",
      header: "Verified",
      cell: (row) =>
        row.isVerified ? (
          <Badge className="mx-auto bg-emerald-600/20 hover:bg-emerald-600/10 text-emerald-500 border-emerald-600/60 shadow-none rounded-full flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" />
            Verified
          </Badge>
        ) : (
          <Badge className="mx-auto bg-red-600/20 hover:bg-red-600/10 text-red-500 border-red-600/60 shadow-none rounded-full flex items-center gap-1">
            <XCircle className="h-3 w-3" />
            Not Verified
          </Badge>
        ),
    },
    {
      key: "actions",
      header: "Actions",
      cell: (row) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() => router.push(`/dashboard/users/${row.id}`)}
              className="cursor-pointer"
            >
              <Eye className="mr-2 h-4 w-4" />
              <span>View</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => router.push(`/dashboard/users/${row.id}/update`)}
              className="cursor-pointer"
              variant="editable"
            >
              <Edit className="mr-2 h-4 w-4" />
              <span>Edit</span>
            </DropdownMenuItem>

            <DeleteDialog
              id={row.id}
              name={row.name}
              deleteHandler={deleteUserAction}
            >
              <DropdownMenuItem
                onSelect={(e) => e.preventDefault()}
                className="cursor-pointer"
                variant="destructive"
              >
                <Trash className="mr-2 h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DeleteDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];
};
