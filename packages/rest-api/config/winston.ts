import fs from 'fs';
import path from 'path';
import winston from 'winston';

const logDir = path.join(__dirname, '../../../logs');
const logPath = path.join(logDir, 'rest-api.log');

// Ensure the logs folder exists at the project root
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// Universal Winston format to use on different transports
const format = winston.format.combine(
  winston.format.timestamp(),
  winston.format.printf(info => `[${info.timestamp}] ${info.level}: ${info.message}`),
  winston.format.colorize(),
);

export const logger = winston.createLogger({
  format,

  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: logPath,
    }),
  ],
});
