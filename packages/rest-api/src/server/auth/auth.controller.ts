import uuid from 'uuid/v1';
import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import { Request, Response, NextFunction } from 'express';

import { config } from '../../config/env';
import { APIError } from '../helpers/APIError';

/**
 * Sign a JWT that expires after 7 days.
 */
const jwtSignOptions: jwt.SignOptions = {
  expiresIn: 604800,
};

/**
 * Called when reaching `api/auth`, this endpoint is used by third-party tools
 * to generate a JWT if the secret is matching the one used by the API.
 *
 * @param req Express request
 * @param res Express response
 * @param next Express next-function
 */
export function authenticate(req: Request, res: Response, next: NextFunction) {
  const secret = req.body['secret'] as string;

  if (secret !== config.secrets.jwt) {
    const err = new APIError('Authentication error', httpStatus.UNAUTHORIZED, true);
    return next(err);
  }

  const tokenUUID = uuid();
  const token = jwt.sign({ id: tokenUUID }, config.secrets.jwt, jwtSignOptions);

  return res.json({ token });
}
