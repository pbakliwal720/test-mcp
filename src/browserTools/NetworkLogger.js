/**
 * Handles network request logging and monitoring
 */
class NetworkLogger {
    constructor() {
        this.logs = [];
        this.errors = [];
        this._originalFetch = window.fetch;
        this._originalXHR = window.XMLHttpRequest;
    }

    /**
     * Initialize network logging
     */
    initialize() {
        this._interceptFetch();
        this._interceptXHR();
    }

    /**
     * Intercept fetch requests
     */
    _interceptFetch() {
        const logger = this;
        window.fetch = async function(...args) {
            const startTime = performance.now();
            const request = args[0];
            const url = typeof request === 'string' ? request : request.url;

            try {
                const response = await logger._originalFetch.apply(this, args);
                const duration = performance.now() - startTime;

                logger._logRequest({
                    type: 'fetch',
                    url,
                    method: typeof request === 'string' ? 'GET' : request.method || 'GET',
                    status: response.status,
                    duration,
                    timestamp: new Date().toISOString()
                });

                if (!response.ok) {
                    logger._logError({
                        type: 'fetch',
                        url,
                        status: response.status,
                        statusText: response.statusText,
                        timestamp: new Date().toISOString()
                    });
                }

                return response;
            } catch (error) {
                logger._logError({
                    type: 'fetch',
                    url,
                    error: error.message,
                    timestamp: new Date().toISOString()
                });
                throw error;
            }
        };
    }

    /**
     * Intercept XMLHttpRequest
     */
    _interceptXHR() {
        const logger = this;
        window.XMLHttpRequest = class extends logger._originalXHR {
            constructor() {
                super();
                const startTime = performance.now();
                let url = '';
                let method = '';

                this.addEventListener('load', function() {
                    const duration = performance.now() - startTime;
                    logger._logRequest({
                        type: 'xhr',
                        url,
                        method,
                        status: this.status,
                        duration,
                        timestamp: new Date().toISOString()
                    });

                    if (this.status >= 400) {
                        logger._logError({
                            type: 'xhr',
                            url,
                            status: this.status,
                            statusText: this.statusText,
                            timestamp: new Date().toISOString()
                        });
                    }
                });

                this.addEventListener('error', function() {
                    logger._logError({
                        type: 'xhr',
                        url,
                        error: 'Network error',
                        timestamp: new Date().toISOString()
                    });
                });

                const originalOpen = this.open;
                this.open = function(...args) {
                    [method, url] = args;
                    return originalOpen.apply(this, args);
                };
            }
        };
    }

    /**
     * Log a network request
     * @param {Object} requestData - Request data to log
     */
    _logRequest(requestData) {
        this.logs.push(requestData);
    }

    /**
     * Log a network error
     * @param {Object} errorData - Error data to log
     */
    _logError(errorData) {
        this.errors.push(errorData);
    }

    /**
     * Get all network logs
     * @returns {Array} Array of network logs
     */
    getLogs() {
        return this.logs;
    }

    /**
     * Get all network errors
     * @returns {Array} Array of network errors
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
     * Restore original fetch and XHR
     */
    destroy() {
        window.fetch = this._originalFetch;
        window.XMLHttpRequest = this._originalXHR;
    }
}

export default NetworkLogger;