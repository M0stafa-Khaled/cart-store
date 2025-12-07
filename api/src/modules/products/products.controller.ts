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
  UploadedFiles,
  BadRequestException,
  Query,
  UseInterceptors,
} from "@nestjs/common";
import { ProductsService } from "./products.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { AuthGuard } from "../auth/guards/auth.guard";

import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { UploadMultipleFields } from "../../common/upload/upload.decorator";
import { FilterProductDto } from "./dto/filter-product.dto";
import { DeleteFilesInterceptor } from "../../common/interceptors/delete-files.interceptor";
import { deleteFileIfExists } from "../../common/utils/file.helper";

@Controller("v1/products")
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  /**
   * @Docs     Admin create product
   * @Route    POST /api/v1/products
   * @Access   private [Admin]
   **/
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(["ADMIN"])
  @UploadMultipleFields([
    { name: "imageCover", folder: "products", maxCount: 1 },
    { name: "images", folder: "products", maxCount: 10 },
  ])
  @Post()
  async create(
    @UploadedFiles()
    files: {
      imageCover?: Express.Multer.File[];
      images?: Express.Multer.File[];
    },
    @Body() createProductDto: CreateProductDto,
  ) {
    if (!files?.imageCover?.length)
      throw new BadRequestException("Cover image is required");
    if (!files?.images?.length)
      throw new BadRequestException("At least one image is required");

    createProductDto.imageCover = files.imageCover[0].path;
    createProductDto.images = files.images.map((file) => file.path);

    try {
      return await this.productsService.create(createProductDto);
    } catch (error) {
      // Delete uploaded files from Cloudinary if creation fails
      await deleteFileIfExists(createProductDto.imageCover);
      for (const imagePath of createProductDto.images) {
        await deleteFileIfExists(imagePath);
      }
      throw error;
    }
  }

  /**
   * @Docs     Get all products
   * @Route    GET /api/v1/products
   * @Access   Public
   **/
  @Get()
  findAll(
    @Query("page") page?: string,
    @Query("limit") limit?: string,
    @Query("sort") sort?: "desc" | "asc",
    @Query("reviews") reviews?: "true" | "false",
    @Query() filters?: FilterProductDto,
  ) {
    return this.productsService.findAll(
      Number(page),
      Number(limit),
      sort,
      reviews,
      filters,
    );
  }

  /**
   * @Docs     Get product by id
   * @Route    GET /api/v1/products/:id
   * @Access   Public
   **/
  @Get(":id")
  findOne(
    @Param("id") id: string,
    @Query("reviews") reviews?: "true" | "false",
  ) {
    return this.productsService.findOne(id, reviews);
  }

  /**
   * @Docs     Admin update product
   * @Route    PATCH /api/v1/products/:id
   * @Access   private [Admin]
   **/
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(["ADMIN"])
  @Patch(":id")
  @UploadMultipleFields([
    { name: "imageCover", folder: "products", maxCount: 1 },
    { name: "images", folder: "products", maxCount: 10 },
  ])
  async update(
    @Param("id") id: string,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFiles()
    files: {
      imageCover?: Express.Multer.File[];
      images?: Express.Multer.File[];
    },
  ) {
    if (files?.imageCover?.length)
      updateProductDto.imageCover = files.imageCover[0].path;
    if (files?.images?.length)
      updateProductDto.images = files.images.map((file) => file.path);

    try {
      return await this.productsService.update(id, updateProductDto);
    } catch (error) {
      if (files?.imageCover) {
        await deleteFileIfExists(files.imageCover[0].path);
      }
      if (files?.images?.length) {
        for (const file of files.images) {
          await deleteFileIfExists(file.path);
        }
      }
      throw new BadRequestException(
        error.message || "Failed to update product",
      );
    }
  }

  /**
   * @Docs     Admin delete product
   * @Route    DELETE /api/v1/products/:id
   * @Access   private [Admin]
   **/
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(["ADMIN"])
  @UseInterceptors(new DeleteFilesInterceptor(["images"]))
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.productsService.remove(id);
  }
}
