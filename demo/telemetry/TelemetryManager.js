/**
 * TelemetryManager (Facade)
 * 
 * Main interface for all telemetry operations
 * Uses Strategy Pattern to allow swapping storage backends
 */

class TelemetryManager {
    constructor(logger = null) {
        this.logger = logger || new LocalStorageLogger();
        this.sessionManager = new SessionManager();
        this.enabled = true;
    }

    /**
     * Set storage strategy
     * @param {IDataLogger} logger - Storage implementation
     */
    setLogger(logger) {
        this.logger = logger;
        console.log('[Telemetry] Logger changed to:', logger.constructor.name);
    }

    /**
     * Log a negotiation event
     */
    async logNegotiation(data) {
        if (!this.enabled) return;

        const entry = {
            session_id: this.sessionManager.getSessionId(),
            timestamp: Date.now(),
            event_type: 'negotiation',
            prompt: data.userInput,
            completion: data.npcResponse,
            metadata: {
                item_id: data.itemId,
                item_name: data.itemName,
                original_price: data.originalPrice,
                final_price: data.finalPrice,
                discount_percent: data.discountPercent,
                persuasion_score: data.persuasionScore,
                matched_keywords: data.matchedKeywords || [],
                matched_categories: data.matchedCategories || [],
                success: data.success,
                attempt_number: data.attemptNumber
            }
        };

        await this.logger.log(entry);
        this.sessionManager.incrementEvent();
    }

    /**
     * Log a purchase event
     */
    async logPurchase(data) {
        if (!this.enabled) return;

        const entry = {
            session_id: this.sessionManager.getSessionId(),
            timestamp: Date.now(),
            event_type: 'purchase',
            prompt: `직접 구매: ${data.itemName}`,
            completion: `${data.itemName}을(를) ${data.price}G에 구매했습니다.`,
            metadata: {
                item_id: data.itemId,
                item_name: data.itemName,
                price: data.price,
                purchase_type: 'direct' // vs 'negotiated'
            }
        };

        await this.logger.log(entry);
        this.sessionManager.incrementEvent();
    }

    /**
     * Log a general chat event
     */
    async logChat(userMessage, npcResponse) {
        if (!this.enabled) return;

        const entry = {
            session_id: this.sessionManager.getSessionId(),
            timestamp: Date.now(),
            event_type: 'chat',
            prompt: userMessage,
            completion: npcResponse,
            metadata: {}
        };

        await this.logger.log(entry);
        this.sessionManager.incrementEvent();
    }

    /**
     * Flush buffered logs
     */
    async flush() {
        await this.logger.flush();
    }

    /**
     * Export logs in JSONL format
     */
    exportJSONL() {
        return this.logger.exportJSONL();
    }

    /**
     * Download logs as file
     */
    downloadLogs(filename = 'sayno_chat_logs.jsonl') {
        const jsonl = this.exportJSONL();
        const blob = new Blob([jsonl], { type: 'application/x-ndjson' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();

        URL.revokeObjectURL(url);
        console.log('[Telemetry] Downloaded logs:', filename);
    }

    /**
     * Get statistics
     */
    getStats() {
        const sessionMeta = this.sessionManager.getMetadata();
        const loggerStats = this.logger.getStats ? this.logger.getStats() : {};

        return {
            ...sessionMeta,
            ...loggerStats,
            enabled: this.enabled
        };
    }

    /**
     * Enable/disable telemetry
     */
    setEnabled(enabled) {
        this.enabled = enabled;
        console.log('[Telemetry]', enabled ? 'Enabled' : 'Disabled');
    }

    /**
     * Clear all logs
     */
    async clear() {
        await this.logger.clear();
        console.log('[Telemetry] All logs cleared');
    }
}

// Global telemetry instance
const telemetry = new TelemetryManager();
