import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';

import { GuildModel } from './guild.model';
import { createFakeGuilds } from './guild.faker';
import { QueueModel } from '../queue/queue.model';
import { ICreatedGuild, IPaginationGuild, IUpdatedGuild } from '../../models/Guild';
import { ICreatedQueue } from '../../models/Queue';

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
  const newGuild: ICreatedGuild = {
    guildID: req.body['guildID'],
    name: req.body['name'],
    iconURL: req.body['iconURL'],
    ownerID: req.body['ownerID'],
    region: req.body['region'],
    prefix: req.body['prefix'] || '=note',
  };

  const newQueue: ICreatedQueue = {
    guildID: newGuild.guildID,
    tracks: [],
  };

  new QueueModel(newQueue)
    .save()
    .then((savedQueue) => {
      newGuild.queue = savedQueue._id;

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
    const fakeQueue: ICreatedQueue = {
      guildID: fakeGuild.guildID,
      tracks: [],
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
 * Limit to 100 guilds max, skip 0 guilds by default.
 *
 * @param req Express request
 * @param res Express response
 * @param next Express next-function
 */
export function getAll(req: Request, res: Response, next: NextFunction) {
  const pagination: IPaginationGuild = {
    limit: parseInt(req.body['limit'], 10) || 100,
    skip: parseInt(req.body['skip'], 10) || 0,
  };

  // Make sure to have a maximum limit of 100 guilds requested at once
  pagination.limit = pagination.limit > 100 ? 100 : pagination.limit;

  return GuildModel.find({})
    .limit(pagination.limit)
    .skip(pagination.skip)
    .then(async (guilds) => {
      const populatedGuilds = [];

      for (const guild of guilds) {
        const populatedGuild = await guild.populate('queue').execPopulate();

        populatedGuilds.push(populatedGuild.toJSON());
      }

      return res.json(populatedGuilds);
    })
    .catch(err => next(err));
}

/**
 * Return an object of key (guild-id) / value (custom prefix) of all guilds
 * which have a custom prefixes. Query with projection, make sure to retrieve
 * only necessary values.
 *
 * This endpoint is required for the initialization of the bot and must **NOT**
 * be paginated.
 *
 * @param req Express request
 * @param res Express response
 * @param next Express next-function
 */
export function getAllPrefixes(req: Request, res: Response, next: NextFunction) {
  GuildModel.find({}, {
    guildID: 1,
    prefix: 1,
  })
    .then(guilds => guilds.map(guild => guild.toJSON()))
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
    const updatedGuild: IUpdatedGuild = req.body;

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
    const newPrefix: string = req.body['prefix'];

    guild.prefix = newPrefix;

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
