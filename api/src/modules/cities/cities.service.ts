import {
  ConflictException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateCityDto } from "./dto/create-city.dto";
import { UpdateCityDto } from "./dto/update-city.dto";
import { FilterCityDto } from "./dto/filter-city.dto";
import { PrismaService } from "../../prisma/prisma.service";
import { APIRes } from "../../common/interfaces";
import { City } from "@prisma/client";

@Injectable()
export class CitiesService {
  constructor(private prisma: PrismaService) {}

  /**
   * @Docs     Create city
   * @Route    POST /api/v1/cities
   * @Access   Private [admin]
   **/
  async create(createCityDto: CreateCityDto): Promise<APIRes<Partial<City>>> {
    const existsCity = await this.prisma.city.findUnique({
      where: { name: createCityDto.name },
    });
    if (existsCity) throw new ConflictException("City is already exists.");

    const country = await this.prisma.country.findUnique({
      where: { id: createCityDto.countryId },
    });

    if (!country) throw new NotFoundException("Country not found.");

    return {
      success: true,
      message: "City created successfully.",
      data: await this.prisma.city.create({ data: createCityDto }),
    };
  }

  /**
   * @Docs     Get all cities
   * @Route    GET /api/v1/cities
   * @Access   Private [admin, user]
   **/
  async findAll(filters: FilterCityDto): Promise<APIRes<Partial<City>[]>> {
    const where: any = {};
    if (filters) {
      if (filters.name)
        where.name = { contains: filters.name, mode: "insensitive" };
      if (filters.country)
        where.country = {
          name: { contains: filters.country, mode: "insensitive" },
        };
    }

    return {
      success: true,
      message: null,
      data: await this.prisma.city.findMany({
        where,
        orderBy: { createdAt: filters.sort },
        include: { country: true },
        omit: {
          countryId: true,
        },
      }),
    };
  }

  /**
   * @Docs     Get city by id
   * @Route    GET /api/v1/cities/:id
   * @Access   Private [admin, user]
   **/
  async findOne(id: string): Promise<APIRes<Partial<City>>> {
    const city = await this.prisma.city.findUnique({
      where: { id },
      include: { country: true },
      omit: {
        countryId: true,
      },
    });
    if (!city) throw new NotFoundException("City not found.");
    return {
      success: true,
      message: null,
      data: city,
    };
  }

  /**
   * @Docs     Update city
   * @Route    PATCH /api/v1/cities/:id
   * @Access   Private [admin]
   **/
  async update(
    id: string,
    updateCityDto: UpdateCityDto,
  ): Promise<APIRes<Partial<City>>> {
    const city = await this.prisma.city.findUnique({
      where: { id },
      include: { country: true },
      omit: {
        countryId: true,
      },
    });
    if (!city) throw new NotFoundException("City not found.");

    if (updateCityDto.name) {
      const existsCity = await this.prisma.city.findUnique({
        where: { name: updateCityDto.name },
      });
      if (existsCity && existsCity.id !== id)
        throw new ConflictException("City is already exists.");
    }

    if (updateCityDto.countryId) {
      const country = await this.prisma.country.findUnique({
        where: { id: updateCityDto.countryId },
      });
      if (!country) throw new NotFoundException("Country not found.");
    }

    return {
      success: true,
      message: "City updated successfully.",
      data: await this.prisma.city.update({
        where: { id },
        data: updateCityDto,
      }),
    };
  }

  /**
   * @Docs     Delete city
   * @Route    DELETE /api/v1/cities/:id
   * @Access   Private [admin]
   **/
  async remove(id: string): Promise<APIRes<void>> {
    const city = await this.prisma.city.findUnique({ where: { id } });
    if (!city) throw new NotFoundException("City not found.");

    await this.prisma.city.delete({ where: { id } });
    return {
      success: true,
      message: "City deleted successfully.",
      data: null,
    };
  }
}
