import { getDashboardStatsAction } from "@/actions/analytics.actions";
import StatCard from "./_components/stat-card";
import {
  Users,
  Package,
  ShoppingCart,
  DollarSign,
  Star,
  FolderTree,
  Grid3x3,
  Tag,
  Ticket,
  UserCheck,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import { formatEGPPrice } from "@/utils/formatPrice";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import SummaryCard from "./_components/summary-card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";

const DashboardPage = async () => {
  const response = await getDashboardStatsAction();

  if (!response.success || !response.data) {
    return (
      <div className="space-y-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Welcome to your store dashboard
          </p>
        </div>
        <Card className="p-8">
          <div className="text-center text-muted-foreground">
            <p className="text-lg font-semibold mb-2">
              Failed to load dashboard stats
            </p>
            <p className="text-sm">
              {response.message || "Please try again later"}
            </p>
          </div>
        </Card>
      </div>
    );
  }

  const { summary, period } = response.data;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">Store Overview & Summary</p>
        </div>
        <Button asChild className="bg-main hover:bg-main/90">
          <Link href="/dashboard/analytics">
            <TrendingUp className="mr-2 h-4 w-4" />
            View Detailed Analytics
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value={formatEGPPrice(summary?.totalRevenue)}
          icon={DollarSign}
          description="Lifetime Revenue"
          trendIconClass="text-green-500"
          iconBgClass="bg-linear-to-br from-green-500 to-emerald-600"
          className="bg-linear-to-br from-green-500/10 to-emerald-500/10 group-hover:from-green-500/20 hover:to-emerald-500/20 border-green-200"
        />
        <StatCard
          title="Total Orders"
          value={summary.totalOrders}
          icon={ShoppingCart}
          description="Lifetime Orders"
          trendIconClass="text-orange-500"
          iconBgClass="bg-linear-to-br from-orange-500 to-amber-600"
          className="bg-linear-to-br from-orange-500/10 to-amber-500/10 group-hover:from-orange-500/20 hover:to-amber-500/20 border-orange-200"
        />
        <StatCard
          title="Total Users"
          value={summary.totalUsers}
          icon={Users}
          description={`${summary.activeUsers} active users`}
          trendIconClass="text-rose-500"
          iconBgClass="bg-linear-to-br from-main to-rose-600"
          className="bg-linear-to-br from-main/10 to-rose-500/10 group-hover:from-main/20 hover:to-rose-500/20 border-rose-200"
        />
        <StatCard
          title="Total Products"
          value={summary.totalProducts}
          icon={Package}
          description="Products in store"
          trendIconClass="text-blue-500"
          iconBgClass="bg-linear-to-br from-blue-500 to-cyan-600"
          className="bg-linear-to-br from-blue-500/10 to-cyan-500/10 group-hover:from-blue-500/20 hover:to-cyan-500/20 border-blue-200"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <SummaryCard
          value={summary.totalReviews}
          title="Reviews"
          description="Total customer reviews"
          icon={<Star className="h-4 w-4 text-yellow-500" />}
        />

        <SummaryCard
          value={summary.totalCategories}
          title="Categories"
          description="Active categories"
          icon={<FolderTree className="h-4 w-4 text-blue-500" />}
        />

        <SummaryCard
          value={summary.totalSubCategories}
          title="Sub-Categories"
          description="Active sub-categories"
          icon={<Grid3x3 className="h-4 w-4 text-indigo-500" />}
        />

        <SummaryCard
          value={summary.totalBrands}
          title="Brands"
          description="Partner brands"
          icon={<Tag className="h-4 w-4 text-pink-500" />}
        />

        <SummaryCard
          value={summary.totalCoupons}
          title="Coupons"
          description="Created coupons"
          icon={<Ticket className="h-4 w-4 text-red-500" />}
        />

        <SummaryCard
          value={summary.activeUsers}
          title="Active Users"
          description="Users with active status"
          icon={<UserCheck className="h-4 w-4 text-green-500" />}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-4 w-4 text-blue-500" />
            Recent Users
          </CardTitle>
          <CardDescription>
            List 5 recent users registered in the store
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {summary.recentUsers.map((user) => (
            <div key={user.id} className="flex items-center gap-2">
              <Avatar className="w-14 h-14">
                {user.avatar ? (
                  <Image
                    src={user.avatar}
                    alt={user.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover object-top"
                  />
                ) : (
                  <AvatarFallback>
                    {user.name
                      .split(" ")
                      .map((name) => name[0])
                      .join("")}
                  </AvatarFallback>
                )}
              </Avatar>
              <div>
                <p className="font-semibold">{user.name}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Monthly Performance</h3>
            <p className="text-sm text-muted-foreground">
              Quick look at this month&apos;s performance
            </p>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/analytics">
              View Details <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-3 mt-4">
          <div className="flex flex-col gap-1">
            <span className="text-sm text-muted-foreground">
              Revenue (This Month)
            </span>
            <span className="text-2xl font-bold">
              {formatEGPPrice(period.revenue)}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-sm text-muted-foreground">New Orders</span>
            <span className="text-2xl font-bold">{period.orders}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-sm text-muted-foreground">New Users</span>
            <span className="text-2xl font-bold">{period.newUsers}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
