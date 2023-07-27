import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { EntityNotFoundError, QueryFailedError } from 'typeorm';
import {
  CustomHttpExecptionResponse,
  HttpExceptionResponse,
} from './http-exception-response.interface';
import { ResponseMessageError } from './response-message-error';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  logger: Logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status: HttpStatus;
    let errorMessage: string;
    let badReqResponse: object;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const excRes = exception.getResponse();
      const excError = (excRes as HttpExceptionResponse).error;
      errorMessage = excError || exception.message;
      if (excError === 'Bad Request') {
        badReqResponse = Object.assign({}, excRes as object);
      }
    } else if (exception instanceof EntityNotFoundError) {
      status = HttpStatus.NOT_FOUND;
      errorMessage = "Can't found data!";
    } else if (
      exception instanceof QueryFailedError &&
      exception['code'] === 'ER_DUP_ENTRY'
    ) {
      status = HttpStatus.CONFLICT;
      errorMessage = `Already Exist Data!::${
        /Duplicate entry '(.*)' for/.exec(exception['sqlMessage'] as string)[1]
      }`;
    } else if (exception instanceof ResponseMessageError) {
      status = exception.status;
      errorMessage = exception.message;
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      errorMessage =
        '서버에 문제가 발생했습니다. 관리자에게 문의 부탁드립니다.';
    }

    const errorResponse = this.getErrorResponse(
      status,
      errorMessage,
      request,
      badReqResponse,
    );

    this.writeErrorLogToFile(
      this.getErrorLog(errorResponse, request, exception),
    );
    response.status(status).json(errorResponse);
  }

  private getErrorResponse = (
    status: HttpStatus,
    errorMessage: string,
    request: Request,
    badReqResponse: object,
  ): CustomHttpExecptionResponse => ({
    statusCode: status,
    error: errorMessage,
    path: request.url,
    method: request.method,
    timeStamp: new Date(),
    request: badReqResponse,
  });

  private getErrorLog = (
    errorResponse: CustomHttpExecptionResponse,
    request: Request,
    exception: unknown,
  ): object => {
    const { statusCode, error } = errorResponse;
    const { method, url } = request;

    const { ip } = request;
    const clientIp = request.headers['x-forwarded-for']
      ? request.headers['x-forwarded-for']
      : ip;
    const { password, ...otherBody } = request.body;

    return {
      clientIp,
      statusCode,
      method,
      url,
      User: request['user'] ?? 'Not signed in',
      body: otherBody,
      query: request.query,
      errStack: exception['stack'] || error,
    };
  };

  private writeErrorLogToFile = (errorLog: object): void => {
    this.logger.error(errorLog);
  };
}
