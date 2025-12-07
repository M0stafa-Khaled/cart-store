import {
  ConflictException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateBrandDto } from "./dto/create-brand.dto";
import { UpdateBrandDto } from "./dto/update-brand.dto";
import { PrismaService } from "../../prisma/prisma.service";
import { APIRes } from "../../common/interfaces";
import { FilterBrandDto } from "./dto/filter-brand.dto";
import { Brand } from "@prisma/client";

@Injectable()
export class BrandService {
  constructor(private prisma: PrismaService) {}

  /**
   * @Docs     Admin create brand
   * @Route    POST /api/v1/brands
   * @Access   Private [admin]
   **/
  async create(createBrandDto: CreateBrandDto): Promise<APIRes<Brand>> {
    const existsBard = await this.prisma.brand.findUnique({
      where: { name: createBrandDto.name },
    });

    if (existsBard) throw new ConflictException("Brand already exists.");

    // created new brand
    const brand = await this.prisma.brand.create({ data: createBrandDto });
    return {
      success: true,
      message: "Brand is created successfully.",
      data: brand,
    };
  }

  /**
   * @Docs     Admin get all brands
   * @Route    GET /api/v1/brands
   * @Access   public
   **/
  async findAll(
    sort: "desc" | "asc" = "desc",
    filters?: FilterBrandDto,
  ): Promise<APIRes<Brand[]>> {
    const where: any = {};

    if (filters?.name)
      where.name = { startsWith: filters.name, mode: "insensitive" };

    const brands = await this.prisma.brand.findMany({
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
      message: null,
      data: brands,
    };
  }

  /**
   * @Docs     Admin get brand by id
   * @Route    GET /api/v1/brands/:id
   * @Access   public
   **/
  async findOne(id: string): Promise<APIRes<Brand>> {
    const brand = await this.prisma.brand.findUnique({
      where: { id },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    if (!brand) throw new NotFoundException("Brand not found");

    return {
      success: true,
      message: null,
      data: brand,
    };
  }

  /**
   * @Docs     Admin update brand by id
   * @Route    PATCH /api/v1/brands/:id
   * @Access   Private [admin]
   **/
  async update(
    id: string,
    updateBrandDto: UpdateBrandDto,
  ): Promise<APIRes<Brand>> {
    const existingBrand = await this.prisma.brand.findUnique({ where: { id } });

    if (!existingBrand) throw new NotFoundException("Brand not found");

    // Check for name conflict if name is being updated
    if (updateBrandDto.name && updateBrandDto.name !== existingBrand.name) {
      const nameExists = await this.prisma.brand.findUnique({
        where: { name: updateBrandDto.name },
      });
      if (nameExists) throw new ConflictException("Brand name already exists.");
    }

    // Update the brand
    const updatedBrand = await this.prisma.brand.update({
      where: { id },
      data: updateBrandDto,
    });

    return {
      success: true,
      message: "Brand updated successfully.",
      data: updatedBrand,
    };
  }

  /**
   * @Docs     Admin delete brand by id
   * @Route    DELETE /api/v1/brands/:id
   * @Access   Private [admin]
   **/
  async remove(id: string): Promise<APIRes<void>> {
    const existsBrand = await this.prisma.brand.findUnique({ where: { id } });

    if (!existsBrand) throw new NotFoundException("Brand not found");

    // Delete the brand
    await this.prisma.brand.delete({ where: { id } });

    return {
      success: true,
      message: "Brand deleted successfully.",
      data: null,
    };
  }
}
