import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';

import { ICreatedUser, IUpdatedUser, IPaginationUser } from '../../models/User';
import { ITrack } from '../../models/Track';
import { UserModel } from './user.model';
import { createFakeUsers } from './user.faker';

/**
 * Preload the user into the `Request` when we hit a `clientID` param.
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
 * Create a new user.
 *
 * @param req Express request
 * @param res Express response
 * @param next Express next-function
 */
export function create(req: Request, res: Response, next: NextFunction) {
  const newUser: ICreatedUser = req.body;

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
 * @param req Express request
 * @param res Express response
 * @param next Express next-function
 */
export async function getAll(req: Request, res: Response, next: NextFunction) {
  const pagination: IPaginationUser = {
    limit: parseInt(req.query['limit'], 10) || 100,
    skip: parseInt(req.query['skip'], 10) || 0,
    max: req.query['max'] === 'true',
  };

  if (pagination.max) {
    pagination.limit = await UserModel.estimatedDocumentCount();
    pagination.skip = 0;
  }

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

    if (updatedUser.favorites) {
      // Make sure to empty the favorites array before pushing data to it
      user.favorites.splice(0, user.favorites.length);
      user.favorites.push(...updatedUser.favorites as ITrack[]);
    }

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
