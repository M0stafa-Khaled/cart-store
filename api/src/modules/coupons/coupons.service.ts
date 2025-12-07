import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateCouponDto } from "./dto/create-coupon.dto";
import { UpdateCouponDto } from "./dto/update-coupon.dto";
import { PrismaService } from "../../prisma/prisma.service";
import { APIRes } from "../../common/interfaces";
import { Coupon } from "@prisma/client";
import { CouponFilterDto } from "./dto/coupon-filter.dto";

@Injectable()
export class CouponsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Generate a random unique coupon code.
   * Example output: "SAVE-8F2K9Q"
   */
  async generateUniqueCouponCode(prefix = "SAVE", length = 6): Promise<string> {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    let code: string = "";
    let exists = true;

    while (exists) {
      const randomPart = Array.from({ length })
        .map(() => chars[Math.floor(Math.random() * chars.length)])
        .join("");
      code = `${prefix.toUpperCase()}-${randomPart}`;

      // Check for uniqueness in DB
      const found = await this.prisma.coupon.findUnique({ where: { code } });
      exists = !!found;
    }

    return code;
  }

  /**
   * @Docs     Admin create a new coupon
   * @Route    POST /api/v1/coupons
   * @Access   private [Admin]
   **/
  async create(createCouponDto: CreateCouponDto): Promise<APIRes<Coupon>> {
    const existsCoupon = await this.prisma.coupon.findUnique({
      where: { code: createCouponDto.code },
    });

    if (existsCoupon)
      throw new ConflictException("Coupon code is already exists.");

    if (createCouponDto.discountType && !createCouponDto.discountValue)
      throw new BadRequestException("Discount value is required.");
    if (createCouponDto.discountValue && !createCouponDto.discountType)
      throw new BadRequestException("Discount Type is required.");

    if (createCouponDto.discountType && createCouponDto.discountValue) {
      if (
        createCouponDto.discountType === "PERCENTAGE" &&
        (createCouponDto.discountValue > 100 ||
          createCouponDto.discountValue < 0)
      )
        throw new BadRequestException(
          "Discount value must be between 0 and 100.",
        );
      if (
        createCouponDto.discountType === "FIXED" &&
        createCouponDto.discountValue < 0
      )
        throw new BadRequestException(
          "Discount value must be greater than or equal to 0.",
        );
    }

    const coupon = await this.prisma.coupon.create({
      data: {
        ...createCouponDto,
        code: await this.generateUniqueCouponCode(createCouponDto.code),
      },
    });

    return {
      success: true,
      message: "Coupon created successfully.",
      data: coupon,
    };
  }

  /**
   * @Docs     Admin get all coupons
   * @Route    GET /api/v1/coupons
   * @Access   private [Admin]
   **/
  async findAll(
    page: number = 1,
    limit: number = 20,
    sort: "desc" | "asc" = "desc",
    filters?: CouponFilterDto,
  ): Promise<APIRes<Coupon[]>> {
    if (sort !== "asc" && sort !== "desc") sort = "desc";

    page = Number(page) || 1;
    limit = Number(limit) || 20;

    const where: any = {};

    if (filters?.code)
      where.code = { startsWith: filters.code, mode: "insensitive" };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.coupon.findMany({
        where,
        skip: (page - 1) * limit || 0,
        take: limit,
        orderBy: { createdAt: sort },
      }),
      this.prisma.coupon.count(),
    ]);
    const totalPages = Math.ceil(total / limit);

    return {
      success: true,
      message: null,
      data: {
        items: data,
        meta: {
          count: data.length,
          total,
          page,
          limit,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      },
    };
  }

  /**
   * @Docs     Admin get coupon by id
   * @Route    GET /api/v1/coupons/:id
   * @Access   private [Admin]
   **/
  async findOne(id: string): Promise<APIRes<Coupon>> {
    const coupon = await this.prisma.coupon.findUnique({ where: { id } });

    if (!coupon) throw new NotFoundException("Coupon not found.");

    return {
      success: true,
      message: null,
      data: coupon,
    };
  }

  /**
   * @Docs     Admin update coupon by id
   * @Route    PATCH /api/v1/coupons
   * @Access   private [Admin]
   **/
  async update(
    id: string,
    updateCouponDto: UpdateCouponDto,
  ): Promise<APIRes<Coupon>> {
    const coupon = await this.prisma.coupon.findUnique({ where: { id } });
    if (!coupon) throw new NotFoundException("Coupon not found.");

    if (updateCouponDto.discountType && !updateCouponDto.discountValue)
      throw new BadRequestException("Discount value is required.");
    if (updateCouponDto.discountValue && !updateCouponDto.discountType)
      throw new BadRequestException("Discount Type is required.");

    if (updateCouponDto.discountType && updateCouponDto.discountValue) {
      if (
        updateCouponDto.discountType === "PERCENTAGE" &&
        updateCouponDto.discountValue > 100
      )
        throw new BadRequestException(
          "Discount value must be less than or equal to 100.",
        );
      if (
        updateCouponDto.discountType === "FIXED" &&
        updateCouponDto.discountValue < 0
      )
        throw new BadRequestException(
          "Discount value must be greater than or equal to 0.",
        );
    }

    if (updateCouponDto.code) {
      const existsCoupon = await this.prisma.coupon.findUnique({
        where: { code: updateCouponDto.code },
      });
      if (existsCoupon && existsCoupon.id !== id)
        throw new ConflictException("Coupon code is already exists.");

      if (updateCouponDto.code && updateCouponDto.code !== coupon.code)
        updateCouponDto.code = await this.generateUniqueCouponCode(
          updateCouponDto.code,
        );
    }

    const updatedCoupon = await this.prisma.coupon.update({
      where: { id },
      data: updateCouponDto,
    });

    return {
      success: true,
      message: "Coupon updated successfully.",
      data: updatedCoupon,
    };
  }

  /**
   * @Docs     Admin delete coupon by id
   * @Route    DELETE /api/v1/coupons/:id
   * @Access   private [Admin]
   **/
  async remove(id: string): Promise<APIRes<void>> {
    const coupon = await this.prisma.coupon.findUnique({ where: { id } });

    if (!coupon) throw new NotFoundException("Coupon not found.");

    await this.prisma.coupon.delete({ where: { id } });
    return {
      success: true,
      message: "Coupon deleted successfully.",
      data: null,
    };
  }
}
