/**
 * Handles console logging and monitoring
 */
class ConsoleLogger {
    constructor() {
        this.logs = [];
        this.errors = [];
        this._originalConsole = {
            log: console.log,
            error: console.error,
            warn: console.warn,
            info: console.info,
            debug: console.debug
        };
    }

    /**
     * Initialize console logging
     */
    initialize() {
        this._interceptConsole();
    }

    /**
     * Intercept console methods
     */
    _interceptConsole() {
        const logger = this;

        // Intercept console.log
        console.log = function(...args) {
            logger._logMessage('log', args);
            logger._originalConsole.log.apply(console, args);
        };

        // Intercept console.error
        console.error = function(...args) {
            logger._logError('error', args);
            logger._originalConsole.error.apply(console, args);
        };

        // Intercept console.warn
        console.warn = function(...args) {
            logger._logMessage('warn', args);
            logger._originalConsole.warn.apply(console, args);
        };

        // Intercept console.info
        console.info = function(...args) {
            logger._logMessage('info', args);
            logger._originalConsole.info.apply(console, args);
        };

        // Intercept console.debug
        console.debug = function(...args) {
            logger._logMessage('debug', args);
            logger._originalConsole.debug.apply(console, args);
        };

        // Listen for uncaught errors
        window.addEventListener('error', (event) => {
            this._logError('uncaught', [{
                message: event.message,
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno,
                error: event.error
            }]);
        });

        // Listen for unhandled promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            this._logError('unhandledrejection', [{
                reason: event.reason
            }]);
        });
    }

    /**
     * Log a console message
     * @param {string} type - Type of message
     * @param {Array} args - Message arguments
     */
    _logMessage(type, args) {
        this.logs.push({
            type,
            message: this._formatArgs(args),
            timestamp: new Date().toISOString(),
            stack: new Error().stack
        });
    }

    /**
     * Log an error
     * @param {string} type - Type of error
     * @param {Array} args - Error arguments
     */
    _logError(type, args) {
        this.errors.push({
            type,
            message: this._formatArgs(args),
            timestamp: new Date().toISOString(),
            stack: new Error().stack
        });
    }

    /**
     * Format console arguments
     * @param {Array} args - Arguments to format
     * @returns {string} Formatted message
     */
    _formatArgs(args) {
        return args.map(arg => {
            if (arg instanceof Error) {
                return {
                    message: arg.message,
                    stack: arg.stack
                };
            }
            if (typeof arg === 'object') {
                try {
                    return JSON.stringify(arg);
                } catch (e) {
                    return String(arg);
                }
            }
            return String(arg);
        });
    }

    /**
     * Get all console logs
     * @returns {Array} Array of console logs
     */
    getLogs() {
        return this.logs;
    }

    /**
     * Get all console errors
     * @returns {Array} Array of console errors
     */
    getErrors() {
        return this.errors;
    }

    /**
     * Clear all logs and errors
     */
    clear() {
        this.logs = [];
        this.errors = [];
    }

    /**
     * Restore original console methods
     */
    destroy() {
        Object.assign(console, this._originalConsole);
    }
}

export default ConsoleLogger;