import {
  ConflictException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { PrismaService } from "../../prisma/prisma.service";
import { APIRes } from "../../common/interfaces";
import { Category } from "@prisma/client";
import { FilterCategoryDto } from "./dto/filter-category.dto";
import { deleteFileIfExists } from "../../common/utils/file.helper";

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}
  /**
   * @Docs     Admin create category
   * @Route    POST /api/v1/categories
   * @Access   Private [admin]
   **/
  async create(
    createCategoryDto: CreateCategoryDto,
  ): Promise<APIRes<Category>> {
    const existsCategory = await this.prisma.category.findUnique({
      where: { name: createCategoryDto.name },
    });

    if (existsCategory) {
      throw new ConflictException("Category name already exists.");
    }

    const category = await this.prisma.category.create({
      data: createCategoryDto,
    });

    return {
      success: true,
      message: "Category created successfully",
      data: category,
    };
  }

  /**
   * @Docs     Get all categories
   * @Route    GET /api/v1/categories
   * @Access   public
   **/
  async findAll(
    sort: "desc" | "asc" = "desc",
    filters?: FilterCategoryDto,
  ): Promise<APIRes<Category[]>> {
    if (sort !== "asc" && sort !== "desc") sort = "desc";
    const where: any = {};
    if (filters?.name)
      where.name = { startsWith: filters.name, mode: "insensitive" };

    const categories = await this.prisma.category.findMany({
      where,
      orderBy: { createdAt: sort },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });
    return {
      success: true,
      message: "Categories retrieved successfully",
      data: categories,
    };
  }

  /**
   * @Docs     Get one category by id
   * @Route    GET /api/v1/categories/:id
   * @Access   public
   **/
  async findOne(id: string): Promise<APIRes<Category>> {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    if (!category) throw new NotFoundException("Category not found");

    return {
      success: true,
      message: "Category retrieved successfully",
      data: category,
    };
  }

  /**
   * @Docs     Admin update category by id
   * @Route    PATCH /api/v1/categories/:id
   * @Access   Private [admin]
   **/
  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<APIRes<Category>> {
    const category = await this.prisma.category.findUnique({ where: { id } });
    if (!category) throw new NotFoundException("Category not found");

    if (updateCategoryDto.name && updateCategoryDto !== category.name) {
      const existsName = await this.prisma.category.findUnique({
        where: { name: updateCategoryDto.name },
      });

      if (existsName && existsName.id !== id)
        throw new ConflictException("Category name already exists.");
    }

    if (category.image && updateCategoryDto.image)
      deleteFileIfExists(category.image);

    const updatedCategory = await this.prisma.category.update({
      where: { id },
      data: updateCategoryDto,
    });

    return {
      success: true,
      message: "Category updated successfully",
      data: updatedCategory,
    };
  }

  /**
   * @Docs     Admin delete category by id
   * @Route    DELETE /api/v1/categories/:id
   * @Access   Private [admin]
   **/
  async remove(id: string): Promise<APIRes<Category>> {
    const category = await this.prisma.category.findUnique({ where: { id } });

    if (!category) throw new NotFoundException("Category not found");

    await this.prisma.category.delete({ where: { id } });

    return {
      success: true,
      message: "Category deleted successfully",
      data: category,
    };
  }
}
