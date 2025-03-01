import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger();
  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const message = exception.getResponse();
    const respData = {
      statusCode: status,
      error: typeof message == 'object' ? message['error'] : undefined,
      message:
        status === 400
          ? message['message']
          : typeof message == 'string'
            ? message
            : typeof message == 'object'
              ? message['message']
              : message,
      timestamp: new Date().toISOString(),
      path: request.url,
    };
    response.status(status).json(respData);
  }
}
