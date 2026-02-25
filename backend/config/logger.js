// Logging utility for consistent logging across the app
const fs = require('fs');
const path = require('path');

const logsDir = path.join(__dirname, '../logs');

// Create logs directory if it doesn't exist
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}

const getLogFile = (type = 'app') => {
    const date = new Date().toISOString().split('T')[0];
    return path.join(logsDir, `${type}-${date}.log`);
};

const formatLog = (level, message, error = null) => {
    const timestamp = new Date().toISOString();
    let log = `[${timestamp}] [${level}] ${message}`;
    if (error) {
        log += `\n${error.stack || error}`;
    }
    return log;
};

const writeLog = (type, level, message, error = null) => {
    const logFile = getLogFile(type);
    const logMessage = formatLog(level, message, error);
    fs.appendFileSync(logFile, logMessage + '\n');
};

const logger = {
    info: (message, type = 'app') => {
        console.log(`✓ ${message}`);
        writeLog(type, 'INFO', message);
    },

    error: (message, error = null, type = 'app') => {
        console.error(`✗ ${message}`, error || '');
        writeLog(type, 'ERROR', message, error);
    },

    warn: (message, type = 'app') => {
        console.warn(`⚠ ${message}`);
        writeLog(type, 'WARN', message);
    },

    debug: (message, type = 'app') => {
        if (process.env.NODE_ENV === 'development') {
            console.log(`🔍 ${message}`);
            writeLog(type, 'DEBUG', message);
        }
    },

    api: (method, path, status, message = '', type = 'api') => {
        const logMessage = `${method} ${path} - ${status} ${message}`;
        writeLog(type, 'API', logMessage);
    },
};

module.exports = logger;
