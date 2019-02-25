import { Command } from '../models';
import { config } from '../config/env';

const botUserID = config.bot.userID.toString();

module.exports = {
  name: 'clean',
  description: 'remove the most recent messages sent by the bot in the channel where you send the command',
  execute: (message, args) => {
    const channel = message.channel;

    channel.fetchMessages()
      .then((messages) => {
        const botMessages = messages.filter(m => m.member.id === botUserID && m.deletable);
        const deletePromises = botMessages.map(botMessage => botMessage.delete());

        return Promise.all(deletePromises);
      })
      .catch(() => {
        return message.channel.send('Something went wrong while trying to delete the bot messages.');
      });
  },
} as Command;
