import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Query,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { CategoriesService } from "./categories.service";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { FilterCategoryDto } from "./dto/filter-category.dto";
import { AuthGuard } from "../auth/guards/auth.guard";

import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { UploadFile } from "../../common/upload/upload.decorator";
import { DeleteFilesInterceptor } from "../../common/interceptors/delete-files.interceptor";
import { deleteFileIfExists } from "../../common/utils/file.helper";
import { CustomValidationPipe } from "../../common/validation/validation.pipe";

@Controller("v1/categories")
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  /**
   * @Docs     Admin create category
   * @Route    POST /api/v1/categories
   * @Access   Private [admin]
   **/
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(["ADMIN"])
  @Post()
  @UploadFile("image", "categories")
  async create(
    @Body(new CustomValidationPipe({ allowEmptyBody: false }))
    createCategoryDto: CreateCategoryDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file)
      throw new BadRequestException({
        success: false,
        message: "Validation failed",
        error: [
          {
            field: "image",
            errors: ["Image is required."],
          },
        ],
      });

    createCategoryDto.image = file.path;
    try {
      return await this.categoriesService.create(createCategoryDto);
    } catch (error) {
      await deleteFileIfExists(file.path);
      throw error;
    }
  }

  /**
   * @Docs     Get all categories
   * @Route    GET /api/v1/categories
   * @Access   public
   **/
  @Get()
  findAll(
    @Query("sort") sort: "desc" | "asc",
    @Query() filters?: FilterCategoryDto,
  ) {
    return this.categoriesService.findAll(sort, filters);
  }

  /**
   * @Docs     Get one category by id
   * @Route    GET /api/v1/categories/:id
   * @Access  public
   **/
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.categoriesService.findOne(id);
  }

  /**
   * @Docs     Admin update category by id
   * @Route    PATCH /api/v1/categories/:id
   * @Access   Private [admin]
   **/
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(["ADMIN"])
  @Patch(":id")
  @UploadFile("image", "categories")
  async update(
    @Param("id") id: string,
    @Body(new CustomValidationPipe({ allowEmptyBody: false }))
    updateCategoryDto: UpdateCategoryDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    try {
      if (file) updateCategoryDto.image = file.path;

      return await this.categoriesService.update(id, updateCategoryDto);
    } catch (error) {
      if (file) await deleteFileIfExists(file.path);

      throw error;
    }
  }

  /**
   * @Docs     Admin delete category by id
   * @Route    DELETE /api/v1/categories/:id
   * @Access   Private [admin]
   **/
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(["ADMIN"])
  @Delete(":id")
  @UseInterceptors(new DeleteFilesInterceptor(["image"]))
  remove(@Param("id") id: string) {
    return this.categoriesService.remove(id);
  }
}
