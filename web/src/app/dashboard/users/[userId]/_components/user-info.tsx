import { IUser } from "@/interfaces";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const UserInfo = ({ user }: { user: IUser }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">
              Full Name
            </p>
            <p>{user.name}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">
              Email Address
            </p>
            <p>{user.email}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">
              Phone Number
            </p>
            <p>{user.phone || "N/A"}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Gender</p>
            <p className="capitalize">{user.gender.toLowerCase()}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Role</p>
            <p>{user.role}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">
              Account Status
            </p>
            <p>{user.active ? "Active" : "Inactive"}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserInfo;
