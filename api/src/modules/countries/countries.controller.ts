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
import { CountriesService } from "./countries.service";
import { CreateCountryDto } from "./dto/create-country.dto";
import { UpdateCountryDto } from "./dto/update-country.dto";
import { AuthGuard } from "../auth/guards/auth.guard";

import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { FilterCountryDto } from "./dto/filter-country.dto";

@UseGuards(AuthGuard, RolesGuard)
@Controller("v1/countries")
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) {}

  /**
   * @Docs     Create country
   * @Route    POST /api/v1/countries
   * @Access   Private [admin]
   **/
  @Roles(["ADMIN"])
  @HttpCode(HttpStatus.CREATED)
  @Post()
  create(@Body() createCountryDto: CreateCountryDto) {
    return this.countriesService.create(createCountryDto);
  }

  /**
   * @Docs     Get all countries
   * @Route    GET /api/v1/countries
   * @Access   Private [admin, user]
   **/
  @Roles(["USER", "ADMIN"])
  @Get()
  findAll(@Query() filters: FilterCountryDto) {
    return this.countriesService.findAll(filters);
  }

  /**
   * @Docs     Get country by id
   * @Route    GET /api/v1/countries/:id
   * @Access   Private [admin, user]
   **/
  @Roles(["ADMIN", "USER"])
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.countriesService.findOne(id);
  }

  /**
   * @Docs     Update country
   * @Route    PATCH /api/v1/countries/:id
   * @Access   Private [admin]
   **/
  @Roles(["ADMIN"])
  @Patch(":id")
  update(@Param("id") id: string, @Body() updateCountryDto: UpdateCountryDto) {
    return this.countriesService.update(id, updateCountryDto);
  }

  /**
   * @Docs     Delete country
   * @Route    DELETE /api/v1/countries/:id
   * @Access   Private [admin]
   **/
  @Roles(["ADMIN"])
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.countriesService.remove(id);
  }
}
