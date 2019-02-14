import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import httpStatus from 'http-status';

import { Favorite } from '../../models/Favorite';

/**
 * Call this function on `router.param`, so when we hit a specific query
 * param, it will *preload* the favorite and set it into the Express `request`
 * object. We can access the favorite object by doing `req.favorite`.
 *
 * @param req Express request
 * @param res Express response
 * @param next Express next-function
 * @param id favorite-id
 */
export function load(req: Request, res: Response, next: NextFunction, id: string) {
  if (req.user && req.user._id) {
    const user = req.user;
    const favorite = user.favorites.find(favorite => favorite._id === id);

    if (favorite) {
      req.favorite = favorite;
    }

    return next();
  }

  return next(new Error('User doesn\'t exist, unable to find a favorite track from a non-existing user'));
}

/**
 * If the favorite exists in the request, return it.
 *
 * @param req Express request
 * @param res Express response
 */
export function get(req: Request, res: Response) {
  if (req.favorite && req.favorite._id) {
    return res.json(req.favorite);
  }

  return res.json(httpStatus.NOT_FOUND);
}

/**
 * Add a new track to the user `favorites` array, and make sure it doesn't
 * have duplicates (URL is unique).
 *
 * @param req Express request
 * @param res Express response
 * @param next Express next-function
 */
export function create(req: Request, res: Response, next: NextFunction) {
  if (req.user && req.user._id) {
    const user = req.user;
    const id = new mongoose.Types.ObjectId().toHexString();
    const favorite: Favorite = {
      _id: id,
      ...req.body,
    };
    const hasFavorite = user.favorites.find(fav => fav.url === favorite.url);

    if (!hasFavorite) {
      user.favorites.push(favorite);
      user.markModified('favorites');

      return user.save()
        .then(savedUser => res.json(savedUser.toJSON()))
        .catch(err => next(err));
    }

    return res.sendStatus(httpStatus.BAD_REQUEST);
  }

  return res.sendStatus(httpStatus.NOT_FOUND);
}

/**
 * Update a favorite on the user object.
 *
 * @param req Express request
 * @param res Express response
 * @param next Express next-function
 */
export function update(req: Request, res: Response, next: NextFunction) {
  if (req.user && req.user._id && req.favorite && req.favorite._id) {
    const user = req.user;
    const favorite = req.favorite;

    favorite.description = req.body['description'] as string;
    favorite.duration = req.body['duration'] as string;
    favorite.provider = req.body['provider'] as string;
    favorite.thumbnailURL = req.body['thumbnailURL'] as string;
    favorite.title = req.body['title'] as string;
    favorite.url = req.body['url'] as string;
    favorite.views = req.body['views'] as string;

    const favoriteIndex = user.favorites.findIndex(fav => fav._id === favorite._id);

    if (favoriteIndex === -1) {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }

    user.favorites[favoriteIndex] = favorite;
    user.markModified('favorites');

    return user.save()
      .then(savedUser => res.json(savedUser.toJSON()))
      .catch(err => next(err));
  }

  return res.sendStatus(httpStatus.NOT_FOUND);
}

/**
 * Remove a favorite from a user based on its `_id`.
 *
 * @param req Express request
 * @param res Express response
 * @param next Express next-function
 */
export function remove(req: Request, res: Response, next: NextFunction) {
  if (req.user && req.user._id && req.favorite && req.favorite._id) {
    const user = req.user;
    const favorite = req.favorite;
    const favoriteIndex = user.favorites.findIndex(fav => fav._id === favorite._id);

    if (favoriteIndex === -1) {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }

    user.favorites.splice(favoriteIndex, 1);
    user.markModified('favorites');

    return req.user.save()
      .then(savedUser => res.json(savedUser.toJSON()))
      .catch(err => next(err));
  }

  return res.json(httpStatus.NOT_FOUND);
}
