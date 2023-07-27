import { HttpStatus } from '@nestjs/common';

const makeMessage = (status: number): string => {
  switch (status) {
    case HttpStatus.NOT_FOUND:
      return 'Not Found Exception.';
    case HttpStatus.BAD_REQUEST:
      return 'Bad Request Exception.';
    default:
      return 'Error!';
  }
};

export const NotFoundError = (message?: string): ResponseMessageError => {
  if (!message) message = makeMessage(HttpStatus.NOT_FOUND);
  return new ResponseMessageError(HttpStatus.NOT_FOUND, message);
};

export const BadRequestError = (message?: string): ResponseMessageError => {
  if (!message) message = makeMessage(HttpStatus.BAD_REQUEST);
  return new ResponseMessageError(HttpStatus.BAD_REQUEST, message);
};

export class ResponseMessageError extends Error {
  readonly status: number;
  constructor(status = 500, message?: string) {
    if (!message) message = makeMessage(status);
    super(message);
    this.status = status;
  }
}
