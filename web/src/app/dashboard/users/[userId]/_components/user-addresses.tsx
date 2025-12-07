import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { IUser } from "@/interfaces";
import { Badge } from "@/components/ui/badge";

interface UserAddressesProps {
  user: IUser;
}

const UserAddresses = ({ user }: UserAddressesProps) => {
  const addresses = user.shippingAddresses || [];

  if (addresses.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Saved Addresses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
            <MapPin className="h-12 w-12 mb-4 opacity-50" />
            <p>No addresses saved.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Saved Addresses ({addresses.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {addresses.map((address) => (
            <div
              key={address.id}
              className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="p-2 bg-purple-600/10 rounded-full">
                  <MapPin className="h-5 w-5 text-purple-600" />
                </div>

                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">
                      {address.city.name}, {address.city.country.name}
                    </h4>
                  </div>

                  <p className="text-sm text-muted-foreground">
                    {address.address}
                  </p>

                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <span className="font-medium">Phone:</span>
                      <span>{address.phone}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Badge
                      variant="outline"
                      className="shadow-none bg-purple-600/10 text-purple-600"
                    >
                      {address.city.country.name}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="shadow-none bg-purple-600/10 text-purple-600"
                    >
                      {address.city.name}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default UserAddresses;
