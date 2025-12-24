/**
 * LocalStorageLogger
 * 
 * Current implementation: Stores chat logs in browser localStorage
 * Format: JSONL (JSON Lines) - one JSON object per line
 */

class LocalStorageLogger extends IDataLogger {
    constructor(storageKey = 'sayno_chat_logs') {
        super();
        this.storageKey = storageKey;
        this.buffer = [];
        this.maxBufferSize = 10; // Flush every 10 entries
    }

    /**
     * Log a chat entry to localStorage
     */
    async log(entry) {
        this.buffer.push(entry);

        // Auto-flush when buffer is full
        if (this.buffer.length >= this.maxBufferSize) {
            await this.flush();
        }
    }

    /**
     * Flush buffer to localStorage
     */
    async flush() {
        if (this.buffer.length === 0) return;

        try {
            // Get existing logs
            const existing = localStorage.getItem(this.storageKey) || '';

            // Append new entries (JSONL format: one JSON per line)
            const newEntries = this.buffer.map(entry => JSON.stringify(entry)).join('\n');
            const updated = existing ? existing + '\n' + newEntries : newEntries;

            localStorage.setItem(this.storageKey, updated);
            this.buffer = [];

            console.log(`[Telemetry] Flushed ${this.buffer.length} entries to localStorage`);
        } catch (error) {
            console.error('[Telemetry] Failed to flush to localStorage:', error);
        }
    }

    /**
     * Export all logs in JSONL format
     */
    exportJSONL() {
        const logs = localStorage.getItem(this.storageKey) || '';
        return logs;
    }

    /**
     * Get logs as array of objects
     */
    getLogs() {
        const jsonl = this.exportJSONL();
        if (!jsonl) return [];

        return jsonl.split('\n')
            .filter(line => line.trim())
            .map(line => {
                try {
                    return JSON.parse(line);
                } catch (e) {
                    console.error('[Telemetry] Failed to parse log line:', line);
                    return null;
                }
            })
            .filter(entry => entry !== null);
    }

    /**
     * Clear all logs
     */
    async clear() {
        localStorage.removeItem(this.storageKey);
        this.buffer = [];
        console.log('[Telemetry] Cleared all logs');
    }

    /**
     * Get log statistics
     */
    getStats() {
        const logs = this.getLogs();
        return {
            total: logs.length,
            buffered: this.buffer.length,
            size: new Blob([this.exportJSONL()]).size,
            oldest: logs[0]?.timestamp,
            newest: logs[logs.length - 1]?.timestamp
        };
    }
}
