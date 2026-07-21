const { authLogger, appLogger, errorLogger } = require("../config/logger");

const loggers = {
    auth: authLogger,
    app: appLogger,
    error: errorLogger
};

const validLevels = ["info", "warn", "error"];

const logEvent = ({
    type = "app",
    level = "info",
    event,
    user = null,
    req = null,
    details = {}
}) => {
    const logger = loggers[type] || appLogger;

    if (!loggers[type]) {
        console.warn(`Unknown logger type "${type}". Using app logger.`);
    }

    const logLevel = validLevels.includes(level)
        ? level
        : "info";

    const detailEntries = Object.entries(details).map(
        ([key, value]) => `${key}: ${value}`
    );

    const message = [
        event,
        user ? `ID: ${user._id}` : null,
        user ? `Email: ${user.email}` : null,
        req ? `IP: ${req.ip}` : null,
        ...detailEntries
    ]
        .filter(Boolean)
        .join(" | ");

    logger[logLevel](message);
};

module.exports = {
    logEvent
};