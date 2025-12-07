import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CreditCard, Wallet } from "lucide-react";

interface CheckoutPaymentMethodProps {
  paymentMethod: string;
  setPaymentMethod: (value: "CASH" | "CREDIT_CARD") => void;
}
const CheckoutPaymentMethod = ({
  paymentMethod,
  setPaymentMethod,
}: CheckoutPaymentMethodProps) => {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary/10 rounded-lg">
          <CreditCard className="w-5 h-5 text-green-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold">Payment Method</h2>
          <p className="text-sm text-muted-foreground">
            How would you like to pay?
          </p>
        </div>
      </div>

      <RadioGroup
        value={paymentMethod}
        onValueChange={(value: any) => setPaymentMethod(value)}
        className="space-y-3"
      >
        <div
          className={`relative flex items-start space-x-3 rounded-lg border-2 p-4 transition-all ${
            paymentMethod === "CASH"
              ? "border-green-600 bg-green-600/5"
              : "border-border hover:border-green-600/50"
          }`}
        >
          <RadioGroupItem
            value="CASH"
            id="cash"
            className={`mt-1 ${paymentMethod === "CASH" ? "text-green-600 border-green-600" : "text-border"}`}
          />
          <Label
            htmlFor="cash"
            className="flex-1 cursor-pointer flex-col items-start sm:flex-row sm:items-center"
          >
            <div className="flex items-center gap-2 mb-1">
              <Wallet className="w-5 h-5 text-green-600" />
              <span className="font-medium">Cash on Delivery</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Pay when you receive your order
            </p>
          </Label>
        </div>

        <div
          className={`relative flex items-start space-x-3 rounded-lg border-2 p-4 transition-all ${
            paymentMethod === "CREDIT_CARD"
              ? "border-green-600 bg-green-600/5"
              : "border-border hover:border-green-600/50"
          }`}
        >
          <RadioGroupItem
            value="CREDIT_CARD"
            id="card"
            className={`mt-1 ${paymentMethod === "CREDIT_CARD" ? "text-green-600 border-green-600" : "text-border"}`}
          />
          <Label
            htmlFor="card"
            className="flex-1 cursor-pointer flex-col items-start sm:flex-row sm:items-center"
          >
            <div className="flex items-center gap-2 mb-1">
              <CreditCard className="w-5 h-5 text-green-600" />
              <span className="font-medium">Credit Card</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Pay securely with your credit card
            </p>
          </Label>
        </div>
      </RadioGroup>
    </Card>
  );
};

export default CheckoutPaymentMethod;
