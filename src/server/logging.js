import { getUserID } from "./auth";
import { createLogger, format, transports } from "winston";
import expressWinston from "express-winston";
import { logLevel, logLabel } from "./configuration";

const { combine, timestamp, label, printf } = format;

const logFormat = printf(
    ({ level, message, label, timestamp }) =>
        `${timestamp} [${label}] ${level}: ${message}`
);

const logger = createLogger({
    level: logLevel,
    format: combine(label({ label: logLabel }), timestamp(), logFormat),
    transports: [new transports.Console()],
});

const getLoggableUserID = (req) => getUserID(req) || "logged-out-user";

export const requestLogger = expressWinston.logger({
    transports: [new transports.Console()],
    msg: (req, res) =>
        `HTTP ${req.ip} ${JSON.stringify(req.ips)} ${getLoggableUserID(req)}
            ${req.method} ${req.url} ${res.statusCode} ${res.responseTime}ms`,
    format: combine(label({ label: logLabel }), timestamp(), logFormat),
});

export const errorLogger = expressWinston.errorLogger({
    transports: [new transports.Console()],
    msg: (req, res, err) =>
        `HTTP Error ${req.ip} ${JSON.stringify(req.ips)} ${getLoggableUserID(
            req
        )} ${req.method} ${req.url} ${err.message} ${res.statusCode} ${
            res.responseTime
        }ms`,
    format: combine(label({ label: logLabel }), timestamp(), logFormat),
});

export default logger;
