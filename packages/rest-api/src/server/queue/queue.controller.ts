import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';

import { Track } from '../../models/Track';
import { guildModel } from '../guild/guild.model';
import { queueModel } from './queue.model';

/**
 * Call this function on `router.param`, so when we hit a specific query
 * param, it will *preload* the queue and set it into the Express `request`
 * object. We can access the queue object by doing `req.queue`.
 *
 * @param req Express request
 * @param res Express response
 * @param next Express next-function
 * @param id favorite-id
 */
export function load(req: Request, res: Response, next: NextFunction, id: string) {
  queueModel.getByGuildID(id)
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
 * Get all queues of all guilds (1 guild = 1 queue).
 * TODO: paginate this endpoint.
 *
 * @param req Express request
 * @param res Express response
 */
export function getAll(req: Request, res: Response, next: NextFunction) {
  queueModel.find()
    .then((queues) => {
      const queuesMap: any = {};

      queues.forEach(queue => (queuesMap[queue.guildID] = queue.toJSON()));

      return res.json(queuesMap);
    })
    .catch(err => next(err));
}

/**
 * Create a new queue based on the guild-id and an optional array of tracks.
 * Add the queue reference (objectID) to the guild `queue` property.
 *
 * @param req Express request
 * @param res Express response
 * @param next Express next-function
 */
export async function create(req: Request, res: Response, next: NextFunction) {
  const guildID = req.body['guildID'] as string;
  const guild = await guildModel.getByGuildID(guildID);

  if (!guild || !guild._id) {
    return next(new Error('Unable to find a guild, can\'t create a new queue for a non-existing guild'));
  }

  const queue = new queueModel({
    guildID: req.body['guildID'] as string,
    tracks: req.body['tracks'] as Track[] || [],
  });

  // Set the reference of the guild queue model to the queue model (objectID)
  guild.queue = queue._id;

  guild.save()
    .then(savedGuild => queue.save())
    .then(savedQueue => res.json(savedQueue.toJSON()))
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

    queue.tracks = req.body['tracks'] as Track[];

    return queue.save()
      .then(savedQueue => res.json(savedQueue.toJSON()))
      .catch(err => next(err));
  }

  return res.sendStatus(httpStatus.NOT_FOUND);
}

/**
 * Delete the entire queue object of a guild. Remove the queue reference from
 * the guild `queue` property.
 *
 * @param req Express request
 * @param res Express response
 * @param next Express next-function
 */
export async function remove(req: Request, res: Response, next: NextFunction) {
  if (req.queue && req.queue._id) {
    const guildID = req.body['guildID'] as string;
    const queue = req.queue;
    const guild = await guildModel.getByGuildID(guildID);

    if (!guild || !guild._id) {
      return next(new Error('Unable to find a guild, can\'t delete a queue of a non-existing guild'));
    }

    // Remove the reference of the guild queue model to the queue model
    guild.queue = undefined;

    return guild.save()
      .then(savedGuild => queue.remove())
      .then(deletedQueue => res.json(deletedQueue.toJSON()))
      .catch(err => next(err));
  }

  return res.sendStatus(httpStatus.NOT_FOUND);
}
