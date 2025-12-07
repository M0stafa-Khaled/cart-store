import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateSubCategoryDto } from "./dto/create-sub-category.dto";
import { UpdateSubCategoryDto } from "./dto/update-sub-category.dto";
import { FilterSubCategory } from "./dto/filter.sub-category.dto";
import { PrismaService } from "../../prisma/prisma.service";
import { APIRes } from "../../common/interfaces";
import { SubCategory } from "@prisma/client";

@Injectable()
export class SubCategoriesService {
  constructor(private prisma: PrismaService) {}

  /**
   * @Docs     Admin create sub category
   * @Route    POST /api/v1/sub-categories
   * @Access   Private [admin]
   **/
  async create(
    createSubCategoryDto: CreateSubCategoryDto,
  ): Promise<APIRes<SubCategory>> {
    const existsSubCategory = await this.prisma.subCategory.findUnique({
      where: { name: createSubCategoryDto.name },
    });

    if (existsSubCategory)
      throw new ConflictException("Sub category name already exists.");

    const category = await this.prisma.category.findUnique({
      where: { id: createSubCategoryDto.categoryId },
    });

    if (!category) throw new NotFoundException("Category not found.");

    const subCategory = await this.prisma.subCategory.create({
      data: createSubCategoryDto,
      include: { category: true },
    });

    return {
      success: true,
      message: "Sub category created successfully",
      data: subCategory,
    };
  }

  /**
   * @Docs     Get all sub categories
   * @Route    GET /api/v1/sub-categories
   * @Access   public
   **/
  async findAll(
    sort: "desc" | "asc" = "desc",
    filters?: FilterSubCategory,
  ): Promise<APIRes<SubCategory[]>> {
    if (sort !== "asc" && sort !== "desc") sort = "desc";
    const where: any = {};
    if (filters?.name)
      where.name = { startsWith: filters.name, mode: "insensitive" };

    if (filters?.category)
      where.category = {
        name: { startsWith: filters.category, mode: "insensitive" },
      };

    const subCategories = await this.prisma.subCategory.findMany({
      where,
      orderBy: { createdAt: sort },
      include: {
        category: true,
        _count: {
          select: { products: true },
        },
      },
    });

    return {
      success: true,
      message: "Sub categories retrieved successfully",
      data: subCategories,
    };
  }

  /**
   * @Docs     Get one sub category by id
   * @Route    GET /api/v1/sub-categories/:id
   * @Access   public
   **/
  async findOne(id: string): Promise<APIRes<SubCategory>> {
    const subCategory = await this.prisma.subCategory.findUnique({
      where: { id },
      include: {
        category: true,
        _count: {
          select: { products: true },
        },
      },
    });

    if (!subCategory) throw new NotFoundException("Sub category not found.");

    return {
      success: true,
      message: "Sub category retrieved successfully",
      data: subCategory,
    };
  }

  /**
   * @Docs     Admin update sub category by id
   * @Route    PATCH /api/v1/sub-categories/:id
   * @Access   Private [admin]
   **/
  async update(
    id: string,
    updateSubCategoryDto: UpdateSubCategoryDto,
  ): Promise<APIRes<SubCategory>> {
    const subCategory = await this.prisma.subCategory.findUnique({
      where: { id },
    });

    if (!subCategory) throw new NotFoundException("Sub category not found.");

    if (
      updateSubCategoryDto.name &&
      updateSubCategoryDto.name !== subCategory.name
    ) {
      const existsName = await this.prisma.subCategory.findUnique({
        where: { name: updateSubCategoryDto.name },
      });

      if (updateSubCategoryDto.name && existsName && existsName.id !== id)
        throw new ConflictException("Sub category name already exists.");
    }

    if (updateSubCategoryDto.categoryId) {
      const category = await this.prisma.category.findUnique({
        where: { id: updateSubCategoryDto.categoryId },
      });

      if (!category) throw new NotFoundException("Category not found.");
    }

    const updatedSubCategory = await this.prisma.subCategory.update({
      where: { id },
      data: updateSubCategoryDto,
      include: { category: true },
    });

    return {
      success: true,
      message: "Sub category updated successfully",
      data: updatedSubCategory,
    };
  }

  /**
   * @Docs     Admin delete sub category by id
   * @Route    DELETE /api/v1/sub-categories/:id
   * @Access   Private [admin]
   **/
  async remove(id: string): Promise<APIRes<void>> {
    const subCategory = await this.prisma.subCategory.findUnique({
      where: { id },
    });

    if (!subCategory) throw new NotFoundException("Sub category not found.");

    await this.prisma.subCategory.delete({
      where: { id },
      include: { category: true },
    });

    return {
      success: true,
      message: "Sub category deleted successfully",
      data: null,
    };
  }
}
