import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
  Query,
  UploadedFile,
  BadRequestException,
  UseInterceptors,
} from "@nestjs/common";
import { BrandService } from "./brand.service";
import { CreateBrandDto } from "./dto/create-brand.dto";
import { UpdateBrandDto } from "./dto/update-brand.dto";
import { AuthGuard } from "../../modules/auth/guards/auth.guard";
import { RolesGuard } from "../../modules/auth/guards/roles.guard";
import { Roles } from "../../modules/auth/decorators/roles.decorator";
import { FilterBrandDto } from "./dto/filter-brand.dto";
import { UploadFile } from "../../common/upload/upload.decorator";
import { DeleteFilesInterceptor } from "../../common/interceptors/delete-files.interceptor";
import { deleteFileIfExists } from "../../common/utils/file.helper";

@Controller("v1/brands")
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  /**
   * @Docs     Admin create brand
   * @Route    POST /api/v1/brands
   * @Access   Private [admin]
   **/
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(["ADMIN"])
  @HttpCode(HttpStatus.CREATED)
  @UploadFile("image", "brands")
  @Post()
  async create(
    @Body() createBrandDto: CreateBrandDto,
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

    createBrandDto.image = file.path;
    try {
      return await this.brandService.create(createBrandDto);
    } catch (error) {
      await deleteFileIfExists(file.path);
      throw error;
    }
  }

  /**
   * @Docs     Admin get all brands
   * @Route    GET /api/v1/brands
   * @Access   public
   **/
  @Get()
  findAll(
    @Query("sort") sort: "desc" | "asc",
    @Query() filters?: FilterBrandDto,
  ) {
    return this.brandService.findAll(sort, filters);
  }

  /**
   * @Docs     Admin get brand by id
   * @Route    GET /api/v1/brands/:id
   * @Access   public
   **/
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.brandService.findOne(id);
  }

  /**
   * @Docs     Admin update brand by id
   * @Route    PATCH /api/v1/brands/:id
   * @Access   Private [admin]
   **/
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(["ADMIN"])
  @HttpCode(HttpStatus.OK)
  @Patch(":id")
  async update(
    @Param("id") id: string,
    @Body() updateBrandDto: UpdateBrandDto,
  ) {
    try {
      return await this.brandService.update(id, updateBrandDto);
    } catch (error) {
      if (updateBrandDto.image) {
        await deleteFileIfExists(updateBrandDto.image);
      }
      throw error;
    }
  }

  /**
   * @Docs     Admin delete brand by id
   * @Route    DELETE /api/v1/brands/:id
   * @Access   Private [admin]
   **/
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(["ADMIN"])
  @UseInterceptors(new DeleteFilesInterceptor(["image"]))
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.brandService.remove(id);
  }
}
