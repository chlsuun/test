/**
 * SessionManager
 * 
 * Tracks user sessions via URL parameters or generates unique IDs
 * Format: ?session=abc123 or auto-generated UUID
 */

class SessionManager {
    constructor() {
        this.sessionId = this.initializeSession();
        this.sessionStart = Date.now();
        this.eventCount = 0;
    }

    /**
     * Initialize or retrieve session ID
     */
    initializeSession() {
        // Try to get from URL parameter
        const urlParams = new URLSearchParams(window.location.search);
        const urlSession = urlParams.get('session');

        if (urlSession) {
            console.log('[Session] Using URL session:', urlSession);
            return urlSession;
        }

        // Try to get from localStorage
        const storedSession = localStorage.getItem('sayno_session_id');
        if (storedSession) {
            console.log('[Session] Resuming session:', storedSession);
            return storedSession;
        }

        // Generate new session ID
        const newSession = this.generateSessionId();
        localStorage.setItem('sayno_session_id', newSession);
        console.log('[Session] New session created:', newSession);
        return newSession;
    }

    /**
     * Generate unique session ID
     */
    generateSessionId() {
        return 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Get current session ID
     */
    getSessionId() {
        return this.sessionId;
    }

    /**
     * Increment event counter
     */
    incrementEvent() {
        this.eventCount++;
    }

    /**
     * Get session metadata
     */
    getMetadata() {
        return {
            session_id: this.sessionId,
            session_start: this.sessionStart,
            session_duration: Date.now() - this.sessionStart,
            event_count: this.eventCount,
            user_agent: navigator.userAgent,
            screen_size: `${window.screen.width}x${window.screen.height}`,
            language: navigator.language
        };
    }

    /**
     * Reset session (for testing)
     */
    reset() {
        localStorage.removeItem('sayno_session_id');
        this.sessionId = this.generateSessionId();
        this.sessionStart = Date.now();
        this.eventCount = 0;
    }
}
