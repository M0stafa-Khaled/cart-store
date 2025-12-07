import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { APIRes } from "src/common/interfaces";
import { Brand, Category, Product } from "@prisma/client";

@Injectable()
export class HomepageService {
  constructor(private prisma: PrismaService) {}

  async getHomepageData() {
    const [
      categories,
      featuredProducts,
      flashSaleProducts,
      newArrivals,
      brands,
    ] = await Promise.all([
      this.getCategories(),
      this.getFeaturedProducts(),
      this.getFlashSaleProducts(),
      this.getNewArrivals(),
      this.getBrands(),
    ]);

    return {
      success: true,
      message: null,
      data: {
        categories: categories.data,
        featuredProducts: featuredProducts.data,
        flashSale: flashSaleProducts.data,
        newArrivals: newArrivals.data,
        brands: brands.data,
      },
    };
  }

  async getCategories(): Promise<APIRes<Category[]>> {
    return {
      success: true,
      message: null,
      data: await this.prisma.category.findMany({
        take: 8,
        include: {
          _count: {
            select: { products: true },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
    };
  }

  async getFeaturedProducts(): Promise<APIRes<Product[]>> {
    return {
      success: true,
      message: null,
      data: await this.prisma.product.findMany({
        take: 8,
        where: {
          stock: { gt: 0 },
        },
        include: {
          category: true,
          subCategory: true,
          brand: true,
        },
        orderBy: [{ sold: "desc" }, { ratingAverage: "desc" }],
      }),
    };
  }

  async getFlashSaleProducts(): Promise<APIRes<Product[]>> {
    return {
      success: true,
      message: null,
      data: await this.prisma.product.findMany({
        take: 6,
        where: {
          stock: { gt: 0 },
          discountValue: { gt: 0 },
        },
        include: {
          category: true,
          subCategory: true,
          brand: true,
        },
        orderBy: { discountValue: "desc" },
      }),
    };
  }

  async getNewArrivals(): Promise<APIRes<Product[]>> {
    return {
      success: true,
      message: null,
      data: await this.prisma.product.findMany({
        take: 8,
        where: {
          stock: { gt: 0 },
        },
        include: {
          category: true,
          subCategory: true,
          brand: true,
        },

        orderBy: { createdAt: "desc" },
      }),
    };
  }

  async getBrands(): Promise<APIRes<Brand[]>> {
    return {
      success: true,
      message: null,
      data: await this.prisma.brand.findMany({
        take: 12,
        include: {
          _count: {
            select: { products: true },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
    };
  }
}
