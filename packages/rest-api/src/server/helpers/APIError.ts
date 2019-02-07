import httpStatus from 'http-status';

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
 */
export class APIError extends ExtendableError {
  constructor(
    message: string,
    status = httpStatus.INTERNAL_SERVER_ERROR,
    isPublic = false,
  ) {
    super(message, status, isPublic);
  }
}
