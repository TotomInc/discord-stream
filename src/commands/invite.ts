import { Command } from '../models';
import * as utils from '../utils';

module.exports = {
  name: 'invite',
  description: 'get an invitation link to add me on other servers',
  execute: (message, args) => {
    const richEmbed = utils.generateRichEmbed('Useful links', message.client)
      .setDescription(`[Invite me](https://discordapp.com/oauth2/authorize?client_id=497409782072868864&permissions=0&scope=bot)
      [Source-code](https://github.com/TotomInc/discord-stream)`);

    message.channel.send(richEmbed);
  },
} as Command;
