import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MapPin, Pencil, Plus, Trash2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  deleteShippingAddressAction,
  getShippingAddressesAction,
} from "@/actions/shipping-addresses.actions";
import DeleteDialog from "@/components/shared/delete-dialog";
import { ShippingAddressDialog } from "../../../components/shared/shipping-address-dialog";

const CheckoutShippingAddress = async () => {
  const { data: shippingAddresses } = await getShippingAddressesAction();

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <MapPin className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <CardTitle className="text-xl font-semibold">
              Shipping Address
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              Where should we deliver your order?
            </CardDescription>
          </div>
        </div>
        <ShippingAddressDialog>
          <Button className="gap-2 bg-purple-600 hover:bg-purple-600/90 text-white">
            <Plus className="w-4 h-4" />
            Add Address
          </Button>
        </ShippingAddressDialog>
      </CardHeader>

      {shippingAddresses?.length === 0 ? (
        <CardContent className="text-center py-8">
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <MapPin className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No addresses saved</h3>
            <p className="text-muted-foreground max-w-md">
              Add shipping addresses to make checkout faster and easier.
            </p>
          </div>
          <ShippingAddressDialog />
        </CardContent>
      ) : (
        <CardContent className="space-y-4">
          {shippingAddresses?.map((address) => (
            <div
              key={address.id}
              className={`relative flex items-center space-x-3 rounded-lg border-2 p-4 transition-all ${"border-border hover:border-purple-600/50"}`}
            >
              <Label
                htmlFor={address.id}
                className="flex-1 cursor-pointer flex-col items-start md:flex-row md:items-center gap-2"
              >
                <div className="flex items-center gap-2 text-wrap">
                  <div className="font-medium">{address.address}</div>
                  <div className="text-sm text-muted-foreground">
                    {address.city.name}, {address.city.country.name}
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  {address.phone}
                </div>
              </Label>
              <div className="flex items-center gap-2">
                <ShippingAddressDialog address={address}>
                  <Button
                    size="icon"
                    className="text-blue-600 bg-transparent hover:text-blue-600 hover:bg-blue-600/10"
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                </ShippingAddressDialog>
                <DeleteDialog
                  deleteHandler={deleteShippingAddressAction}
                  id={address.id}
                  name={address.address}
                >
                  <Button
                    size="icon"
                    className="text-destructive bg-transparent hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </DeleteDialog>
              </div>
            </div>
          ))}
        </CardContent>
      )}
    </Card>
  );
};

export default CheckoutShippingAddress;
