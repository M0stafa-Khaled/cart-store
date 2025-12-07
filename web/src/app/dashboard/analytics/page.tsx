import { getDashboardStatsAction } from "@/actions/analytics.actions";
import { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  ArrowLeft,
  TrendingUp,
  ShoppingCart,
  Users,
  DollarSign,
} from "lucide-react";
import AnalyticsFilter from "./_components/analytics-filter";
import SalesChart from "./_components/sales-chart";
import StatCard from "../_components/stat-card";
import { formatEGPPrice } from "@/utils/formatPrice";
import Image from "next/image";
import ErrorRes from "@/components/shared/error";
import { APIRes } from "@/interfaces";

export const metadata: Metadata = {
  title: "Analytics",
};

const AnalyticsPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
  const params = await searchParams;
  const response = await getDashboardStatsAction({
    startDate: params.startDate,
    endDate: params.endDate,
  });

  if (!response.success || !response.data || response.error) {
    return <ErrorRes error={response as APIRes} />;
  }

  const { period, charts, topProducts } = response.data;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
            <p className="text-muted-foreground">
              Detailed performance metrics
            </p>
          </div>
        </div>
      </div>

      <AnalyticsFilter />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Revenue"
          value={formatEGPPrice(period.revenue)}
          icon={DollarSign}
          description="In selected period"
          trendIconClass="text-blue-500"
          iconBgClass="bg-linear-to-br from-blue-500 to-cyan-600"
          className="bg-linear-to-br from-blue-500/10 to-cyan-500/10 group-hover:from-blue-500/20 hover:to-cyan-500/20 border-blue-200"
        />
        <StatCard
          title="Orders"
          value={period.orders}
          icon={ShoppingCart}
          description={`${period.completedOrders} completed`}
          trendIconClass="text-orange-500"
          iconBgClass="bg-linear-to-br from-orange-500 to-amber-600"
          className="bg-linear-to-br from-orange-500/10 to-amber-500/10 group-hover:from-orange-500/20 hover:to-amber-500/20 border-orange-200"
        />
        <StatCard
          title="New Users"
          value={period.newUsers}
          icon={Users}
          description="Registered in period"
          trendIconClass="text-purple-500"
          iconBgClass="bg-linear-to-br from-purple-500 to-fuchsia-600"
          className="bg-linear-to-br from-purple-500/10 to-fuchsia-500/10 group-hover:from-purple-500/20 hover:to-fuchsia-500/20 border-purple-200"
        />
        <StatCard
          title="Avg. Order Value"
          value={formatEGPPrice(
            period.orders > 0 ? period.revenue / period.orders : 0
          )}
          icon={TrendingUp}
          description="Revenue / Orders"
          trendIconClass="text-rose-500"
          iconBgClass="bg-linear-to-br from-rose-500 to-main"
          className="bg-linear-to-br from-rose-500/10 to-main/10 group-hover:from-rose-500/20 hover:to-main/20 border-rose-200"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
          </CardHeader>
          <CardContent>
            {charts.sales.length > 0 ? (
              <SalesChart data={charts.sales} />
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                No data available for this period
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center gap-4 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="relative h-12 w-12 rounded-md overflow-hidden bg-muted">
                    <Image
                      src={product.imageCover}
                      alt={product.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {product.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {product.sold} sold
                    </p>
                  </div>
                  <div className="text-sm font-medium">
                    {formatEGPPrice(product.price)}
                  </div>
                </div>
              ))}
              {topProducts.length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                  No top products found
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsPage;
