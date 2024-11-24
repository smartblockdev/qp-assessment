import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { Request } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorResponse: any = {};

    // Check if exception is an instance of HttpException
    if (exception instanceof HttpException) {
      // Use the default handling for HttpException
      status = exception.getStatus();
      errorResponse = {
        statusCode: status,
        message: exception.message,
        error: exception.name,
        timestamp: new Date().toISOString(),
        path: request.url,
      };
    } else {
      // For non-HTTP exceptions (e.g., runtime errors)
      errorResponse = {
        statusCode: status,
        message: exception.message || 'Internal Server Error',
        error: 'Internal Server Error',
        timestamp: new Date().toISOString(),
        path: request.url,
      };
    }

    // Send the response with the correct status and error message
    response.status(status).json(errorResponse);
  }
}
