import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateShippingAddressDto } from "./dto/create-shipping-address.dto";
import { UpdateShippingAddressDto } from "./dto/update-shipping-address.dto";
import { APIRes } from "../../common/interfaces";
import { PrismaService } from "../../prisma/prisma.service";
import { ShippingAddress } from "@prisma/client";

type ShippingType = APIRes<Partial<ShippingAddress>>;

@Injectable()
export class ShippingAddressesService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * @Docs     Create shipping address
   * @Route    POST /api/v1/shipping-addresses
   * @Access   Private [user]
   **/
  async create(
    createShippingAddressDto: CreateShippingAddressDto,
    userId: string,
  ): Promise<ShippingType> {
    const city = await this.prisma.city.findUnique({
      where: { id: createShippingAddressDto.cityId },
    });
    if (!city) throw new NotFoundException("City not found.");

    const country = await this.prisma.country.findUnique({
      where: { id: createShippingAddressDto.countryId },
    });
    if (!country) throw new NotFoundException("Country not found.");

    const citiesInCountry = await this.prisma.city.findMany({
      where: { countryId: createShippingAddressDto.countryId },
    });

    if (
      !citiesInCountry.some(
        (city) => city.id === createShippingAddressDto.cityId,
      )
    ) {
      throw new NotFoundException("City not found in country.");
    }

    const allUserShippingAddresses = await this.prisma.shippingAddress.findMany(
      {
        where: { userId },
      },
    );

    if (allUserShippingAddresses.length >= 5) {
      throw new BadRequestException(
        "You can't have more than 5 shipping addresses.",
      );
    }

    const shippingAddress = await this.prisma.shippingAddress.create({
      data: {
        cityId: createShippingAddressDto.cityId,
        address: createShippingAddressDto.address,
        phone: createShippingAddressDto.phone,
        userId,
      },
      include: {
        city: {
          include: {
            country: true,
          },
        },
      },
      omit: {
        cityId: true,
        userId: true,
      },
    });

    return {
      success: true,
      message: "Shipping address created successfully",
      data: shippingAddress,
    };
  }

  /**
   * @Docs     Get all shipping addresses
   * @Route    GET /api/v1/shipping-addresses
   * @Access   Private [user]
   **/
  async findAll(userId: string): Promise<APIRes<Partial<ShippingAddress>[]>> {
    return {
      success: true,
      message: null,
      data: await this.prisma.shippingAddress.findMany({
        where: {
          userId,
        },
        include: {
          city: {
            include: {
              country: true,
            },
          },
        },
        omit: {
          cityId: true,
          userId: true,
        },
      }),
    };
  }

  /**
   * @Docs     Get shipping address by id
   * @Route    GET /api/v1/shipping-addresses/:id
   * @Access   Private [user]
   **/
  async findOne(id: string, userId: string): Promise<ShippingType> {
    const shippingAddress = await this.prisma.shippingAddress.findUnique({
      where: { id, userId },
      include: {
        city: {
          include: {
            country: true,
          },
        },
      },
      omit: {
        cityId: true,
        userId: true,
      },
    });

    if (!shippingAddress)
      throw new NotFoundException("Shipping address not found.");

    return {
      success: true,
      message: null,
      data: shippingAddress,
    };
  }

  /**
   * @Docs     Update shipping address
   * @Route    PATCH /api/v1/shipping-addresses/:id
   * @Access   Private [user]
   **/
  async update(
    id: string,
    updateShippingAddressDto: UpdateShippingAddressDto,
    userId: string,
  ): Promise<ShippingType> {
    const shippingAddress = await this.prisma.shippingAddress.findUnique({
      where: { id, userId },
    });

    if (!shippingAddress)
      throw new NotFoundException("Shipping address not found.");

    if (updateShippingAddressDto.countryId) {
      const country = await this.prisma.country.findUnique({
        where: { id: updateShippingAddressDto.countryId },
      });
      if (!country) throw new NotFoundException("Country not found.");

      if (!updateShippingAddressDto.cityId)
        throw new BadRequestException("City id is required.");
    }

    if (updateShippingAddressDto.cityId) {
      const city = await this.prisma.city.findUnique({
        where: { id: updateShippingAddressDto.cityId },
      });
      if (!city) throw new NotFoundException("City not found.");

      const citiesInCountry = await this.prisma.city.findMany({
        where: { countryId: updateShippingAddressDto.countryId },
      });

      if (
        !citiesInCountry.some(
          (city) => city.id === updateShippingAddressDto.cityId,
        )
      ) {
        throw new NotFoundException("City not found in country.");
      }
    }

    return {
      success: true,
      message: "Shipping address updated successfully",
      data: await this.prisma.shippingAddress.update({
        where: { id, userId },
        data: {
          cityId: updateShippingAddressDto.cityId,
          address: updateShippingAddressDto.address,
          phone: updateShippingAddressDto.phone,
        },
        include: {
          city: {
            include: {
              country: true,
            },
          },
        },
        omit: {
          cityId: true,
          userId: true,
        },
      }),
    };
  }

  /**
   * @Docs     Delete shipping address
   * @Route    DELETE /api/v1/shipping-addresses/:id
   * @Access   Private [user]
   **/
  async remove(id: string, userId: string): Promise<APIRes<void>> {
    const shippingAddress = await this.prisma.shippingAddress.findUnique({
      where: { id, userId },
    });

    if (!shippingAddress)
      throw new NotFoundException("Shipping address not found.");

    await this.prisma.shippingAddress.delete({ where: { id, userId } });

    return {
      success: true,
      message: "Shipping address deleted successfully",
      data: null,
    };
  }
}
