import { Request, Response, NextFunction } from 'express';

/**
 * When getting an `UnauthorizedError` because of invalid or missing JWT, make
 * sure we don't throw at the user a generic Node error but instead a 401.
 *
 * @param err the error thrown when trying to access the route
 * @param req the express request that initiated this
 * @param res the express response to send
 * @param next next function to continue stuff
 */
export default function(err: Error, req: Request, res: Response, next: NextFunction) {
  if (err.name === 'UnauthorizedError') {
    return res.status(401).end();
  }

  next();
}
