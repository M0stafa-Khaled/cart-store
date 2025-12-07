import {
  ConflictException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateCountryDto } from "./dto/create-country.dto";
import { UpdateCountryDto } from "./dto/update-country.dto";
import { FilterCountryDto } from "./dto/filter-country.dto";
import { PrismaService } from "../../prisma/prisma.service";
import { APIRes } from "../../common/interfaces";
import { Country } from "@prisma/client";

@Injectable()
export class CountriesService {
  constructor(private prisma: PrismaService) {}

  /**
   * @Docs     Create country
   * @Route    POST /api/v1/countries
   * @Access   Private [admin]
   **/
  async create(createCountryDto: CreateCountryDto): Promise<APIRes<Country>> {
    const existsCountry = await this.prisma.country.findUnique({
      where: {
        name: createCountryDto.name,
      },
    });
    if (existsCountry) throw new ConflictException("Country already exists.");
    return {
      success: true,
      message: "Country created successfully.",
      data: await this.prisma.country.create({ data: createCountryDto }),
    };
  }

  /**
   * @Docs     Get all countries
   * @Route    GET /api/v1/countries
   * @Access   Private [admin, user]
   **/
  async findAll(filters: FilterCountryDto): Promise<APIRes<Country[]>> {
    const where: any = {};
    if (filters.name) {
      where.name = {
        contains: filters.name,
        mode: "insensitive",
      };
    }
    return {
      success: true,
      message: null,
      data: await this.prisma.country.findMany({
        where,
        orderBy: { createdAt: filters.sort },
      }),
    };
  }

  /**
   * @Docs     Get country by id
   * @Route    GET /api/v1/countries/:id
   * @Access   Private [admin, user]
   **/
  async findOne(id: string): Promise<APIRes<Country>> {
    const country = await this.prisma.country.findUnique({ where: { id } });
    if (!country) throw new NotFoundException("Country not found.");
    return {
      success: true,
      message: null,
      data: country,
    };
  }

  /**
   * @Docs     Update country
   * @Route    PATCH /api/v1/countries/:id
   * @Access   Private [admin]
   **/
  async update(
    id: string,
    updateCountryDto: UpdateCountryDto,
  ): Promise<APIRes<Country>> {
    const country = await this.prisma.country.findUnique({ where: { id } });
    if (!country) throw new NotFoundException("Country not found.");

    if (updateCountryDto.name) {
      const existsCountry = await this.prisma.country.findUnique({
        where: {
          name: updateCountryDto.name,
        },
      });
      if (existsCountry && existsCountry.id !== id)
        throw new ConflictException("Country already exists.");
    }
    return {
      success: true,
      message: "Country updated successfully.",
      data: await this.prisma.country.update({
        where: { id },
        data: updateCountryDto,
      }),
    };
  }

  /**
   * @Docs     Delete country
   * @Route    DELETE /api/v1/countries/:id
   * @Access   Private [admin]
   **/
  async remove(id: string): Promise<APIRes<void>> {
    const country = await this.prisma.country.findUnique({ where: { id } });
    if (!country) throw new NotFoundException("Country not found.");

    await this.prisma.country.delete({ where: { id } });
    return {
      success: true,
      message: "Country deleted successfully.",
      data: null,
    };
  }
}
