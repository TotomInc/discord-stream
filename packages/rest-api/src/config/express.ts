import express, { Request, Response, NextFunction } from 'express';
import expressValidation from 'express-validation';
import expressJwt from 'express-jwt';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import cors from 'cors';
import httpStatus from 'http-status';

import { config } from './env';
import { APIError } from '../server/helpers/APIError';
import APIRoutes from '../index.route';

export const app = express();

const unprotectedPaths: string[] = ['/api/heartbeat', '/api/auth', '/api/login', '/api/login/callback'];

// Parse body params and attach them to `req.body`
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Secure apps by setting various HTTP headers
app.use(helmet());

// Enable CORS (Cross Origin Resource Sharing)
app.use(cors());

// Enable JWT protection, add paths exceptions
app.use(expressJwt({ secret: config.secrets.jwt }).unless({ path: unprotectedPaths }));

// Inject API routes under `/api`
app.use('/api', APIRoutes);

// If error is not an instance of APIError, convert it
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof expressValidation.ValidationError) {
    const unifiedErrorMessage = err.errors.map(
      (error: any) => error.messages.join('. '),
    ).join(' and ');

    const error = new APIError(unifiedErrorMessage, err.status, true);

    return next(error);
  }

  if (!(err instanceof APIError)) {
    const apiError = new APIError(err.message, err.status, err.isPublic);

    return next(apiError);
  }

  return next(err);
});

// Catch 404 and forward to error handler
app.use((req: Request, res: Response, next: NextFunction) => {
  const err = new APIError('API not found', httpStatus.NOT_FOUND);

  return next(err);
});

// Error handler, send stacktrace only during development
app.use((err: APIError, req: Request, res: Response, next: NextFunction) => {
  res.status(err.status).json({
    // @ts-ignore
    message: err.isPublic ? err.message : httpStatus[err.status],
    stack: config.env === 'development' ? err.stack : {},
  });
});
