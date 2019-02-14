import { Collection, Message } from 'discord.js';

import { config } from '../config/env';
import { Guild } from '../models/api/guild.model';
import { GuildService } from './guild.service';

export class PrefixService {
  public prefixes: Collection<string, string>;

  private guildService: GuildService;
  private unauthorizedPrefixes = [config.bot.prefix, '$note'];
  private unauthorizedCharacters = ['%'];

  constructor() {
    this.prefixes = new Collection();

    this.guildService = new GuildService();
  }

  /**
   * Fetch all guilds prefixes and automatically inject them into a
   * `Discord.Collection`. If success, return this collection. This is used to
   * initialize the prefixes when the bot is starting. Returns the collection.
   */
  public load(): Promise<Collection<string, string>> {
    return new Promise((resolve, reject) => {
      this.guildService.getAllPrefixes()
        .then(response => response.data)
        .then((prefixes) => {
          for (const [guildID, prefix] of Object.entries(prefixes)) {
            this.prefixes.set(guildID, decodeURIComponent(prefix));
          }

          resolve(this.prefixes);
        })
        .catch(err => reject(err));
    });
  }

  /**
   * Update or create the custom-prefix for the guild retrieved from the
   * message, call the API and then update the `prefix` collection to update
   * in realtime. Returns the updated `Guild`.
   *
   * @param message Discord message
   * @param prefix new prefix for the guild
   */
  public set(message: Message, prefix: string): Promise<Guild> {
    const data = {
      customPrefix: encodeURIComponent(prefix),
    };

    return new Promise((resolve, reject) => {
      this.guildService.updatePrefix(message.guild.id, data)
        .then(response => response.data)
        .then((guild) => {
          this.prefixes.set(message.guild.id, prefix);
          resolve(guild);
        })
        .catch(err => reject(err));
    });
  }

  /**
   * Delete a custom-prefix for the guild retrieved from the message parameter,
   * call the API and then update the `prefix` collection to update in
   * realtime. Returns the updated `Guild`.
   *
   * @param message Discord message
   */
  public delete(message: Message) {
    return new Promise((resolve, reject) => {
      this.guildService.deletePrefix(message.guild.id)
        .then(response => response.data)
        .then((guild) => {
          this.prefixes.delete(message.guild.id);

          return guild;
        })
        .catch(err => reject(err));
    });
  }

  /**
   * Verify if the guild from the message have setup a custom-prefix.
   *
   * @param message Discord message
   */
  public has(message: Message) {
    return this.prefixes.has(message.guild.id);
  }

  /**
   * Return the guild custom-prefix from the message.
   *
   * @param message Discord message
   */
  public get(message: Message) {
    return this.prefixes.get(message.guild.id);
  }

  /**
   * Check if the prefix is valid.
   *
   * @param prefix new prefix for the guild
   */
  public check(prefix: string) {
    const unauthorizedPrefix = this.unauthorizedPrefixes.find(unauth => unauth.includes(prefix));
    const unauthorizedCharacter = this.unauthorizedCharacters.find(unauth => prefix.includes(unauth));

    return { unauthorizedPrefix, unauthorizedCharacter };
  }
}

export default new PrefixService();
