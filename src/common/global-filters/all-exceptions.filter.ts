/* eslint-disable prettier/prettier */
import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus, Inject, Logger } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Logger as WinstonLogger } from 'winston';

@Catch()
class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  constructor(
    private httpAdapterHost: HttpAdapterHost,
    @Inject('winston') private readonly winstonLogger: WinstonLogger,
  ) {}

  catch(exception: any, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;

    const status = exception instanceof Error ? HttpStatus.INTERNAL_SERVER_ERROR : HttpStatus.BAD_REQUEST;
    const message = exception instanceof Error ? exception.message : 'Unknown error occurred';

    this.logger.error(`Exception :${message}, stack ${exception.stack}`);
    this.winstonLogger.error(`Exception :${message}, stack ${exception.stack}`);
    const request = ctx.getRequest();

    // Logging the exception using Winston
    this.winstonLogger.error(`HTTP Status: ${status} Error Message: ${message}`, {
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
    });

    const responseBody = { status: httpStatus, message: 'Internal Server Error' };
    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}

export default AllExceptionsFilter;
