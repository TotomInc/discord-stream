import Discord from 'discord.js';

import * as models from '../models';

/** Guild queues are stored and can be retrieved with a `guildID` */
const queues: Discord.Collection<string, models.Track[]> = new Discord.Collection();

/**
 * Add the content of the `tracks` into the `guildQueue`. If the queue doesn't
 * exists for this guild, we create it. Returns the queue.
 *
 * @param tracks an array of `Track`
 * @param message the discord message that initiated this
 */
export function addTracks(tracks: models.Track[], message: Discord.Message): models.Track[] {
  const guildID = message.guild.id;
  const queue = queues.get(guildID);

  if (!queue) {
    queues.set(guildID, [...tracks]);
  } else {
    const newQueue = [...queue, ...tracks];

    queues.set(guildID, newQueue);
  }

  return queues.get(guildID) || [];
}

/**
 * Remove the first track from the `guildQueue`.
 * Returns the `guildQueue`.
 *
 * @param message the discord message that initiated this
 */
export function removeFirstTrack(message: Discord.Message): models.Track[] {
  const guildID = message.guild.id;
  const queue = queues.get(guildID);

  if (queue) {
    queue.shift();

    (queue.length === 0)
      ? queues.delete(guildID)
      : queues.set(guildID, queue);
  }

  return queues.get(guildID) || [];
}

/**
 * Similar to `Array#splice`, specify a range of tracks to remove from the
 * queue. Returns the new state of the `guildQueue`.
 *
 * @param startIndex the index to start for `Array#splice`
 * @param deleteCount the number of tracks to remove
 * @param message the Discord message that initiated this
 */
export function removeTracks(
  startIndex: number,
  deleteCount: number,
  message: Discord.Message,
): models.Track[] {
  const guildID = message.guild.id;
  const queue = queues.get(guildID);

  if (queue) {
    queue.splice(startIndex, deleteCount);
    queues.set(guildID, queue);
  }

  return queues.get(guildID) || [];
}

/**
 * Delete a `guildQueue` if it exists for the current `guildID`.
 *
 * @param message the discord message that initiated this
 */
export function removeQueue(message: Discord.Message): void {
  const guildID = message.guild.id;
  const queueExists = queues.has(guildID);

  if (queueExists) {
    queues.delete(guildID);
  }
}

/**
 * Returns the current queue for the guild where the message have been sent.
 * If queue not found, returns an empty array.
 *
 * @param message the discord message that initiated this
 */
export function getQueue(message: Discord.Message): models.Track[] {
  const guildID = message.guild.id;

  return queues.get(guildID) || [];
}

/**
 * Replace an already existing queue and returns it.
 *
 * @param message the discord message that initiated this
 * @param newQueue the new queue to replace
 */
export function replaceQueue(newQueue: models.Track[], message: Discord.Message): models.Track[] {
  const guildID = message.guild.id;
  const queueExists = queues.has(guildID);

  if (queueExists) {
    queues.set(guildID, newQueue);
  }

  return queues.get(guildID) || [];
}

/**
 * Returns the current track that the bot is playing for the guild where the
 * message have been sent.
 *
 * @param message the discord message that initiated this
 */
export function getCurrentTrack(message: Discord.Message): models.Track | null {
  const guildID = message.guild.id;
  const queue = queues.get(guildID);

  return (queue) ? queue[0] : null;
}
