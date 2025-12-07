import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { PrismaService } from "../../prisma/prisma.service";
import { APIRes } from "../../common/interfaces";
import { calcDiscount } from "../../common/utils/calcDiscount";
import { deleteFileIfExists } from "../../common/utils/file.helper";
import { FilterProductDto } from "./dto/filter-product.dto";
import { Product } from "@prisma/client";

type ProductRes = APIRes<Partial<Product>>;

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  /**
   * @Docs     Admin create product
   * @Route    POST /api/v1/products
   * @Access   private [Admin]
   **/
  async create(createProductDto: CreateProductDto): Promise<ProductRes> {
    const productExists = await this.prisma.product.findUnique({
      where: { title: createProductDto.title },
    });

    if (productExists) throw new ConflictException("Product already exists");

    // Category
    const category = await this.prisma.category.findUnique({
      where: { id: createProductDto.categoryId },
    });

    if (!category) throw new NotFoundException("Category not found");

    // Sub Category
    const subCategory = await this.prisma.subCategory.findUnique({
      where: { id: createProductDto.subCategoryId },
    });

    if (!subCategory) throw new NotFoundException("Sub Category not found");

    // Brand
    const brand = await this.prisma.brand.findUnique({
      where: { id: createProductDto.brandId },
    });

    if (!brand) throw new NotFoundException("Brand not found");

    // Calculate price after discount
    let priceAfterDiscount = createProductDto.price;
    if (createProductDto.discountType && createProductDto.discountValue) {
      priceAfterDiscount = calcDiscount(
        createProductDto.discountType,
        createProductDto.discountValue,
        createProductDto.price,
      );
    }

    if (
      createProductDto.discountType === "FIXED" &&
      createProductDto.discountValue &&
      createProductDto.discountValue > createProductDto.price
    )
      throw new BadRequestException(
        "Invalid discount, discount value is greater than price",
      );

    if (priceAfterDiscount < 0)
      throw new BadRequestException("Invalid discount");

    const product = await this.prisma.product.create({
      data: {
        ...createProductDto,
        priceAfterDiscount,
        discountType: createProductDto.discountType || null,
        discountValue: createProductDto.discountValue || null,
      },
      include: { brand: true, category: true, subCategory: true },
      omit: { subCategoryId: true, brandId: true, categoryId: true },
    });

    return {
      success: true,
      message: "Product created successfully",
      data: product,
    };
  }

  /**
   * @Docs     Admin, user get all products
   * @Route    GET /api/v1/products
   * @Access   private [Admin, user]
   **/
  async findAll(
    page: number = 1,
    limit: number = 20,
    sort: "desc" | "asc" = "desc",
    reviews: "true" | "false" = "false",
    filters?: FilterProductDto,
  ): Promise<APIRes<Partial<Product>[]>> {
    if (sort !== "asc" && sort !== "desc") sort = "desc";

    page = Number(page) || 1;
    limit = Number(limit) || 20;

    const where: any = {};

    if (filters) {
      if (filters.title)
        where.title = { contains: filters.title, mode: "insensitive" };
      if (filters.category)
        where.category = {
          name: { contains: filters.category, mode: "insensitive" },
        };
      if (filters.subCategory)
        where.subCategory = {
          name: { contains: filters.subCategory, mode: "insensitive" },
        };
      if (filters.brand)
        where.brand = {
          name: { contains: filters.brand, mode: "insensitive" },
        };
      if (filters.minPrice)
        where.priceAfterDiscount = { gte: filters.minPrice };
      if (filters.maxPrice)
        where.priceAfterDiscount = { lte: filters.maxPrice };
      if (filters.search)
        where.OR = [
          { title: { contains: filters.search, mode: "insensitive" } },
          { description: { contains: filters.search, mode: "insensitive" } },
          {
            brand: { name: { contains: filters.search, mode: "insensitive" } },
          },
          {
            category: {
              name: { contains: filters.search, mode: "insensitive" },
            },
          },
          {
            subCategory: {
              name: { contains: filters.search, mode: "insensitive" },
            },
          },
        ];
    }

    const [data, total] = await this.prisma.$transaction([
      this.prisma.product.findMany({
        where,
        skip: (page - 1) * limit || 0,
        take: limit,
        orderBy: { createdAt: sort },
        include: {
          category: true,
          subCategory: true,
          brand: true,
          reviews:
            reviews === "true"
              ? {
                  include: {
                    user: {
                      select: {
                        id: true,
                        name: true,
                        avatar: true,
                      },
                    },
                  },
                  omit: { userId: true, productId: true },
                }
              : false,
        },
        omit: { categoryId: true, subCategoryId: true, brandId: true },
      }),
      this.prisma.product.count(),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      success: true,
      message: null,
      data: {
        items: data,
        meta: {
          count: data.length,
          limit,
          page,
          total,
          totalPages,
          hasPrevPage: page < totalPages,
          hasNextPage: page > 1,
        },
      },
    };
  }

  /**
   * @Docs     Admin get product by id
   * @Route    GET /api/v1/products/:id
   * @Access   private [Admin]
   **/
  async findOne(
    id: string,
    reviews: "true" | "false" = "false",
  ): Promise<ProductRes> {
    if (reviews && reviews !== "true" && reviews !== "false")
      throw new BadRequestException("reviews must be true or false");

    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        brand: true,
        category: true,
        subCategory: true,
        reviews:
          reviews === "true"
            ? {
                include: {
                  user: {
                    select: {
                      id: true,
                      name: true,
                      avatar: true,
                    },
                  },
                },
                omit: { userId: true, productId: true },
              }
            : false,
      },
      omit: { subCategoryId: true, brandId: true, categoryId: true },
    });

    if (!product) throw new NotFoundException("Product not found");

    return {
      success: true,
      message: null,
      data: product,
    };
  }

  /**
   * @Docs     Admin update product
   * @Route    PATCH /api/v1/products/:id
   * @Access   private [Admin]
   **/
  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<ProductRes> {
    // Check Product exists
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) throw new NotFoundException("Product not found");

    // Category
    if (updateProductDto.categoryId) {
      const category = await this.prisma.category.findUnique({
        where: { id: updateProductDto.categoryId },
      });

      if (!category) throw new NotFoundException("Category not found");
    }

    // Sub Category
    if (updateProductDto.subCategoryId) {
      const subCategory = await this.prisma.subCategory.findUnique({
        where: { id: updateProductDto.subCategoryId },
      });

      if (!subCategory) throw new NotFoundException("Sub Category not found");
    }

    // Brand
    if (updateProductDto.brandId) {
      const brand = await this.prisma.brand.findUnique({
        where: { id: updateProductDto.brandId },
      });

      if (!brand) throw new NotFoundException("Brand not found");
    }

    // calculate price after discount
    let priceAfterDiscount = updateProductDto.price || product.price;
    if (updateProductDto.discountType && updateProductDto.discountValue) {
      priceAfterDiscount = calcDiscount(
        updateProductDto.discountType,
        updateProductDto.discountValue,
        updateProductDto.price || product.price,
      );
    }

    if (
      updateProductDto.discountType === "FIXED" &&
      updateProductDto.discountValue &&
      updateProductDto.discountValue > (updateProductDto.price || product.price)
    )
      throw new BadRequestException(
        "Invalid discount, discount value is greater than price",
      );

    if (priceAfterDiscount < 0)
      throw new BadRequestException("Invalid discount");

    // Delete old image cover
    if (updateProductDto.imageCover) deleteFileIfExists(product.imageCover);

    // Delete old images
    if (updateProductDto.images)
      updateProductDto.images.forEach((image) => deleteFileIfExists(image));

    const updatedProduct = await this.prisma.product.update({
      where: { id },
      data: {
        ...updateProductDto,
        priceAfterDiscount,
        discountType: updateProductDto.discountType || null,
        discountValue: updateProductDto.discountValue || null,
      },
      include: { category: true, subCategory: true, brand: true },
      omit: { categoryId: true, subCategoryId: true, brandId: true },
    });

    return {
      success: true,
      message: "Product updated successfully",
      data: updatedProduct,
    };
  }

  /**
   * @Docs     Admin delete product
   * @Route    DELETE /api/v1/products/:id
   * @Access   private [Admin]
   **/
  async remove(id: string): Promise<APIRes<void>> {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) throw new NotFoundException("Product not found");

    // Delete old image cover
    if (product.imageCover) await deleteFileIfExists(product.imageCover);

    // Delete old images
    if (product.images)
      product.images.forEach((image) => {
        deleteFileIfExists(image);
      });

    await this.prisma.product.delete({ where: { id } });

    return {
      success: true,
      message: "Product deleted successfully",
      data: null,
    };
  }
}
