import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, Truck, XCircle } from "lucide-react";

export const orderVariants = {
  PENDING:
    "bg-yellow-600/20 hover:bg-yellow-600/10 text-yellow-600 border-yellow-600/60",
  PAID: "bg-emerald-600/20 hover:bg-emerald-600/10 text-emerald-600 border-emerald-600/60",
  FAILED: "bg-red-600/20 hover:bg-red-600/10 text-red-600 border-red-600/60",
  COMPLETED:
    "bg-emerald-600/20 hover:bg-emerald-600/10 text-emerald-600 border-emerald-600/60",
  CANCELLED: "bg-red-600/20 hover:bg-red-600/10 text-red-600 border-red-600/60",
  DELIVERED:
    "bg-blue-600/20 hover:bg-blue-600/10 text-blue-600 border-blue-600/60",
};

export const orderIcons = {
  PENDING: Clock,
  COMPLETED: CheckCircle2,
  CANCELLED: XCircle,
  PAID: CheckCircle2,
  FAILED: XCircle,
  DELIVERED: Truck,
};

export const getOrderStatus = (status: keyof typeof orderVariants) => {
  const Icon = orderIcons[status];
  return (
    <Badge
      className={`${orderVariants[status]} shadow-none flex items-center gap-1 w-fit capitalize`}
    >
      <Icon className="h-3 w-3" />
      {status.toLowerCase()}
    </Badge>
  );
};
