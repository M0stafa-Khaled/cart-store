import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
  UseInterceptors,
  UploadedFile,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { AuthGuard } from "../../modules/auth/guards/auth.guard";
import { RolesGuard } from "../../modules/auth/guards/roles.guard";
import { Roles } from "../../modules/auth/decorators/roles.decorator";
import type { Request } from "express";
import { FilterUserDto } from "./dto/filter-user.dto";
import { CustomValidationPipe } from "../../common/validation/validation.pipe";
import { UploadFile } from "../../common/upload/upload.decorator";
import { DeleteFilesInterceptor } from "../../common/interceptors/delete-files.interceptor";
import { deleteFileIfExists } from "../../common/utils/file.helper";

@Controller("v1/users")
@UseGuards(AuthGuard, RolesGuard)
export class UserController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * @Docs     Admin create users
   * @Route    POST /api/v1/users
   * @Access   Private [admin]
   **/
  @HttpCode(HttpStatus.CREATED)
  @Roles(["ADMIN"])
  @Post()
  @UploadFile("avatar", "users")
  async create(
    @Body(new CustomValidationPipe({ allowEmptyBody: false }))
    createUserDto: CreateUserDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    try {
      if (file) {
        createUserDto.avatar = file.path;
      }
      return await this.usersService.create(createUserDto);
    } catch (error) {
      if (file) {
        await deleteFileIfExists(file.path);
      }
      throw error;
    }
  }

  /**
   * @Docs     Admin get all users
   * @Route    GET /api/v1/users
   * @Access   Private [admin]
   **/
  @Roles(["ADMIN"])
  @Get()
  async findAll(
    @Query("page") page?: string,
    @Query("limit") limit?: string,
    @Query("sort") sort: "desc" | "asc" = "desc",
    @Query() filters?: FilterUserDto,
  ) {
    return this.usersService.findAll(
      Number(page) || 1,
      Number(limit) || 20,
      sort,
      filters,
    );
  }

  /**
   * @Docs     Admin get one user by id
   * @Route    GET /api/v1/users/:id
   * @Access   Private [admin]
   **/
  @Roles(["ADMIN"])
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.usersService.findOne(id);
  }

  /**
   * @Docs     Admin update user by id
   * @Route    PATCH /api/v1/users/:id
   * @Access   Private [admin]
   **/
  @HttpCode(HttpStatus.OK)
  @Roles(["ADMIN"])
  @Patch(":id")
  @UploadFile("avatar", "users")
  async update(
    @Param("id") id: string,
    @Body(new CustomValidationPipe({ allowEmptyBody: false }))
    updateUserDto: UpdateUserDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    try {
      if (file) {
        updateUserDto.avatar = file.path;
      }
      return await this.usersService.update(id, updateUserDto);
    } catch (error) {
      if (file) {
        await deleteFileIfExists(file.path);
      }
      throw error;
    }
  }

  /**
   * @Docs     Admin delete user by id
   * @Route    DELETE /api/v1/users/:id
   * @Access   Private [admin]
   **/
  @Roles(["ADMIN"])
  @Delete(":id")
  @UseInterceptors(new DeleteFilesInterceptor(["avatar"]))
  remove(@Param("id") id: string, @Req() req: Request) {
    return this.usersService.remove(id, req.user?.id ?? "");
  }
}
