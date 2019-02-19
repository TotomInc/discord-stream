import { Client, RichEmbed } from 'discord.js';

/**
 * Generate a rich-embed, used to keep the same rich-embed style across all
 * the various commands.
 *
 * @param title name of the rich-embed
 * @param client Discord client
 */
export function generateRichEmbed(title: string, client: Client) {
  const avatarURL = client.user.avatarURL;
  const richEmbed = new RichEmbed()
    .setColor('#468fff')
    .setTitle(title)
    .setFooter('Got a bug? Contact TotomInc#0001')
    .setTimestamp();

  richEmbed.author = {
    name: client.user.username,
    icon_url: avatarURL,
  };

  return richEmbed;
}
