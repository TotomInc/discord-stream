import { Command } from '../models';

module.exports = {
  name: 'ping',
  description: 'check the bot response time to Discord',
  execute: async (message, args) => {
    const pingMessage = await message.channel.send('Ping...');

    if (!Array.isArray(pingMessage)) {
      const memberLatency = pingMessage.createdTimestamp - message.createdTimestamp;
      const clientLatency = message.client.ping;

      pingMessage.edit(`Pong! Latency of ${memberLatency}ms, API latency of ${clientLatency}ms.`);
    }
  },
} as Command;
