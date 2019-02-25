import path from 'path';
import bunyan from 'bunyan';

export class LoggerService {
  public log: bunyan;

  constructor(name = 'discord-bot') {
    this.log = bunyan.createLogger({
      name,
      streams: [{
        level: 'info',
        stream: process.stdout,
      }, {
        level: 'error',
        path: path.join(__dirname, '../../../../logs/discord-bot.log'),
      }],
    });
  }
}
