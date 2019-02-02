import * as Discord from 'discord.js';

// ID of the official Note Discord server
const EMOJI_GUILD_ID = '540628096701825046';

export const customEmojis: Discord.Collection<string, Discord.Emoji> = new Discord.Collection();

/**
 * Load custom emojis from the official Note server into a collection.
 *
 * @param client the discord client, must be logged in
 */
export function loadEmojis(client: Discord.Client) {
  const guild = client.guilds.get(EMOJI_GUILD_ID);

  if (!guild) {
    return customEmojis;
  }

  guild.emojis.forEach((emoji) => customEmojis.set(emoji.id, emoji));

  return customEmojis;
}
