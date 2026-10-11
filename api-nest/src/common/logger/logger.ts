import fs from "fs";
import path from "path";
import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

const logsDir = path.join(process.cwd(), "logs");
const appLogsDir = path.join(logsDir, "app_logs");
const errorLogsDir = path.join(logsDir, "error_logs");

for (const dir of [logsDir, appLogsDir, errorLogsDir]) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

const isDevelopment = process.env.NODE_ENV !== "production";
const logLevel = process.env.LOG_LEVEL ?? (isDevelopment ? "debug" : "info");

const consoleFormat = isDevelopment
    ? winston.format.combine(
          winston.format.colorize(),
          winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
          winston.format.printf(({ timestamp, level, message, ...meta }) => {
              const metaString =
                  Object.keys(meta).length > 0 ? ` ${JSON.stringify(meta)}` : "";
              return `[${timestamp}] ${level}: ${message}${metaString}`;
          })
      )
    : winston.format.combine(winston.format.timestamp(), winston.format.json());

const fileFormat = winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
);

const logger = winston.createLogger({
    level: logLevel,
    format: fileFormat,
    transports: [
        new winston.transports.Console({ format: consoleFormat }),
        new DailyRotateFile({
            dirname: appLogsDir,
            filename: "%DATE%.log",
            datePattern: "YYYY-MM-DD",
            maxFiles: "30d",
        }),
        new DailyRotateFile({
            dirname: errorLogsDir,
            filename: "%DATE%.log",
            datePattern: "YYYY-MM-DD",
            level: "error",
            maxFiles: "30d",
        }),
    ],
});

export default logger;
