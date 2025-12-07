import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { PrismaService } from "../../prisma/prisma.service";
import bcrypt from "bcrypt";
import { APIRes } from "../../common/interfaces";
import { FilterUserDto } from "./dto/filter-user.dto";
import { deleteFileIfExists } from "../../common/utils/file.helper";
import { EmailService } from "../../email/email.service";
import * as crypto from "crypto";
import { User } from "@prisma/client";

type UserRes = Partial<User>;

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
  ) {}

  /**
   * @Docs     Admin create users
   * @Route    POST /api/v1/users
   * @Access   Private [admin]
   **/
  async create(data: CreateUserDto): Promise<APIRes<UserRes>> {
    // check if user email exists
    const exists = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (exists) throw new ConflictException("Email already exists");
    // create new user
    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(data.password, salt);

    const user = await this.prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
      omit: {
        password: true,
        refreshToken: true,
      },
    });

    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    const verificationToken = this.generateVerificationToken();
    try {
      await this.emailService.sendVerificationEmail(
        user.email,
        verificationToken,
      );
    } catch (error) {
      console.log("Failed to send verification email");
    }

    // store token in db
    await this.prisma.verificationToken.create({
      data: {
        token: verificationToken,
        userId: user.id,
        type: "EMAIL_VERIFICATION",
        expiresAt,
      },
    });
    return {
      success: true,
      data: user,
      message: "User created successfully",
    };
  }

  /**
   * @Docs     Admin get all users
   * @Route    GET /api/v1/users
   * @Access   Private [admin]
   **/
  async findAll(
    page: number = 1,
    limit: number = 20,
    sort: "desc" | "asc" = "desc",
    filters?: FilterUserDto,
  ): Promise<APIRes<UserRes[]>> {
    if (sort !== "asc" && sort !== "desc") sort = "desc";

    const where: any = {};
    if (filters) {
      if (filters.q) {
        where.OR = [
          { name: { startsWith: filters.q, mode: "insensitive" } },
          { email: { contains: filters.q, mode: "insensitive" } },
          { phone: { contains: filters.q, mode: "insensitive" } },
        ];
      }
      if (filters.role) where.role = filters.role;
      if (filters.active !== undefined) where.active = filters.active;
      if (filters.isVerified !== undefined)
        where.isVerified = filters.isVerified;
    }

    const [data, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        where,
        skip: (page - 1) * limit || 0,
        take: limit,
        orderBy: { createdAt: sort },
        omit: {
          password: true,
          refreshToken: true,
        },
        include: {
          shippingAddresses: {
            include: {
              city: {
                include: {
                  country: true,
                },
                omit: {
                  countryId: true,
                },
              },
            },
            omit: {
              cityId: true,
            },
          },
        },
      }),
      this.prisma.user.count(),
    ]);
    const totalPages = Math.ceil(total / limit);

    return {
      success: true,
      data: {
        items: data,
        meta: {
          count: data.length,
          total,
          page,
          limit,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      },

      message: "Users retrieved successfully",
    };
  }

  /**
   * @Docs     Admin get one user by id
   * @Route    GET /api/v1/users/:id
   * @Access   Private [admin]
   **/
  async findOne(id: string): Promise<APIRes<UserRes>> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      omit: {
        password: true,
        refreshToken: true,
      },
      include: {
        shippingAddresses: {
          include: {
            city: {
              include: {
                country: true,
              },
              omit: {
                countryId: true,
              },
            },
          },
          omit: {
            cityId: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return {
      success: true,
      data: user,
      message: "User retrieved successfully",
    };
  }

  /**
   * @Docs     Admin update user by id
   * @Route    PATCH /api/v1/users/:id
   * @Access   Private [admin]
   **/
  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<APIRes<UserRes>> {
    const userExists = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!userExists) throw new NotFoundException("User not found");

    if (updateUserDto.password) {
      const salt = await bcrypt.genSalt(10);
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, salt);
    }

    if (updateUserDto.email && updateUserDto.email !== userExists.email) {
      // Prevent updating the email to an existing email
      const existingUser = await this.prisma.user.findUnique({
        where: { email: updateUserDto.email },
      });

      if (existingUser && existingUser.id !== id) {
        throw new ConflictException("Email has been already taken");
      }

      // Delete old profile avatar if updated
      if (userExists.avatar && updateUserDto.avatar)
        deleteFileIfExists(userExists.avatar);

      const token = this.generateVerificationToken();
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      // send otp to user email
      await this.emailService.sendVerificationEmail(updateUserDto.email, token);

      // store otp in db
      await this.prisma.verificationToken.create({
        data: {
          token: token,
          userId: id,
          type: "EMAIL_VERIFICATION",
          expiresAt,
        },
      });
    }

    const user = await this.prisma.user.update({
      where: { id: id },
      data: {
        ...updateUserDto,
        ...(updateUserDto.email &&
          userExists.email !== updateUserDto.email && {
            isVerified: false,
            refreshToken: null,
          }),
        refreshToken: null,
      },
      omit: {
        password: true,
        refreshToken: true,
      },
    });

    return {
      success: true,
      message: "User updated successfully",
      data: user,
    };
  }

  /**
   * @Docs     Admin remove user by id
   * @Route    POST /api/v1/users/:id
   * @Access   Private [admin]
   **/
  async remove(id: string, userId: string): Promise<APIRes<UserRes>> {
    if (id === userId) {
      throw new ConflictException("Can't delete yourself");
    }

    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) throw new NotFoundException("User not found");

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

  /**
   * @Docs Generate verification token
   **/
  private generateVerificationToken(): string {
    return crypto.randomBytes(32).toString("hex");
  }
}
