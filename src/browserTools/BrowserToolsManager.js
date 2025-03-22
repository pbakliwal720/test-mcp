import NetworkLogger from './NetworkLogger';
import ConsoleLogger from './ConsoleLogger';
import ScreenshotTool from './ScreenshotTool';
import AuditTools from './AuditTools';

/**
 * Manages browser tools and provides a unified interface
 */
class BrowserToolsManager {
    constructor() {
        this.networkLogger = new NetworkLogger();
        this.consoleLogger = new ConsoleLogger();
        this.screenshotTool = new ScreenshotTool();
        this.auditTools = new AuditTools();
    }

    /**
     * Initialize all browser tools
     */
    async initialize() {
        await Promise.all([
            this.networkLogger.initialize(),
            this.consoleLogger.initialize(),
            this.screenshotTool.initialize(),
            this.auditTools.initialize()
        ]);
    }

    /**
     * Get console logs
     * @returns {Array} Array of console logs
     */
    getConsoleLogs() {
        return this.consoleLogger.getLogs();
    }

    /**
     * Get console errors
     * @returns {Array} Array of console errors
     */
    getConsoleErrors() {
        return this.consoleLogger.getErrors();
    }

    /**
     * Get network errors
     * @returns {Array} Array of network errors
     */
    getNetworkErrors() {
        return this.networkLogger.getErrors();
    }

    /**
     * Get all network logs
     * @returns {Array} Array of network logs
     */
    getNetworkLogs() {
        return this.networkLogger.getLogs();
    }

    /**
     * Take a screenshot of the current page
     * @returns {Promise<string>} Base64 encoded screenshot
     */
    async takeScreenshot() {
        return this.screenshotTool.capture();
    }

    /**
     * Get the currently selected element
     * @returns {Element|null} Selected element or null
     */
    getSelectedElement() {
        return document.activeElement;
    }

    /**
     * Clear all logs
     */
    wipeLogs() {
        this.networkLogger.clear();
        this.consoleLogger.clear();
    }

    /**
     * Run accessibility audit
     * @returns {Promise<Object>} Audit results
     */
    async runAccessibilityAudit() {
        return this.auditTools.runAccessibilityAudit();
    }

    /**
     * Run performance audit
     * @returns {Promise<Object>} Audit results
     */
    async runPerformanceAudit() {
        return this.auditTools.runPerformanceAudit();
    }

    /**
     * Run SEO audit
     * @returns {Promise<Object>} Audit results
     */
    async runSEOAudit() {
        return this.auditTools.runSEOAudit();
    }

    /**
     * Run best practices audit
     * @returns {Promise<Object>} Audit results
     */
    async runBestPracticesAudit() {
        return this.auditTools.runBestPracticesAudit();
    }

    /**
     * Run Next.js specific audit
     * @returns {Promise<Object>} Audit results
     */
    async runNextJSAudit() {
        return this.auditTools.runNextJSAudit();
    }

    /**
     * Enable debugger mode
     */
    runDebuggerMode() {
        debugger;
    }

    /**
     * Run comprehensive audit mode
     * @returns {Promise<Object>} Combined audit results
     */
    async runAuditMode() {
        const [accessibility, performance, seo, bestPractices] = await Promise.all([
            this.runAccessibilityAudit(),
            this.runPerformanceAudit(),
            this.runSEOAudit(),
            this.runBestPracticesAudit()
        ]);

        return {
            accessibility,
            performance,
            seo,
            bestPractices
        };
    }
}

export default BrowserToolsManager;