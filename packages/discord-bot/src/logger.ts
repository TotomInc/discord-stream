import path from 'path';
import fs from 'fs';
import Winston from 'winston';

const isProduction = process.env['NODE_ENV'] === 'production';
const logDir = path.join(__dirname, '../logs');

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const logger = Winston.createLogger({
  transports: [
    new Winston.transports.File({
      filename: path.join(__dirname, '../logs/combined.log'),
      format: Winston.format.combine(
        Winston.format.timestamp(),
        Winston.format.printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`),
      ),
    }),

    new Winston.transports.File({
      level: 'error',
      filename: path.join(__dirname, '../logs/errors.log'),
      format: Winston.format.combine(
        Winston.format.timestamp(),
        Winston.format.printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`),
      ),
    }),
  ],
});

if (!isProduction) {
  logger.add(new Winston.transports.Console({
    format: Winston.format.combine(
      Winston.format.colorize(),
      Winston.format.simple(),
    ),
  }));
}

export default logger;
