const winston = require("winston");

const { combine, timestamp, printf } = winston.format;

const logFormat = printf(({ level, message, timestamp }) => {
    return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
});

const createLogger = (filename) => {
    return winston.createLogger({
        level: "info",
        format: combine(
            timestamp({
                format: "YYYY-MM-DD HH:mm:ss"
            }),
            logFormat
        ),
        transports: [
            new winston.transports.File({
                filename: `logs/${filename}`
            })
        ]
    });
};

module.exports = {
    appLogger: createLogger("app.log"),
    errorLogger: createLogger("error.log"),
    authLogger: createLogger("auth.log"),
    accessLogger: createLogger("access.log")
};