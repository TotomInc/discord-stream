import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';

import { Track } from '../../models/Track';
import { IPaginationQueue } from '../../models/Queue';
import { QueueModel } from './queue.model';

/**
 * Preload the user into the `Request` when we hit a `clientID` param.
 *
 * @param req Express request
 * @param res Express response
 * @param next Express next-function
 * @param id guild-id
 */
export function load(req: Request, res: Response, next: NextFunction, guildID: string) {
  QueueModel.findOne({ guildID })
    .then((queue) => {
      if (queue && queue._id) {
        req.queue = queue;
      }

      next();
    })
    .catch(err => next(err));
}

/**
 * Try to return the guild queue stored from the request object.
 *
 * @param req Express request
 * @param res Express response
 */
export function get(req: Request, res: Response) {
  if (req.queue && req.queue._id) {
    return res.json(req.queue.toJSON());
  }

  return res.sendStatus(httpStatus.NOT_FOUND);
}

/**
 * Get all queues, accept a pagination body (see `IPaginationQueue`).
 *
 * Limit to 100 queues max, skip 0 queues by default.
 *
 * @param req Express request
 * @param res Express response
 */
export function getAll(req: Request, res: Response, next: NextFunction) {
  const pagination: IPaginationQueue = {
    limit: parseInt(req.body['limit'], 10) || 100,
    skip: parseInt(req.body['skip'], 10) || 0,
  };

  // Make sure to have a maximum limit of 100 queues requested at once
  pagination.limit = pagination.limit > 100 ? 100 : pagination.limit;

  return QueueModel.find({})
    .limit(pagination.limit)
    .skip(pagination.skip)
    .then(queues => res.json(queues.map(queue => queue.toJSON())))
    .catch(err => next(err));
}

/**
 * Only update the tracks of a guild queue (can't update guild-id).
 *
 * @param req Express request
 * @param res Express response
 * @param next Express next-function
 */
export function update(req: Request, res: Response, next: NextFunction) {
  if (req.queue && req.queue._id) {
    const queue = req.queue;
    const tracks = req.body['tracks'] as Track[];

    // Empty tracks array before adding tracks
    queue.tracks.splice(0, queue.tracks.length);
    queue.tracks.push(...tracks);

    return queue.save()
      .then(savedQueue => res.json(savedQueue.toJSON()))
      .catch(err => next(err));
  }

  return res.sendStatus(httpStatus.NOT_FOUND);
}
