import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
  Query,
} from "@nestjs/common";
import { ReviewsService } from "./reviews.service";
import { CreateReviewDto } from "./dto/create-review.dto";
import { UpdateReviewDto } from "./dto/update-review.dto";
import { AuthGuard } from "../auth/guards/auth.guard";

import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { CurrentUser } from "../../common/decorators/current-user/current-user.decorator";
import type { User } from "@prisma/client";
import { FilterReviewDto } from "./dto/filter-review.dto";

@UseGuards(AuthGuard, RolesGuard)
@Controller("v1/reviews")
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  /**
   * @Docs     User create review
   * @Route    POST /api/v1/reviews
   * @Access   private [User]
   **/
  @HttpCode(HttpStatus.CREATED)
  @Post()
  create(
    @Body() createReviewDto: CreateReviewDto,
    @CurrentUser() { id: userId }: User,
  ) {
    return this.reviewsService.create(createReviewDto, userId);
  }

  /**
   * @Docs     Admin get all reviews
   * @Route    GET /api/v1/reviews
   * @Access   private [Admin]
   **/
  @Roles(["ADMIN"])
  @Get()
  findAll(
    @Query("page") page?: string,
    @Query("limit") limit?: string,
    @Query("sort") sort?: "asc" | "desc",
    @Query() filters?: FilterReviewDto,
  ) {
    return this.reviewsService.findAll(
      Number(page),
      Number(limit),
      sort,
      filters,
    );
  }

  /**
   * @Docs     Admin get review by id
   * @Route    GET /api/v1/reviews/:id
   * @Access   private [Admin]
   **/
  @Roles(["ADMIN"])
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.reviewsService.findOne(id);
  }

  /**
   * @Docs     User update review
   * @Route    PATCH /api/v1/reviews/:id
   * @Access   private [User]
   **/
  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateReviewDto: UpdateReviewDto,
    @CurrentUser() { id: userId }: User,
  ) {
    return this.reviewsService.update(id, updateReviewDto, userId);
  }

  /**
   * @Docs     User delete review
   * @Route    DELETE /api/v1/reviews/:id
   * @Access   private [User]
   **/
  @Roles(["USER", "ADMIN"])
  @Delete(":id")
  remove(@Param("id") id: string, @CurrentUser() user: User) {
    return this.reviewsService.remove(id, user);
  }
}
