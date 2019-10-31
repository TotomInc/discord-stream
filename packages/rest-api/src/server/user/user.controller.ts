import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';

import { ICreatedUser, IUpdatedUser, IPaginationUser } from '../../models/User';
import { UserModel } from './user.model';
import { createFakeUsers } from './user.faker';

/**
 * Call this function on `router.param`, so when we hit a specific query param,
 * it will *preload* the user model instance and set it into the Express
 * `request` object. We can access this user-instance by doing `req.user`.
 *
 * @param req Express request
 * @param res Express response
 * @param next Express next-function
 * @param id user-id known aka. discord client-id
 */
export function load(req: Request, res: Response, next: NextFunction, id: string) {
  UserModel.findOne({
    clientID: id,
  })
    .then((user) => {
      if (user) {
        req.user = user;
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
  const newUser: ICreatedUser = {
    clientID: req.body['clientID'],
    username: req.body['username'],
    hash: req.body['hash'],
  };

  new UserModel(newUser)
    .save()
    .then(savedUser => res.json(savedUser.toJSON()))
    .catch(err => next(err));
}

/**
 * Create a lot of fake new users using `faker`.
 *
 * @param req Express request
 * @param res Express response
 * @param next Express next-function
 */
export function createFake(req: Request, res: Response, next: NextFunction) {
  const fakeUsers = createFakeUsers(100);

  fakeUsers.map(fakeUser => new UserModel(fakeUser))
    .forEach(fakeUser => fakeUser.save());

  return res.json(fakeUsers);
}

/**
 * Get the loaded user document by its client-id.
 *
 * @param req Express request
 * @param res Express response
 */
export function get(req: Request, res: Response) {
  if (req.user && req.user._id) {
    return res.json(req.user.toJSON());
  }

  return res.sendStatus(httpStatus.NOT_FOUND);
}

/**
 * Get all users, accept a pagination body (see `IPaginationUser`).
 *
 * Limit to 100 users max, skip 0 users by default.
 *
 * @param req Express request
 * @param res Express response
 * @param next Express next-function
 */
export function getAll(req: Request, res: Response, next: NextFunction) {
  const pagination: IPaginationUser = {
    limit: parseInt(req.body['limit'], 10) || 100,
    skip: parseInt(req.body['skip'], 10) || 0,
  };

  // Make sure to have a maximum limit of 100 users requested at once
  pagination.limit = pagination.limit > 100 ? 100 : pagination.limit;

  return UserModel.find({})
    .limit(pagination.limit)
    .skip(pagination.skip)
    .then(users => res.json(users.map(user => user.toJSON())))
    .catch(err => next(err));
}

/**
 * Update an existing user, must not be able to change its client-id.
 *
 * @param req Express request
 * @param res Express response
 * @param next Express next-function
 */
export function update(req: Request, res: Response, next: NextFunction) {
  if (req.user && req.user._id) {
    const user = req.user;
    const updatedUser: IUpdatedUser = req.body;

    user.username = updatedUser.username;
    user.hash = updatedUser.hash;

    return user.save()
      .then(savedUser => res.json(savedUser.toJSON()))
      .catch(err => next(err));
  }

  return res.sendStatus(httpStatus.NOT_FOUND);
}

/**
 * @param req Express request
 * @param res Express response
 * @param next Express next-function
 */
export function remove(req: Request, res: Response, next: NextFunction) {
  if (req.user && req.user._id) {
    return req.user.remove()
      .then(deletedUser => res.json(deletedUser.toJSON()))
      .catch(err => next(err));
  }

  return res.sendStatus(httpStatus.NOT_FOUND);
}
