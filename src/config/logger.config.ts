import winston from 'winston';
import path from 'path';
import DailyRotateFile from 'winston-daily-rotate-file';
import { config } from './config';

const isProduction =  config.env=='development' ? false : true

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4
};

// Determine log level based on environment
const level = () => {
  return isProduction ? 'info' : 'debug';
};

// Define log colors
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white'
};

winston.addColors(colors);

// Define log format
const consoleFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`
  )
);

const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

// Create transports
const transports = [
  new winston.transports.Console({
    format: consoleFormat
  }),
  new DailyRotateFile({
    filename: path.join('logs', 'application-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
    format: fileFormat,
    level: 'info'
  }),
  new DailyRotateFile({
    filename: path.join('logs', 'error-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '30d',
    format: fileFormat,
    level: 'error'
  })
];

// Create logger instance
const logger = winston.createLogger({
  level: level(),
  levels,
  transports,
  exitOnError: false
});

// Stream for morgan (HTTP logging)
export const stream = {
  write: (message: string) => {
    logger.http(message.trim());
  }
};

// Logger with context
export const createLogger = (context: string) => {
  return {
    error: (message: string, meta?: any) => logger.error(`[${context}] ${message}`, meta),
    warn: (message: string, meta?: any) => logger.warn(`[${context}] ${message}`, meta),
    info: (message: string, meta?: any) => logger.info(`[${context}] ${message}`, meta),
    http: (message: string, meta?: any) => logger.http(`[${context}] ${message}`, meta),
    debug: (message: string, meta?: any) => logger.debug(`[${context}] ${message}`, meta)
  };
};

// Default export
export default logger;