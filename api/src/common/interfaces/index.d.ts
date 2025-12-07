import { HttpStatus } from "@nestjs/common";
import { User } from "@prisma/client";
import "express";

declare module "express" {
  export interface Request {
    user?: User;
  }
}

export interface APIRes<T> {
  success: boolean;
  message: string | null;
  statusCode?: number;
  data:
    | {
        items: T;
        meta: IPaginationMeta;
      }
    | null
    | T;
}

export interface IPaginationMeta {
  count: number;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}
