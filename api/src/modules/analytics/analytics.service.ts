import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { APIRes } from "../../common/interfaces";
import { AnalyticsQueryDto } from "./dto/analytics-query.dto";

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats(query: AnalyticsQueryDto): Promise<APIRes<any>> {
    try {
      const now = new Date();
      // Default to current month if no dates provided
      const startDate = query.startDate
        ? new Date(query.startDate)
        : new Date(now.getFullYear(), now.getMonth(), 1);
      const endDate = query.endDate ? new Date(query.endDate) : now;

      // Ensure endDate includes the full day if it's just a date string
      if (query.endDate && !query.endDate.includes("T")) {
        endDate.setHours(23, 59, 59, 999);
      }

      const dateFilter = {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      };

      // 1. Fetch Overall Totals (Snapshot of the store)
      const [
        totalUsers,
        totalProducts,
        totalOrders,
        totalReviews,
        totalCategories,
        totalSubCategories,
        totalBrands,
        totalCoupons,
        activeUsers,
        recentUsers,
        lifetimeRevenue,
      ] = await Promise.all([
        this.prisma.user.count(),
        this.prisma.product.count(),
        this.prisma.order.count(),
        this.prisma.review.count(),
        this.prisma.category.count(),
        this.prisma.subCategory.count(),
        this.prisma.brand.count(),
        this.prisma.coupon.count(),
        this.prisma.user.count({ where: { active: true } }),
        this.prisma.user.findMany({
          orderBy: {
            createdAt: "desc",
          },
          take: 5,
        }),
        // Total lifetime revenue
        this.prisma.order.aggregate({
          where: {
            status: "COMPLETED",
            isPaid: true,
          },
          _sum: { totalPrice: true },
        }),
      ]);

      const [
        periodRevenue,
        periodOrders,
        periodNewUsers,
        periodReviews,
        periodPendingOrders,
        periodCompletedOrders,
      ] = await Promise.all([
        // Revenue in period
        this.prisma.order.aggregate({
          where: {
            ...dateFilter,
            status: "COMPLETED",
            isPaid: true,
          },
          _sum: { totalPrice: true },
        }),
        this.prisma.order.count({ where: dateFilter }),
        this.prisma.user.count({ where: dateFilter }),
        this.prisma.review.count({ where: dateFilter }),
        this.prisma.order.count({
          where: { ...dateFilter, status: "PENDING" },
        }),
        this.prisma.order.count({
          where: { ...dateFilter, status: "COMPLETED" },
        }),
      ]);

      const ordersInPeriod = await this.prisma.order.findMany({
        where: { ...dateFilter },
        select: { createdAt: true, totalPrice: true, status: true },
        orderBy: { createdAt: "asc" },
      });

      const salesChartData = this.groupOrdersByDay(
        ordersInPeriod,
        startDate,
        endDate,
      );

      const topProducts = await this.prisma.product.findMany({
        take: 5,
        orderBy: { sold: "desc" },
        select: {
          id: true,
          title: true,
          sold: true,
          price: true,
          imageCover: true,
        },
      });

      return {
        success: true,
        message: "Analytics retrieved successfully",
        data: {
          summary: {
            totalUsers,
            totalProducts,
            totalOrders,
            totalReviews,
            totalCategories,
            totalSubCategories,
            totalBrands,
            totalCoupons,
            activeUsers,
            recentUsers,
            totalRevenue: lifetimeRevenue._sum.totalPrice || 0,
          },
          period: {
            startDate,
            endDate,
            revenue: periodRevenue._sum.totalPrice || 0,
            orders: periodOrders,
            newUsers: periodNewUsers,
            reviews: periodReviews,
            pendingOrders: periodPendingOrders,
            completedOrders: periodCompletedOrders,
          },
          charts: {
            sales: salesChartData,
          },
          topProducts,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  private groupOrdersByDay(orders: any[], startDate: Date, endDate: Date) {
    const map = new Map<
      string,
      { date: string; revenue: number; orders: number }
    >();

    // Initialize map with all days in range (to avoid gaps in chart)
    for (
      let d = new Date(startDate);
      d <= endDate;
      d.setDate(d.getDate() + 1)
    ) {
      const dateStr = d.toISOString().split("T")[0];
      map.set(dateStr, { date: dateStr, revenue: 0, orders: 0 });
    }

    orders.forEach((order) => {
      const dateStr = new Date(order.createdAt).toISOString().split("T")[0];
      if (map.has(dateStr)) {
        const entry = map.get(dateStr)!;
        entry.orders += 1;
        if (order.status === "COMPLETED") {
          entry.revenue += order.totalPrice;
        }
      }
    });

    return Array.from(map.values());
  }
}
