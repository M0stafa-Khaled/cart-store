import {
  Controller,
  Get,
  Body,
  Patch,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from "@nestjs/common";
import { ProfileService } from "./profile.service";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { CurrentUser } from "../../common/decorators/current-user/current-user.decorator";
import { AuthGuard } from "../../modules/auth/guards/auth.guard";
import { RolesGuard } from "../../modules/auth/guards/roles.guard";
import { UploadFile } from "../../common/upload/upload.decorator";
import { deleteFileIfExists } from "../../common/utils/file.helper";
import { DeleteFilesInterceptor } from "../../common/interceptors/delete-files.interceptor";
import { CustomValidationPipe } from "../../common/validation/validation.pipe";
import type { User } from "@prisma/client";

@Controller("v1/profile")
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  /**
   * @Docs     Get user profile
   * @Route    GET /api/v1/profile
   * @Access   Private [user, admin]
   **/
  @UseGuards(AuthGuard)
  @Get()
  getProfile(@CurrentUser() user: User) {
    return this.profileService.getProfile(user.id);
  }

  /**
   * @Docs     Update user profile
   * @Route    PATCH /api/v1/profile
   * @Access   Private [user, admin]
   **/
  @UseGuards(AuthGuard, RolesGuard)
  @Patch()
  @UploadFile("avatar", "users")
  async update(
    @Body(new CustomValidationPipe({ allowEmptyBody: false }))
    updateProfileDto: UpdateProfileDto,
    @CurrentUser() user: User,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    try {
      if (file) {
        updateProfileDto.avatar = file.path;
      }
      return await this.profileService.update(user.id, updateProfileDto);
    } catch (error) {
      if (file) {
        await deleteFileIfExists(file.path);
      }
      throw error;
    }
  }

  /**
   * @Docs     Delete user profile
   * @Route    DELETE /api/v1/profile
   * @Access   Private [user, admin]
   **/
  @UseGuards(AuthGuard, RolesGuard)
  @Delete()
  @UseInterceptors(new DeleteFilesInterceptor(["avatar"]))
  remove(@CurrentUser() user: User) {
    return this.profileService.remove(user.id);
  }
}
