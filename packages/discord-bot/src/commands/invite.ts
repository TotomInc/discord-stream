import { Command } from '../models';
import { config } from '../config/env';
import * as utils from '../utils';

const botUserID = config.bot.userID.toString();

module.exports = {
  name: 'invite',
  description: 'get an invitation link to add me on other servers',
  execute: (message, args) => {
    const richEmbed = utils.generateRichEmbed('Useful links', message.client)
      .setDescription(`
        [Invite me](https://discordapp.com/oauth2/authorize?client_id=${botUserID}&permissions=0&scope=bot)
        [Source-code](https://github.com/TotomInc/discord-stream)
      `);

    message.channel.send(richEmbed);
  },
} as Command;
