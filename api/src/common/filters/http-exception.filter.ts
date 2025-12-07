import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from "@nestjs/common";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = exception.getStatus();

    const exceptionResponse: any = exception.getResponse();

    const message =
      typeof exceptionResponse === "string"
        ? exceptionResponse
        : exceptionResponse.message;

    const error =
      typeof exceptionResponse === "string"
        ? exceptionResponse
        : exceptionResponse.error;

    response.status(status).json({
      success: false,
      message,
      statusCode: status,
      error,
    });
  }
}
