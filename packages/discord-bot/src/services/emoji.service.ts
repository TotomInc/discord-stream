import { Client, Collection, Emoji } from 'discord.js';

/**
 * Handle custom emojis from Discord guilds. Store them into a collection.
 */
export class EmojiService {
  private client: Client;

  public emojis: Collection<string, Emoji> = new Collection();

  constructor(client: Client) {
    this.client = client;
  }

  /**
   * Load emojis from a specific guild into the emojis collection.
   *
   * @param guildID ID of the guild to fetch emojis from
   */
  public load(guildID = '540628096701825046') {
    const guild = this.client.guilds.get(guildID);

    if (guild) {
      guild.emojis.forEach(emoji => this.emojis.set(emoji.id, emoji));
    }
  }

  /**
   * Retrieve an emoji from the collection based on its ID.
   */
  public get(emojiID: string) {
    return this.emojis.get(emojiID);
  }
}
