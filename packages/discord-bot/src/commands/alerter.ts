import Discord from 'discord.js';

import { Command } from '../models';

const ownerID = process.env['OWNER_ID'];

module.exports = {
  name: 'alerter',
  description: 'creates an alert to be sent on all servers where the bot is',
  invisible: true,
  execute: (message, args) => {
    const client = message.client;
    const senderID = message.member.id;
    const messageToSend = args.join(' ');

    if (senderID === ownerID) {
      client.guilds.forEach((guild) => {
        const textChannel = guild.channels.find((channel) => channel.type === 'text') as Discord.TextChannel;

        if (textChannel && textChannel.send && typeof textChannel.send === 'function') {
          textChannel.send(messageToSend);
        }
      });
    }
  },
} as Command;
