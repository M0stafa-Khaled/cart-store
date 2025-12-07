import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { SubCategoriesService } from "./sub-categories.service";
import { CreateSubCategoryDto } from "./dto/create-sub-category.dto";
import { UpdateSubCategoryDto } from "./dto/update-sub-category.dto";
import { AuthGuard } from "../../modules/auth/guards/auth.guard";
import { RolesGuard } from "../../modules/auth/guards/roles.guard";
import { Roles } from "../../modules/auth/decorators/roles.decorator";
import { CustomValidationPipe } from "../../common/validation/validation.pipe";
import { FilterSubCategory } from "./dto/filter.sub-category.dto";

@Controller("v1/sub-categories")
export class SubCategoriesController {
  constructor(private readonly subCategoriesService: SubCategoriesService) {}

  /**
   * @Docs     Admin create sub category
   * @Route    POST /api/v1/sub-categories
   * @Access   Private [admin]
   **/
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(["ADMIN"])
  @Post()
  create(
    @Body(new CustomValidationPipe({ allowEmptyBody: false }))
    createSubCategoryDto: CreateSubCategoryDto,
  ) {
    return this.subCategoriesService.create(createSubCategoryDto);
  }

  /**
   * @Docs     Get all sub categories
   * @Route    GET /api/v1/sub-categories
   * @Access   public
   **/
  @Get()
  findAll(
    @Query("sort") sort: "desc" | "asc",
    @Query() filters?: FilterSubCategory,
  ) {
    return this.subCategoriesService.findAll(sort, filters);
  }

  /**
   * @Docs     Get one sub category by id
   * @Route    GET /api/v1/sub-categories/:id
   * @Access   public
   **/
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.subCategoriesService.findOne(id);
  }

  /**
   * @Docs     Admin update sub category
   * @Route    GET /api/v1/sub-categories/:id
   * @Access   private [admin]
   **/
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(["ADMIN"])
  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateSubCategoryDto: UpdateSubCategoryDto,
  ) {
    return this.subCategoriesService.update(id, updateSubCategoryDto);
  }

  /**
   * @Docs     Admin delete sub category by id
   * @Route    GET /api/v1/sub-categories/:id
   * @Access   private [admin]
   **/
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(["ADMIN"])
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.subCategoriesService.remove(id);
  }
}
