import { QueueAPI, GuildAPI, PaginationAPI } from '@discord-stream/models';
import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';

import { createFakeGuilds } from './guild.faker';
import { GuildModel } from './guild.model';
import { QueueModel } from '../queue/queue.model';

/**
 * Preload the guild into the `Request` when we hit a `guildID` param.
 *
 * Make sure to populate the `Queue` ref.
 *
 * @param req Express request
 * @param res Express response
 * @param next Express next-function
 * @param id guild-id to look for
 */
export function load(req: Request, res: Response, next: NextFunction, guildID: string) {
  GuildModel.findOne({ guildID })
    .then((guild) => {
      if (guild) {
        guild
          .populate('queue')
          .execPopulate()
          .then((populatedGuild) => {
            req.guild = populatedGuild;

            next();
          })
          .catch(err => next(err));
      } else {
        next();
      }
    })
    .catch(err => next(err));
}

/**
 * Create a new guild document, create an empty queue ref for the new guild.
 *
 * @param req Express request
 * @param res Express response
 * @param next Express next-function
 */
export function create(req: Request, res: Response, next: NextFunction) {
  const guildID = req.body['guildID'] as string;

  const newQueue: QueueAPI.ICreateQueue = {
    guildID,
  };

  new QueueModel(newQueue)
    .save()
    .then((savedQueue) => {
      const newGuild: GuildAPI.ICreateGuild = {
        guildID,
        name: req.body['name'],
        iconURL: req.body['iconURL'],
        ownerID: req.body['ownerID'],
        region: req.body['region'],
        prefix: req.body['prefix'] || '=note',
        queue: savedQueue._id,
      };

      return new GuildModel(newGuild).save();
    })
    .then(savedGuild => res.json(savedGuild.toJSON()))
    .catch(err => next(err));
}

/**
 * Create a lot of fake new guilds (with new queue refs) using `faker`.
 *
 * @param req Express request
 * @param res Express response
 * @param next Express next-function
 */
export function createFake(req: Request, res: Response, next: NextFunction) {
  const fakeGuilds = createFakeGuilds(100);

  // Generate fake queues based on fake guilds generated
  fakeGuilds.map((fakeGuild) => {
    const fakeQueue: QueueAPI.ICreateQueue = {
      guildID: fakeGuild.guildID,
    };

    return {
      fakeGuild: new GuildModel(fakeGuild),
      fakeQueue: new QueueModel(fakeQueue),
    };
  })
  // Save the fake queue and retrieve its ref id for the fake guild
    .forEach(({ fakeGuild, fakeQueue }) => {
      fakeQueue.save()
        .then((savedQueue) => {
          fakeGuild.queue = savedQueue._id;

          fakeGuild.save();
        });
    });

  return res.json(fakeGuilds);
}

/**
 * Get the loaded guild by its guild-id.
 *
 * @param req Express request
 * @param res Express response
 */
export function get(req: Request, res: Response) {
  if (req.guild && req.guild._id) {
    return res.json(req.guild.toJSON());
  }

  return res.sendStatus(httpStatus.NOT_FOUND);
}

/**
 * Get all guilds, accept a pagination body (see `IPaginationGuild`) and
 * populate the `Queue` ref.
 *
 * @param req Express request
 * @param res Express response
 * @param next Express next-function
 */
export async function getAll(req: Request, res: Response, next: NextFunction) {
  const pagination: PaginationAPI.IPagination = {
    limit: parseInt(req.query['limit'], 10),
    skip: parseInt(req.query['skip'], 10),
    max: req.query['max'] === 'true',
  };

  if (pagination.max) {
    pagination.limit = await GuildModel.estimatedDocumentCount();
    pagination.skip = 0;
  }

  return GuildModel.find({})
    .limit(pagination.limit || 100)
    .skip(pagination.skip || 0)
    .populate('queue')
    .then(guilds => res.json(guilds.map(guild => guild.toJSON())))
    .catch(err => next(err));
}

