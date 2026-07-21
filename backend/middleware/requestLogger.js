const morgan = require("morgan");
const { accessLogger } = require("../config/logger");

const stream = {
    write: (message) => {
        accessLogger.info(message.trim());
    }
};

const requestLogger = morgan(
    ":method :url | Status: :status | Time: :response-time ms | IP: :remote-addr",
    { stream }
);

module.exports = requestLogger;