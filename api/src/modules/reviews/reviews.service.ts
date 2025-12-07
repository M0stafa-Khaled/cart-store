import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateReviewDto } from "./dto/create-review.dto";
import { UpdateReviewDto } from "./dto/update-review.dto";
import { PrismaService } from "../../prisma/prisma.service";
import type { Review, User } from "@prisma/client";
import type { APIRes } from "../../common/interfaces";
import { FilterReviewDto } from "./dto/filter-review.dto";

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  /**
   * @Docs     User create review
   * @Route    POST /api/v1/reviews
   * @Access   private [User]
   **/
  async create(
    createReviewDto: CreateReviewDto,
    userId: string,
  ): Promise<APIRes<Partial<Review>>> {
    const product = await this.prisma.product.findUnique({
      where: { id: createReviewDto.productId },
    });

    if (!product) throw new NotFoundException("Product not found");

    // Check if user has already reviewed the product
    const alreadyReview = await this.prisma.review.findFirst({
      where: {
        productId: createReviewDto.productId,
        userId,
      },
    });

    if (alreadyReview)
      throw new BadRequestException("You have already reviewed this product.");

    // Add review
    const review = await this.prisma.review.create({
      data: { ...createReviewDto, userId },
      include: {
        product: true,
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
      omit: { productId: true, userId: true },
    });

    // Update product rating
    await this.prisma.$transaction(async (tx) => {
      const product = await tx.product.findUnique({
        where: { id: createReviewDto.productId },
        select: { ratingAverage: true, ratingQuantity: true },
      });

      if (product) {
        const { ratingAverage, ratingQuantity } = product;

        const newQuantity = ratingQuantity + 1;

        const newAverage =
          ((ratingAverage || 0) * ratingQuantity + createReviewDto.rating) /
          newQuantity;

        const fixedAverage = Math.min(Number(newAverage.toFixed(1)), 5);

        await tx.product.update({
          where: { id: createReviewDto.productId },
          data: {
            ratingQuantity: newQuantity,
            ratingAverage: fixedAverage,
          },
        });
      }
    });

    return {
      success: true,
      message: "Review added successfully",
      data: review,
    };
  }

  /**
   * @Docs     Admin get all reviews
   * @Route    GET /api/v1/reviews
   * @Access   private [Admin]
   **/
  async findAll(
    page: number = 1,
    limit: number = 20,
    sort: "asc" | "desc" = "desc",
    filters?: FilterReviewDto,
  ): Promise<APIRes<Partial<Review>[]>> {
    if (sort !== "asc" && sort !== "desc") sort = "desc";

    page = Number(page) || 1;
    limit = Number(limit) || 20;

    const where: any = {};
    if (filters) {
      if (filters.user)
        where.user = { name: { contains: filters.user, mode: "insensitive" } };
      if (filters.product)
        where.product = {
          title: { contains: filters.product, mode: "insensitive" },
        };

      if (filters.minRating) where.rating = { gte: filters.minRating };
      if (filters.maxRating) where.rating = { lte: filters.maxRating };
    }

    const [data, total] = await this.prisma.$transaction([
      this.prisma.review.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: sort },
        include: {
          product: true,
          user: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
        },
        omit: { productId: true, userId: true },
      }),
      this.prisma.review.count(),
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
          limit,
          page,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      },
    };
  }

  /**
   * @Docs     Admin get review by id
   * @Route    GET /api/v1/reviews/:id
   * @Access   private [Admin]
   **/
  async findOne(id: string): Promise<APIRes<Partial<Review>>> {
    const review = await this.prisma.review.findUnique({
      where: { id },
      include: {
        product: true,
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
      omit: { productId: true, userId: true },
    });

    if (!review) throw new NotFoundException("Review not found.");

    return {
      success: true,
      message: null,
      data: review,
    };
  }
  /**
   * @Docs     User update review
   * @Route    PATCH /api/v1/reviews/:id
   * @Access   private [User]
   **/
  async update(
    id: string,
    updateReviewDto: UpdateReviewDto,
    userId: string,
  ): Promise<APIRes<Partial<Review>>> {
    const review = await this.prisma.review.findUnique({
      where: { id, userId },
    });

    if (!review) throw new NotFoundException("Review not found.");

    if (
      updateReviewDto.productId &&
      updateReviewDto.productId !== review.productId
    )
      throw new BadRequestException("Failed to update review.");

    const updatedReview = await this.prisma.review.update({
      where: { id },
      data: updateReviewDto,
      include: {
        product: true,
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
      omit: { productId: true, userId: true },
    });

    if (updateReviewDto.rating && updateReviewDto.rating !== review.rating) {
      await this.recalculateProductRating(review.productId);
    }

    return {
      success: true,
      message: "Review updated successfully.",
      data: updatedReview,
    };
  }

  /**
   * @Docs     Admin delete review
   * @Route    DELETE /api/v1/reviews/:id
   * @Access   private [Admin]
   **/
  async remove(id: string, user: User): Promise<APIRes<void>> {
    const review = await this.prisma.review.findUnique({
      where: { id },
    });

    if (!review) throw new NotFoundException("Review not found.");

    if (user.role === "USER" && review.userId !== user.id) {
      throw new ForbiddenException("You can only delete your own reviews");
    }

    await this.prisma.review.delete({ where: { id } });

    // Update product ratings
    await this.recalculateProductRating(review.productId);

    return {
      success: true,
      message: "Review deleted successfully.",
      data: null,
    };
  }

  /**
   * @Docs  Recalculate product rating
   **/
  private async recalculateProductRating(productId: string) {
    const aggregate = await this.prisma.review.aggregate({
      where: { productId },
      _avg: { rating: true },
      _count: { rating: true },
    });

    const avg = aggregate._avg.rating || 0;
    const count = aggregate._count.rating;

    await this.prisma.product.update({
      where: { id: productId },
      data: {
        ratingAverage: Math.min(Number(avg.toFixed(1)), 5),
        ratingQuantity: count,
      },
    });
  }
}
