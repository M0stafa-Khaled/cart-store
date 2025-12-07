import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { IUser } from "@/interfaces";
import { Calendar, Phone, User } from "lucide-react";
import Image from "next/image";

const UserCardProfile = ({ user }: { user: IUser }) => {
  return (
    <Card className="overflow-hidden pt-0">
      <div className="h-32 bg-linear-to-r from-blue-500 to-purple-600"></div>
      <CardContent className="relative pt-0">
        <div className="absolute -top-16 left-6 border-4 border-background rounded-full">
          {user.avatar ? (
            <Image
              src={user.avatar}
              alt={user.name}
              width={128}
              height={128}
              loading="eager"
              className="rounded-full object-cover h-32 w-32 bg-background"
            />
          ) : (
            <div className="h-32 w-32 rounded-full bg-muted flex items-center justify-center">
              <User className="h-16 w-16 text-muted-foreground" />
            </div>
          )}
        </div>
        <div className="mt-20 space-y-4">
          <div>
            <h2 className="text-2xl font-bold">{user.name}</h2>
            <p className="text-muted-foreground">{user.email}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge
              className={
                user.role === "ADMIN"
                  ? "bg-blue-600/20 hover:bg-blue-600/10 text-blue-600 border-blue-600/60"
                  : "bg-purple-600/20 hover:bg-purple-600/10 text-purple-600 border-purple-600/60"
              }
            >
              {user.role}
            </Badge>
            <Badge
              className={
                user.active
                  ? "bg-emerald-600/20 hover:bg-emerald-600/10 text-emerald-600 border-emerald-600/60"
                  : "bg-red-600/20 hover:bg-red-600/10 text-red-600 border-red-600/60"
              }
            >
              {user.active ? "Active" : "Inactive"}
            </Badge>
            {user.isVerified ? (
              <Badge className="bg-emerald-600/20 hover:bg-emerald-600/10 text-emerald-600 border-emerald-600/60">
                Verified
              </Badge>
            ) : (
              <Badge className="bg-red-600/20 hover:bg-red-600/10 text-red-600 border-red-600/60">
                Not Verified
              </Badge>
            )}
          </div>

          <Separator />

          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3 text-muted-foreground">
              <Phone className="h-4 w-4" />
              <span>{user.phone || "No phone number"}</span>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
              <User className="h-4 w-4" />
              <span className="capitalize">{user.gender.toLowerCase()}</span>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>
                Joined {new Date(user.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserCardProfile;
