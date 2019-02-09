import { Request, Response, NextFunction } from 'express';

import { userModel } from './user.model';

/**
 * Call this function on `router.param`, so when we hit a specific query
 * param, it will *preload* the user model instance and set it into the Express
 * `request` object. We can access this user-instance by doing `req.user`.
 *
 * @param req Express request
 * @param res Express response
 * @param next Express next-function
 * @param id user-id known as client-id
 */
export function load(req: Request, res: Response, next: NextFunction, id: string) {
  userModel.getByClientID(id)
    .then((user) => {
      if (user) {
        req.user = user;
        console.log(req.user);
      }

      next();
    })
    .catch(err => next(err));
}

/**
 * Create a new user model with required params and save it to the db. Return
 * the newly created user.
 *
 * @param req Express request
 * @param res Express response
 * @param next Express next-function
 */
export function create(req: Request, res: Response, next: NextFunction) {
  const user = new userModel({
    clientID: req.body['clientID'] as string,
    username: req.body['username'] as string,
  });

  user.save()
    .then(savedUser => res.json(savedUser.toJSON()))
    .catch(err => next(err));
}

/**
 * If the user instance exists, return a JSON of this instance.
 *
 * @param req Express request
 * @param res Express response
 */
export function get(req: Request, res: Response) {
  if (req.user) {
    return res.json(req.user.toJSON());
  }

  return res.json({});
}
