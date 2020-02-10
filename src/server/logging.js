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

export const requestLogger = expressWinston.logger({
    transports: [new transports.Console()],
    msg: (req, res) =>
        `HTTP ${req.ip} ${JSON.stringify(req.ips)} ${req?.user?.profile?.id ||
            "logged-out-user"} ${req.method} ${req.url} ${res.statusCode} ${
            res.responseTime
        }ms`,
    format: combine(label({ label: logLabel }), timestamp(), logFormat),
});

export const errorLogger = expressWinston.errorLogger({
    transports: [new transports.Console()],
    msg: (req, res, err) =>
        `HTTP Error ${req.ip} ${JSON.stringify(req.ips)} ${req?.user?.profile
            ?.id || "logged-out-user"} ${req.method} ${req.url} ${
            err.message
        } ${res.statusCode} ${res.responseTime}ms`,
    format: combine(label({ label: logLabel }), timestamp(), logFormat),
});

export default logger;
