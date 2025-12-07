import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
  Query,
} from "@nestjs/common";
import { CitiesService } from "./cities.service";
import { CreateCityDto } from "./dto/create-city.dto";
import { UpdateCityDto } from "./dto/update-city.dto";
import { AuthGuard } from "../auth/guards/auth.guard";

import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { FilterCityDto } from "./dto/filter-city.dto";

@UseGuards(AuthGuard, RolesGuard)
@Controller("v1/cities")
export class CitiesController {
  constructor(private readonly citiesService: CitiesService) {}

  /**
   * @Docs     Create city
   * @Route    POST /api/v1/cities
   * @Access   Private [admin]
   **/
  @Roles(["ADMIN"])
  @HttpCode(HttpStatus.CREATED)
  @Post()
  create(@Body() createCityDto: CreateCityDto) {
    return this.citiesService.create(createCityDto);
  }

  /**
   * @Docs     Get all cities
   * @Route    GET /api/v1/cities
   * @Access   Private [admin, user]
   **/
  @Roles(["ADMIN", "USER"])
  @Get()
  findAll(@Query() filters: FilterCityDto) {
    return this.citiesService.findAll(filters);
  }

  /**
   * @Docs     Get city by id
   * @Route    GET /api/v1/cities/:id
   * @Access   Private [admin, user]
   **/
  @Roles(["ADMIN", "USER"])
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.citiesService.findOne(id);
  }

  /**
   * @Docs     Update city
   * @Route    PATCH /api/v1/cities/:id
   * @Access   Private [admin]
   **/
  @Roles(["ADMIN"])
  @Patch(":id")
  update(@Param("id") id: string, @Body() updateCityDto: UpdateCityDto) {
    return this.citiesService.update(id, updateCityDto);
  }

  /**
   * @Docs     Delete city
   * @Route    DELETE /api/v1/cities/:id
   * @Access   Private [admin]
   **/
  @Roles(["ADMIN"])
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.citiesService.remove(id);
  }
}
