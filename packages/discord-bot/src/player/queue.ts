import Discord from 'discord.js';
import to from 'await-to-js';

import * as models from '../models';
import { generateRichEmbed } from '../utils/rich-embed';
import { secondsToHHMMSS } from '../utils/time';
import { QueueService } from '../services/queue.service';

const queueService = new QueueService();

/** Guild queues are stored and can be retrieved with a `guildID` */
const queues: Discord.Collection<string, models.Track[]> = new Discord.Collection();

/**
 * Fetch all guild queues on the initialization. We **cannot** import queues
 * with existing tracks on the bot init, instead we pass an empty array.
 */
export async function load() {
  return new Promise<Discord.Collection<string, models.Track[]>>(async (res, rej) => {
    const [queuesErr, allQueues] = await to(queueService.getAll());

    if (queuesErr || !allQueues) {
      rej(queuesErr || 'unable to load all queues');
    } else {
      allQueues.forEach((queue) => {
        queues.set(queue.guildID, []);
      });

      res(queues);
    }
  });
}

/**
 * Add the content of the `tracks` into the `guildQueue`. If the queue doesn't
 * exists for this guild, we create it. Automatically send a rich-embed message
 * notification, then returns the queue.
 *
 * @param tracks an array of `Track`
 * @param message the discord message that initiated this
 */
export function addTracks(tracks: models.Track[], message: Discord.Message): models.Track[] {
  const guildID = message.guild.id;
  const queue = queues.get(guildID);

  if (!queue) {
    queues.set(guildID, [...tracks]);
    queueService.create(guildID, tracks);
  } else {
    const newQueue = [...queue, ...tracks];

    queues.set(guildID, newQueue);
    queueService.update(guildID, newQueue);
  }

  if (tracks.length > 0) {
    const richEmbedTitle = (tracks.length > 1) ? `Queued ${tracks.length} tracks` : 'Queued a track';
    const richEmbed = generateRichEmbed(richEmbedTitle, message.client);
    const firstTracks = (tracks.length > 10) ? tracks.slice(0, 10) : [...tracks];

    firstTracks.forEach((track) => {
      const fieldName = `${track.title}`;
      const fieldValue = `${secondsToHHMMSS(track.duration)} - queued by ${message.author.username}`;

      richEmbed.addField(fieldName, fieldValue);
    });

    if (tracks.length === 1) {
      richEmbed.setThumbnail(tracks[0].thumbnailURL);
    } else if (tracks.length > 10) {
      richEmbed.addField('And many more...', 'More tracks have been added and not displayed, use the \`queue\` command to see them.');
    }

    message.channel.send(richEmbed);
  }

  return queues.get(guildID) || [];
}

/**
 * Remove the first track from the `guildQueue`. Make sure to also update the
 * queue status on the API. Returns the edited `guildQueue` or an empty array.
 *
 * @param message the discord message that initiated this
 */
export function removeFirstTrack(message: Discord.Message): models.Track[] {
  const guildID = message.guild.id;
  const queue = queues.get(guildID);

  if (queue) {
    queue.shift();

    if (queue.length === 0) {
      queues.delete(guildID);
      queueService.delete(guildID);
    } else {
      queues.set(guildID, queue);
      queueService.update(guildID, queue);
    }
  }

  return queues.get(guildID) || [];
}

/**
 * Similar to `Array#splice`, specify a range of tracks to remove from the
 * queue. Make sure to also update the queue status on the API. Returns the
 * edited `guildQueue`.
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
    queueService.update(guildID, queue);
  }

  return queues.get(guildID) || [];
}

/**
 * Delete a `guildQueue` locally and on the API (if it exists for the current
 * `guildID`).
 *
 * @param message the discord message that initiated this
 */
export function removeQueue(message: Discord.Message): void {
  const guildID = message.guild.id;
  const queueExists = queues.has(guildID);

  if (queueExists) {
    queues.delete(guildID);
    queueService.delete(guildID);
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
 * Replace an already existing queue (locally and on the API), then returns it.
 *
 * @param message the discord message that initiated this
 * @param newQueue the new queue to replace
 */
export function replaceQueue(newQueue: models.Track[], message: Discord.Message): models.Track[] {
  const guildID = message.guild.id;
  const queueExists = queues.has(guildID);

  if (queueExists) {
    queues.set(guildID, newQueue);
    queueService.update(guildID, newQueue);
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
