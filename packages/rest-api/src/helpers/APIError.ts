import httpStatus from 'http-status';

import { config } from '../config/env';

class ExtendableError extends Error {
  public status: number;
  public isPublic: boolean;

  constructor(message: string, status: number, isPublic: boolean) {
    super(message);

    this.name = this.constructor.name;
    this.message = message;
    this.status = status;
    this.isPublic = isPublic;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Represents an API error.
 *
 * Make the error public if we are not in a production environment.
 */
export class APIError extends ExtendableError {
  constructor(
    message: string,
    status = httpStatus.INTERNAL_SERVER_ERROR,
    isPublic = config.env !== 'production' ? true : false,
  ) {
    super(message, status, isPublic);
  }
}
