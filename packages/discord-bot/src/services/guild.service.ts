import { Guild, GuildPrefix } from '../models/api/guild.model';
import { config } from '../config/env';
import { HTTPService } from './http.service';
import { LoggerService } from './logger.service';

export class GuildService {
  private loggerService: LoggerService;

  public http: HTTPService;

  constructor() {
    this.loggerService = new LoggerService();

    this.http = new HTTPService({
      baseURL: `${config.apiURI}/api`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env['AUTH_TOKEN']}`,
      },
    });
  }

  /**
   * Create a new guild by doing a POST request.
   *
   * @param guild guild data to post
   */
  public create(guild: Guild) {
    return this.http.post<Guild>('guilds', guild);
  }

  /**
   * Get a guild by doing a GET request.
   *
   * @param guildID Discord guild-id (not _id)
   */
  public get(guildID: string) {
    return this.http.get<Guild>(`guilds/${guildID}`);
  }

  /**
   * Get all guilds (not paginated).
   * // TODO: paginate endpoint (front and back)
   */
  public getAll() {
    return this.http.get<{ [guildID: string]: Guild }>('guilds');
  }

  /**
   * Get all guilds prefixes (not paginated).
   * // TODO: paginate endpoint (front and back)
   */
  public getAllPrefixes() {
    return this.http.get<GuildPrefix>('guilds/prefixes');
  }

  /**
   * Update the guild by doing a PUT request.
   *
   * @param guild guild data
   */
  public update(guild: Guild) {
    return this.http.put<Guild>(`guilds/${guild.guildID}`, guild);
  }

  /**
   * Update a specific guild prefix by doing a PUT request.
   *
   * @param guildID Discord guild-id (not _id)
   * @param data custom-prefix (not guild object)
   */
  public updatePrefix(guildID: string, data: { customPrefix: string }) {
    return this.http.put<Guild>(`guilds/${guildID}/prefix`, data)
      .then(response => response)
      .catch(err => this.loggerService.log.error(err, 'unable to update prefix: %s for guild id: %s', data, guildID));
  }

  /**
   * Delete a guild by doing a DELETE request.
   *
   * @param guildID Discord guild-id (not _id)
   */
  public delete(guildID: string) {
    return this.http.delete<Guild>(`guilds/${guildID}`);
  }

  /**
   * Delete a guild prefix by doing a DELETE request.
   *
   * @param guildID Discord guild-id (not _id)
   */
  public deletePrefix(guildID: string) {
    return this.http.delete<Guild>(`guilds/${guildID}/prefix`);
  }
}
