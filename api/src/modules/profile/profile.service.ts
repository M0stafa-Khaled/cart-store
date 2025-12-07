import bcrypt from "bcrypt";
import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { PrismaService } from "../../prisma/prisma.service";
import { APIRes } from "../../common/interfaces";
import type { User } from "@prisma/client";
import { deleteFileIfExists } from "../../common/utils/file.helper";

@Injectable()
export class ProfileService {
  constructor(private prisma: PrismaService) {}

  /**
   * @Docs     Get user profile
   * @Route    GET /api/v1/profile
   * @Access   Private [user, admin]
   **/
  async getProfile(userId: string): Promise<APIRes<Partial<User>>> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        shippingAddresses: true,
      },
      omit: {
        refreshToken: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    const { password, ...rest } = user;

    return {
      success: true,
      message: "User profile fetched successfully",
      data: rest,
    };
  }

  /**
   * @Docs     Update user profile
   * @Route    PATCH /api/v1/profile
   * @Access   Private [user, admin]
   **/
  async update(
    id: string,
    updateProfileDto: UpdateProfileDto,
  ): Promise<APIRes<Partial<User>>> {
    const userExists = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!userExists) throw new UnauthorizedException();

    if (updateProfileDto.password) {
      const salt = await bcrypt.genSalt(10);
      updateProfileDto.password = await bcrypt.hash(
        updateProfileDto.password,
        salt,
      );
    }

    // Delete old profile avatar if updated
    if (userExists.avatar && updateProfileDto.avatar)
      deleteFileIfExists(userExists.avatar);

    const user = await this.prisma.user.update({
      where: { id: id },
      include: { shippingAddresses: true },
      omit: {
        password: true,
        refreshToken: true,
      },
      data: updateProfileDto,
    });

    return {
      success: true,
      message: "Profile updated successfully",
      data: user,
    };
  }

  /**
   * @Docs     Delete user profile
   * @Route    DELETE /api/v1/profile
   * @Access   Private [user, admin]
   **/
  async remove(id: string): Promise<APIRes<Partial<User>>> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) throw new UnauthorizedException();

    if (user.role === "ADMIN") {
      const adminCount = await this.prisma.user.count({
        where: { role: "ADMIN" },
      });

      if (adminCount <= 1) {
        throw new ConflictException(
          "Cannot delete the only admin user in the system.",
        );
      }
    }

    const deletedUser = await this.prisma.user.delete({
      where: { id },
      omit: {
        password: true,
        refreshToken: true,
      },
    });

    return {
      success: true,
      message: "User deleted successfully",
      data: deletedUser,
    };
  }
}
