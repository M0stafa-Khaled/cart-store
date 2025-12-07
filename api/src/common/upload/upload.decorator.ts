import { UseInterceptors } from "@nestjs/common";
import {
  FileFieldsInterceptor,
  FileInterceptor,
  FilesInterceptor,
} from "@nestjs/platform-express";
import {
  multerStorage,
  imageFileFilter,
  UploadField,
  multerStorageDynamic,
} from "./upload-storage";

export const UploadFile = (fieldName: string, folder: string) => {
  return UseInterceptors(
    FileInterceptor(fieldName, {
      storage: multerStorage(folder),
      fileFilter: imageFileFilter,
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  );
};

export const UploadFiles = (
  fieldName: string,
  folder: string,
  maxCount = 6,
) => {
  return UseInterceptors(
    FilesInterceptor(fieldName, maxCount, {
      storage: multerStorage(folder),
      fileFilter: imageFileFilter,
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  );
};

export const UploadMultipleFields = (fields: UploadField[]) => {
  return UseInterceptors(
    FileFieldsInterceptor(
      fields.map((f) => ({
        name: f.name,
        maxCount: f.maxCount || 1,
      })),

      {
        storage: multerStorageDynamic(fields),
        fileFilter: imageFileFilter,
        limits: { fileSize: 10 * 1024 * 1024 },
      },
    ),
  );
};
