/**
 * IDataLogger Interface
 * 
 * Strategy Pattern interface for telemetry storage.
 * Allows easy swapping between LocalStorage, File, API, etc.
 */

class IDataLogger {
    /**
     * Log a single chat entry
     * @param {Object} entry - Chat log entry in JSONL format
     * @returns {Promise<void>}
     */
    async log(entry) {
        throw new Error("Method 'log()' must be implemented");
    }

    /**
     * Flush any buffered logs to storage
     * @returns {Promise<void>}
     */
    async flush() {
        throw new Error("Method 'flush()' must be implemented");
    }

    /**
     * Export all logs in JSONL format
     * @returns {string} JSONL formatted string
     */
    exportJSONL() {
        throw new Error("Method 'exportJSONL()' must be implemented");
    }

    /**
     * Clear all logs
     * @returns {Promise<void>}
     */
    async clear() {
        throw new Error("Method 'clear()' must be implemented");
    }
}
