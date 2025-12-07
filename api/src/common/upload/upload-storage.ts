import { CloudinaryStorage } from "multer-storage-cloudinary";
import { extname } from "path";
import { BadRequestException } from "@nestjs/common";
import cloudinary from "../config/cloudinary.config";

export const multerStorage = (folder: string) => {
  return new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (_req, file) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const fileExtension = extname(file.originalname).substring(1); // Remove the dot

      return {
        folder: `cart-store/${folder}`,
        public_id: `${file.fieldname}-${uniqueSuffix}`,
        format: fileExtension || "png",
        resource_type: "auto" as const,
      };
    },
  });
};

export const imageFileFilter = (
  _req: any,
  file: Express.Multer.File,
  cb: (error: Error | null, acceptFile: boolean) => void,
) => {
  if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
    return cb(
      new BadRequestException(
        "Only image files types 'jpg, jpeg, png, webp' are allowed!",
      ),
      false,
    );
  }
  cb(null, true);
};

export interface UploadField {
  name: string;
  folder: string;
  maxCount?: number;
}

export const multerStorageDynamic = (fields: UploadField[]) => {
  return new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (_req, file) => {
      const field = fields.find((f) => f.name === file.fieldname);
      const folder = field ? field.folder : "misc";
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const fileExtension = extname(file.originalname).substring(1);

      return {
        folder: `cart-store/${folder}`,
        public_id: `${file.fieldname}-${uniqueSuffix}`,
        format: fileExtension || "png",
        resource_type: "auto" as const,
      };
    },
  });
};
