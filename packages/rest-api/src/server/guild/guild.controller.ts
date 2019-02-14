import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';

import { guildModel } from './guild.model';

/**
 * Call this function on `router.param`, so when we hit a specific query
 * param, it will *preload* the guild model instance and set it into the
 * Express `request` object. We can access this user-instance by doing
 * `req.user`.
 *
 * @param req Express request
 * @param res Express response
 * @param next Express next-function
 * @param id guild-id to look for
 */
export function load(req: Request, res: Response, next: NextFunction, id: string) {
  guildModel.getByGuildID(id)
    .then((guild) => {
      if (guild) {
        req.guild = guild;
      }

      next();
    })
    .catch(err => next(err));
}

/**
 * Create a new guild model with required params and save it to the db. Return
 * the newly created user.
 *
 * @param req Express request
 * @param res Express response
 * @param next Express next-function
 */
export function create(req: Request, res: Response, next: NextFunction) {
  const guild = new guildModel({
    guildID: req.body['guildID'] as string,
    name: req.body['name'] as string,
    iconURL: req.body['iconURL'] as string || '',
    ownerID: req.body['ownerID'] as string,
    region: req.body['region'] as string,
  });

  guild.save()
    .then(savedGuild => res.json(savedGuild.toJSON()))
    .catch(err => next(err));
}

/**
 * If the guild instance exists, return a JSON of this instance.
 *
 * @param req Express request
 * @param res Express response
 */
export function get(req: Request, res: Response) {
  if (req.guild && req.guild.toJSON) {
    return res.json(req.guild.toJSON());
  }

  return res.sendStatus(httpStatus.NOT_FOUND);
}

/**
 * Return a list of all guilds, in a JSON format.
 * TODO: paginate endpoint as it can impact performance
 *
 * @param req Express request
 * @param res Express response
 * @param next Express next-function
 */
export function getAll(req: Request, res: Response, next: NextFunction) {
  guildModel.find()
    .then((guilds) => {
      const guildsMap: any = {};

      guilds.forEach(guild => (guildsMap[guild.id] = guild.toJSON()));

      return res.json(guildsMap);
    })
    .catch(err => next(err));
}

/**
 * Update an already existing guild in the DB. Must pass the entire guild
 * object with required props to be validate.
 *
 * @param req Express request
 * @param res Express response
 * @param next Express next-function
 */
export function update(req: Request, res: Response, next: NextFunction) {
  if (req.guild && req.guild.toJSON) {
    const guild = req.guild;

    guild.guildID = req.body['guildID'] as string;
    guild.name = req.body['name'] as string;
    guild.iconURL = req.body['iconURL'] as string || '';
    guild.ownerID = req.body['ownerID'] as string;
    guild.region = req.body['region'] as string;

    return guild.save()
      .then(savedGuild => res.json(savedGuild.toJSON()))
      .catch(err => next(err));
  }

  return res.sendStatus(httpStatus.NOT_FOUND);
}

/**
 * Delete a guild from the db and return the content of the deleted guild (if
 * it exists).
 *
 * @param req Express request
 * @param res Express response
 * @param next Express next-function
 */
export function remove(req: Request, res: Response, next: NextFunction) {
  if (req.guild && req.guild.toJSON) {
    return req.guild.remove()
      .then(deletedGuild => res.json(deletedGuild.toJSON()))
      .catch(err => next(err));
  }

  return res.json(httpStatus.NOT_FOUND);
}

/**
 * Update the custom prefix of a guild (if it exists).
 *
 * @param req Express request
 * @param res Express response
 * @param next Express next-function
 */
export function updatePrefix(req: Request, res: Response, next: NextFunction) {
  if (req.guild && req.guild.toJSON) {
    const guild = req.guild;

    guild.customPrefix = req.body['customPrefix'] as string;

    return guild.save()
    .then(savedGuild => res.json(savedGuild.toJSON()))
    .catch(err => next(err));
  }

  return res.sendStatus(httpStatus.BAD_REQUEST);
}

/**
 * Remove the custom-prefix property from the guild instance.
 *
 * @param req Express request
 * @param res Express response
 * @param next Express next-function
 */
export function removePrefix(req: Request, res: Response, next: NextFunction) {
  if (req.guild && req.guild.toJSON) {
    const guild = req.guild;

    guild.customPrefix = undefined;

    return guild.save()
      .then(savedGuild => res.json(savedGuild.toJSON()))
      .catch(err => next(err));
  }

  return res.json(httpStatus.NOT_FOUND);
}
