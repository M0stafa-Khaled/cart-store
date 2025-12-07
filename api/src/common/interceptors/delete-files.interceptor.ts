import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { deleteFileIfExists } from "../utils/file.helper";

@Injectable()
export class DeleteFilesInterceptor implements NestInterceptor {
  constructor(private readonly fields: string[]) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      tap((data) => {
        if (!data) return;
        for (const field of this.fields) {
          const value = data?.data?.[field];
          if (!value) continue;

          if (Array.isArray(value)) {
            value?.forEach((filePath) => deleteFileIfExists(filePath || null));
          } else if (typeof value === "string") {
            deleteFileIfExists(value || null);
          }
        }
      }),
    );
  }
}
