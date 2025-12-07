import {
  ArgumentMetadata,
  BadRequestException,
  HttpStatus,
  Injectable,
  PipeTransform,
} from "@nestjs/common";
import { validate } from "class-validator";
import { plainToInstance } from "class-transformer";

export interface CustomValidationPipeOptions {
  allowEmptyBody?: boolean;
}

@Injectable()
export class CustomValidationPipe implements PipeTransform {
  constructor(private readonly options: CustomValidationPipeOptions = {}) {}

  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    const isEmpty =
      value === null ||
      value === undefined ||
      (typeof value === "object" && Object.keys(value).length === 0);

    if (isEmpty && this.options.allowEmptyBody) {
      return value;
    }

    if (value)
      Object.keys(value).forEach((key) => {
        const val = value[key];
        if (
          typeof val === "string" &&
          ["true", "false", "1", "0"].includes(val.toLowerCase())
        )
          value[key] = ["true", "1"].includes(val.toLowerCase());
      });

    const object = plainToInstance(metatype, value ?? {}, {
      enableImplicitConversion: true,
    });

    const errors = await validate(object as object, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });

    if (errors.length > 0) {
      const formattedErrors = errors.map((err) => ({
        field: err.property,
        errors: Object.values(err.constraints || {}),
      }));

      throw new BadRequestException({
        error: formattedErrors,
        message: "Validation failed",
        success: false,
      });
    }

    return object;
  }

  private toValidate(metatype: any): boolean {
    const types: any[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
