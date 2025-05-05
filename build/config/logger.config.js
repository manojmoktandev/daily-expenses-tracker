"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLogger = exports.stream = void 0;
const winston_1 = __importDefault(require("winston"));
const path_1 = __importDefault(require("path"));
const winston_daily_rotate_file_1 = __importDefault(require("winston-daily-rotate-file"));
const config_1 = require("./config");
const isProduction = config_1.config.env == 'development' ? false : true;
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
winston_1.default.addColors(colors);
// Define log format
const consoleFormat = winston_1.default.format.combine(winston_1.default.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }), winston_1.default.format.colorize({ all: true }), winston_1.default.format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`));
const fileFormat = winston_1.default.format.combine(winston_1.default.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }), winston_1.default.format.errors({ stack: true }), winston_1.default.format.splat(), winston_1.default.format.json());
// Create transports
const transports = [
    new winston_1.default.transports.Console({
        format: consoleFormat
    }),
    new winston_daily_rotate_file_1.default({
        filename: path_1.default.join('logs', 'application-%DATE%.log'),
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '14d',
        format: fileFormat,
        level: 'info'
    }),
    new winston_daily_rotate_file_1.default({
        filename: path_1.default.join('logs', 'error-%DATE%.log'),
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '30d',
        format: fileFormat,
        level: 'error'
    })
];
// Create logger instance
const logger = winston_1.default.createLogger({
    level: level(),
    levels,
    transports,
    exitOnError: false
});
// Stream for morgan (HTTP logging)
exports.stream = {
    write: (message) => {
        logger.http(message.trim());
    }
};
// Logger with context
const createLogger = (context) => {
    return {
        error: (message, meta) => logger.error(`[${context}] ${message}`, meta),
        warn: (message, meta) => logger.warn(`[${context}] ${message}`, meta),
        info: (message, meta) => logger.info(`[${context}] ${message}`, meta),
        http: (message, meta) => logger.http(`[${context}] ${message}`, meta),
        debug: (message, meta) => logger.debug(`[${context}] ${message}`, meta)
    };
};
exports.createLogger = createLogger;
// Default export
exports.default = logger;
