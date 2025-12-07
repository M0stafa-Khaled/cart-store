import { Card } from "@/components/ui/card";
import { MapPin, Plus, Trash2 } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { formatEGPPrice } from "@/utils/formatPrice";
import { Button } from "@/components/ui/button";
import { deleteShippingAddressAction } from "@/actions/shipping-addresses.actions";
import { toast } from "sonner";
import { handleActionError } from "@/lib/error-handlers";
import { IShippingAddress } from "@/interfaces";
import { ShippingAddressDialog } from "@/components/shared/shipping-address-dialog";

interface CheckoutShippingAddressProps {
  shippingAddresses: IShippingAddress[];
  selectedAddress: string;
  setSelectedAddress: (value: string) => void;
  loadShippingAddresses: () => void;
}

const CheckoutShippingAddress = ({
  shippingAddresses,
  selectedAddress,
  setSelectedAddress,
  loadShippingAddresses,
}: CheckoutShippingAddressProps) => {
  const handleDeleteAddress = async (id: string) => {
    try {
      const res = await deleteShippingAddressAction(id);
      if (res.success) {
        toast.success(res.message);
        loadShippingAddresses();
      } else {
        throw res;
      }
    } catch (error) {
      handleActionError(error);
    }
  };
  return (
    <Card className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <MapPin className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Shipping Address</h2>
            <p className="text-sm text-muted-foreground">
              Where should we deliver your order?
            </p>
          </div>
        </div>
        <ShippingAddressDialog onSuccess={loadShippingAddresses}>
          <Button className="gap-2 bg-purple-600 hover:bg-purple-600/90 text-white">
            <Plus className="w-4 h-4" />
            Add Address
          </Button>
        </ShippingAddressDialog>
      </div>

      {shippingAddresses.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">
            No shipping addresses found
          </p>
          <ShippingAddressDialog onSuccess={loadShippingAddresses} />
        </div>
      ) : (
        <RadioGroup
          value={selectedAddress}
          onValueChange={setSelectedAddress}
          className="space-y-3"
        >
          {shippingAddresses.map((address) => (
            <div
              key={address.id}
              className={`relative flex items-center space-x-3 rounded-lg border-2 p-4 transition-all ${
                selectedAddress === address.id
                  ? "border-purple-600 bg-purple-600/5"
                  : "border-border hover:border-purple-600/50"
              }`}
            >
              <RadioGroupItem
                value={address.id}
                id={address.id}
                className={`mt-1 ${selectedAddress === address.id ? "text-purple-600 border-purple-600" : "text-border border-border"}`}
              />
              <Label
                htmlFor={address.id}
                className="flex-1 cursor-pointer gap-4 md:gap-2 flex-col items-start md:flex-row md:items-center"
              >
                <div className="flex flex-col md:flex-row gap-1">
                  <div className="flex  items-center gap-2 text-wrap">
                    <div className="font-medium">{address.address}</div>
                    <div className="text-sm text-muted-foreground">
                      {address.city.name}, {address.city.country.name}
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {address.phone}
                  </div>
                </div>
                <div className="text-sm">
                  <Badge className="bg-purple-600 text-white">
                    Shipping: {formatEGPPrice(address.city.shippingPrice)}
                  </Badge>
                </div>
              </Label>
              <Button
                size="icon"
                className="text-destructive bg-transparent hover:text-destructive hover:bg-destructive/10"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteAddress(address.id);
                }}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </RadioGroup>
      )}
    </Card>
  );
};

export default CheckoutShippingAddress;
