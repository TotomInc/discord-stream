import { config } from '../config/env';
import { Track } from '../models/track.model';
import { Queue, QueueTrack } from '../models/api/queue.model';
import { HTTPService } from './http.service';
import { LoggerService } from './logger.service';

export class QueueService {
  private http: HTTPService;
  private logger: LoggerService;

  constructor() {
    this.http = new HTTPService();

    this.logger = new LoggerService();
  }

  /**
   * Create a new queue for a specific guild-id.
   *
   * @param queue queue data to post
   */
  public create(guildID: string, tracks: Track[]) {
    const queue: Queue = {
      guildID,
      tracks: tracks.map(track => this.transformTrack(track)),
    };

    return this.http.post('queues', queue)
      .then(response => response)
      .catch(err => this.logger.log.error(err, 'unable to create a new queue for a guild with id: %s', guildID));
  }

  /**
   * Get a queue of a specific Discord guild.
   *
   * @param guildID id of the Discord guild
   */
  public get(guildID: string) {
    return this.http.get<Queue>(`queues/${guildID}`)
      .then(response => response)
      .catch(err => this.logger.log.error(err, 'unable to retrieve the queue of the guild: %s', guildID));
  }

  /**
   * Get all queues of all existing guilds.
   */
  public getAll() {
    return this.http.get<{ count: number; queues: Queue[]; }>('queues?max=true');
  }

  /**
   * Update a queue of a specific guild. It is not possible to update the
   * guild ID.
   *
   * @param guildID id of the Discord guild
   * @param queue queue data object to update
   */
  public update(guildID: string, tracks: Track[]) {
    const queue: Queue = {
      guildID,
      tracks: tracks.map(track => this.transformTrack(track)),
    };

    return this.http.put<Queue>(`queues/${guildID}`, queue)
      .then(response => response)
      .catch(err => this.logger.log.error(err, 'unable to update the queue of the guild: %s', guildID));
  }

  /**
   * Delete a queue of a specific guild.
   *
   * @param guildID id of the Discord guild
   */
  public delete(guildID: string) {
    return this.http.delete<Queue>(`queues/${guildID}`)
      .then(response => response)
      .catch(err => this.logger.log.error(err, 'unable to delete the queue of the guild: %s', guildID));
  }

  /**
   * Transform a common track format used by the bot to a proper track format
   * for the API.
   *
   * @param track a track format from the bot
   */
  private transformTrack(track: Track): QueueTrack {
    const author = track.initiator.author;

    return {
      provider: track.provider,
      url: track.url,
      title: track.title,
      description: track.description,
      views: track.views,
      thumbnailURL: track.thumbnailURL,
      duration: track.duration,
      initiator: `${author.username}#${author.discriminator}`,
    };
  }
}