/**
 * Return an object of key (guild-id) / value (custom prefix) of all guilds
 * which have a custom prefixes. Query with projection, make sure to retrieve
 * only necessary values.
 *
 * @param req Express request
 * @param res Express response
 * @param next Express next-function
 */
export async function getAllPrefixes(req: Request, res: Response, next: NextFunction) {
  const pagination: PaginationAPI.IPagination = {
    limit: parseInt(req.query['limit'], 10),
    skip: parseInt(req.query['skip'], 10),
    max: req.query['max'] === 'true',
  };

  if (pagination.max) {
    pagination.limit = await GuildModel.estimatedDocumentCount();
    pagination.skip = 0;
  }

  return GuildModel.find({}, {
    guildID: 1,
    prefix: 1,
  })
    .limit(pagination.limit || 100)
    .skip(pagination.skip || 0)
    .then(guilds => res.json(guilds.map(guild => guild.toJSON())))
    .catch(err => next(err));
}

/**
 * Update an existing guild, must not be able to change its guild-id and the
 * queue ref.
 *
 * @param req Express request
 * @param res Express response
 * @param next Express next-function
 */
export function update(req: Request, res: Response, next: NextFunction) {
  if (req.guild && req.guild._id) {
    const guild = req.guild;

    const updatedGuild: GuildAPI.IUpdateGuild = {
      guildID: req.body['guildID'],
      name: req.body['name'],
      iconURL: req.body['iconURL'],
      ownerID: req.body['ownerID'],
      region: req.body['region'],
      prefix: req.body['prefix'],
      queue: req.body['queue'],
    };

    guild.name = updatedGuild.name;
    guild.ownerID = updatedGuild.ownerID;
    guild.region = updatedGuild.region;

    if (updatedGuild.iconURL) {
      guild.iconURL = updatedGuild.iconURL;
    }

    if (updatedGuild.prefix) {
      guild.prefix = updatedGuild.prefix;
    }

    return guild.save()
      .then(savedGuild => res.json(savedGuild.toJSON()))
      .catch(err => next(err));
  }

  return res.sendStatus(httpStatus.NOT_FOUND);
}

/**
 * Update the custom prefix of a guild.
 *
 * @param req Express request
 * @param res Express response
 * @param next Express next-function
 */
export function updatePrefix(req: Request, res: Response, next: NextFunction) {
  if (req.guild && req.guild._id) {
    const guild = req.guild;

    const updatedGuild: GuildAPI.IUpdateGuildPrefix = {
      prefix: req.body['prefix'],
    };

    guild.prefix = updatedGuild.prefix;

    return guild.save()
      .then(savedGuild => res.json(savedGuild.toJSON()))
      .catch(err => next(err));
  }

  return res.sendStatus(httpStatus.NOT_FOUND);
}

/**
 * Delete a guild and its associated queue.
 *
 * @param req Express request
 * @param res Express response
 * @param next Express next-function
 */
export function remove(req: Request, res: Response, next: NextFunction) {
  if (req.guild && req.guild._id) {
    return QueueModel.findOne({
      guildID: req.guild.guildID,
    })
      .then((queue) => {
        if (queue && queue._id) {
          return queue.remove()
            .then(() => req.guild!.remove())
            .then(deletedGuild => res.json(deletedGuild.toJSON()))
            .catch(err => next(err));
        }

        return next(new Error(`Unable to find a queue reference for the guild ${req.guild!.guildID}`));
      });
  }

  return res.json(httpStatus.NOT_FOUND);
}

/**
 * Remove the custom prefix of a guild (set it back to the default value).
 *
 * @param req Express request
 * @param res Express response
 * @param next Express next-function
 */
export function removePrefix(req: Request, res: Response, next: NextFunction) {
  if (req.guild && req.guild._id) {
    const guild = req.guild;

    guild.prefix = '=note';

    return guild.save()
      .then(savedGuild => res.json(savedGuild.toJSON()))
      .catch(err => next(err));
  }

  return res.json(httpStatus.NOT_FOUND);
}
