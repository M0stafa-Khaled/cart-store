import { Card, CardContent } from "@/components/ui/card";
import { IOrder } from "@/interfaces";
import { formatEGPPrice } from "@/utils/formatPrice";
import { DollarSign, Package, ShoppingCart, TrendingUp } from "lucide-react";
import React from "react";

export const MyOrdersWidgets = ({ orders }: { orders: IOrder[] }) => {
  const totalPrice = orders.reduce((acc, order) => acc + order.totalPrice, 0);
  const totalItems = orders.reduce(
    (acc, order) => acc + order.orderItems.length,
    0
  );
  const totalOrders = orders.length;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
        <div className="absolute inset-0 bg-linear-to-br from-blue-500/10 to-cyan-500/10 group-hover:from-blue-500/20 group-hover:to-cyan-500/20 transition-all duration-1000" />
        <CardContent className="relative">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-linear-to-br from-blue-500 to-cyan-600 rounded-xl shadow-lg group-hover:scale-110 transition-all duration-500">
              <Package className="h-6 w-6 text-white" />
            </div>
            <TrendingUp className="h-5 w-5 text-blue-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">
              Total Orders
            </p>
            <p className="text-3xl font-bold text-foreground">{totalOrders}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
        <div className="absolute inset-0 bg-linear-to-br from-green-500/10 to-emerald-500/10 group-hover:from-green-500/20 group-hover:to-emerald-500/20 transition-all" />
        <CardContent className="relative">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-linear-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg group-hover:scale-110 transition-all duration-500">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            <TrendingUp className="h-5 w-5 text-green-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">
              Total Spent
            </p>
            <p className="text-3xl font-bold text-foreground">
              {formatEGPPrice(totalPrice)}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
        <div className="absolute inset-0 bg-linear-to-br from-main/10 to-pink-500/10 group-hover:from-main/20 group-hover:to-pink-500/20 transition-all" />
        <CardContent className="relative">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-linear-to-br from-main to-pink-600 rounded-xl shadow-lg group-hover:scale-110 transition-all duration-500">
              <ShoppingCart className="h-6 w-6 text-white" />
            </div>
            <TrendingUp className="h-5 w-5 text-main" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">
              Total Items
            </p>
            <p className="text-3xl font-bold text-foreground">{totalItems}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
        <div className="absolute inset-0 bg-linear-to-br from-orange-500/10 to-red-500/10 group-hover:from-orange-500/20 group-hover:to-red-500/20 transition-all" />
        <CardContent className="relative">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-linear-to-br from-orange-500 to-red-600 rounded-xl shadow-lg group-hover:scale-110 transition-all duration-500">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <TrendingUp className="h-5 w-5 text-orange-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">
              Avg. Order Value
            </p>
            <p className="text-3xl font-bold text-foreground">
              {formatEGPPrice(totalPrice / totalOrders)}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
