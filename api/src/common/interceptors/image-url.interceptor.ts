import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable()
export class ImageUrlInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const baseUrl = `${request.protocol}://${request.get("host")}`;

    return next.handle().pipe(map((data) => this.addBaseUrl(data, baseUrl)));
  }

  private addBaseUrl(data: any, baseUrl: string): any {
    if (!data) return data;

    if (Array.isArray(data)) {
      return data.map((item) => this.addBaseUrl(item, baseUrl));
    }

    if (typeof data === "string") {
      return data.startsWith("/uploads/") ? `${baseUrl}${data}` : data;
    }

    if (data instanceof Date) {
      return data.toISOString();
    }

    if (typeof data === "object") {
      const result: any = {};
      for (const key in data) {
        if (
          typeof data[key] === "string" &&
          data[key].startsWith("/uploads/")
        ) {
          result[key] = `${baseUrl}${data[key]}`;
        } else {
          result[key] = this.addBaseUrl(data[key], baseUrl);
        }
      }
      return result;
    }

    return data;
  }
}
