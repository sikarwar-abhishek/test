/**
 * Timer utility functions for consistent time handling across the application
 */

/**
 * Parse time string (HH:MM:SS) to total seconds
 * @param {string} timeString - Time in HH:MM:SS format
 * @returns {number} Total seconds
 */
export function parseTimeToSeconds(timeString) {
    if (!timeString || typeof timeString !== 'string') return 0;
    
    const parts = timeString.split(':').map(Number);
    if (parts.length !== 3 || parts.some(isNaN)) return 0;
    
    const [hours, minutes, seconds] = parts;
    return (hours * 3600) + (minutes * 60) + seconds;
}

/**
 * Convert seconds to time string (HH:MM:SS)
 * @param {number} totalSeconds - Total seconds
 * @returns {string} Time in HH:MM:SS format
 */
export function formatSecondsToTime(totalSeconds) {
    if (totalSeconds < 0) totalSeconds = 0;
    
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

/**
 * Convert seconds to human-readable format
 * @param {number} totalSeconds - Total seconds
 * @returns {Object} Object with days, hours, minutes, seconds
 */
export function formatSecondsToObject(totalSeconds) {
    if (totalSeconds <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0, totalSeconds: 0 };
    }
    
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    return { days, hours, minutes, seconds, totalSeconds };
}

/**
 * Check if timer is in critical state (less than threshold)
 * @param {string|number} time - Time string or seconds
 * @param {number} threshold - Threshold in seconds (default: 300 = 5 minutes)
 * @returns {boolean} True if critical
 */
export function isTimerCritical(time, threshold = 300) {
    const seconds = typeof time === 'string' ? parseTimeToSeconds(time) : time;
    return seconds <= threshold && seconds > 0;
}

/**
 * Check if timer is in warning state
 * @param {string|number} time - Time string or seconds
 * @param {number} warningThreshold - Warning threshold in seconds (default: 3600 = 1 hour)
 * @param {number} criticalThreshold - Critical threshold in seconds (default: 300 = 5 minutes)
 * @returns {boolean} True if in warning state
 */
export function isTimerWarning(time, warningThreshold = 3600, criticalThreshold = 300) {
    const seconds = typeof time === 'string' ? parseTimeToSeconds(time) : time;
    return seconds <= warningThreshold && seconds > criticalThreshold;
}

/**
 * Get timer status
 * @param {string|number} time - Time string or seconds
 * @returns {string} Status: 'expired', 'critical', 'warning', 'normal'
 */
export function getTimerStatus(time) {
    const seconds = typeof time === 'string' ? parseTimeToSeconds(time) : time;
    
    if (seconds <= 0) return 'expired';
    if (seconds <= 300) return 'critical';
    if (seconds <= 3600) return 'warning';
    return 'normal';
}

/**
 * Calculate time difference between two time strings
 * @param {string} time1 - First time (HH:MM:SS)
 * @param {string} time2 - Second time (HH:MM:SS)
 * @returns {number} Difference in seconds (time1 - time2)
 */
export function getTimeDifference(time1, time2) {
    return parseTimeToSeconds(time1) - parseTimeToSeconds(time2);
}

/**
 * Add seconds to a time string
 * @param {string} timeString - Time in HH:MM:SS format
 * @param {number} secondsToAdd - Seconds to add (can be negative)
 * @returns {string} New time string
 */
export function addSecondsToTime(timeString, secondsToAdd) {
    const currentSeconds = parseTimeToSeconds(timeString);
    const newSeconds = Math.max(0, currentSeconds + secondsToAdd);
    return formatSecondsToTime(newSeconds);
}

/**
 * Timer storage utilities for localStorage
 */
export const TimerStorage = {
    /**
     * Get timer data from localStorage
     * @param {string} key - Storage key
     * @returns {Object|null} Timer data or null
     */
    get(key) {
        try {
            const stored = localStorage.getItem(key);
            return stored ? JSON.parse(stored) : null;
        } catch (error) {
            console.error('Error reading timer from localStorage:', error);
            return null;
        }
    },

    /**
     * Store timer data to localStorage
     * @param {string} key - Storage key
     * @param {Object} data - Timer data
     */
    set(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify({
                ...data,
                timestamp: Date.now()
            }));
        } catch (error) {
            console.error('Error storing timer to localStorage:', error);
        }
    },

    /**
     * Remove timer data from localStorage
     * @param {string} key - Storage key
     */
    remove(key) {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error('Error removing timer from localStorage:', error);
        }
    },

    /**
     * Clear all timer data (keys starting with prefix)
     * @param {string} prefix - Key prefix to match
     */
    clearAll(prefix = 'timer_') {
        try {
            const keys = Object.keys(localStorage).filter(key => key.startsWith(prefix));
            keys.forEach(key => localStorage.removeItem(key));
        } catch (error) {
            console.error('Error clearing timer data:', error);
        }
    }
};

/**
 * Timer synchronization utilities
 */
export const TimerSync = {
    /**
     * Calculate current time based on stored data and elapsed time
     * @param {Object} storedData - Stored timer data
     * @returns {number|null} Current time in seconds or null
     */
    calculateCurrentTime(storedData) {
        if (!storedData || !storedData.lastSync || !storedData.remainingSeconds) {
            return null;
        }
        
        const now = Date.now();
        const timeSinceLastSync = Math.floor((now - storedData.lastSync) / 1000);
        return Math.max(0, storedData.remainingSeconds - timeSinceLastSync);
    },

    /**
     * Check if stored timer data is valid for synchronization
     * @param {Object} storedData - Stored timer data
     * @param {string} serverTime - Current server time
     * @param {number} maxDrift - Maximum allowed drift in seconds
     * @returns {boolean} True if data is valid for sync
     */
    isValidForSync(storedData, serverTime, maxDrift = 60) {
        if (!storedData || storedData.serverTime !== serverTime) {
            return false;
        }

        const calculatedTime = this.calculateCurrentTime(storedData);
        const serverSeconds = parseTimeToSeconds(serverTime);
        
        return calculatedTime !== null && 
               calculatedTime > 0 && 
               Math.abs(calculatedTime - serverSeconds) < maxDrift;
    },

    /**
     * Create timer sync data
     * @param {string} serverTime - Server time string
     * @param {number} remainingSeconds - Remaining seconds
     * @returns {Object} Sync data object
     */
    createSyncData(serverTime, remainingSeconds) {
        return {
            serverTime,
            remainingSeconds,
            lastSync: Date.now(),
            version: '1.0'
        };
    }
};

/**
 * Timer display formatters
 */
export const TimerFormatters = {
    /**
     * Format time for full display (1d : 2h : 30m : 45s)
     */
    full: ({ days, hours, minutes, seconds }) => 
        `${days}d : ${hours}h : ${minutes}m : ${seconds}s`,

    /**
     * Format time for compact display (1d 2h 30m or 2h 30m 45s)
     */
    compact: ({ days, hours, minutes, seconds }) => {
        if (days > 0) return `${days}d ${hours}h ${minutes}m`;
        if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
        return `${minutes}m ${seconds}s`;
    },

    /**
     * Format time for minimal display (1d 2h or 2h 30m or 30:45)
     */
    minimal: ({ days, hours, minutes, seconds }) => {
        if (days > 0) return `${days}d ${hours}h`;
        if (hours > 0) return `${hours}h ${minutes}m`;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    },

    /**
     * Format time for digital display (HH:MM:SS)
     */
    digital: ({ days, hours, minutes, seconds }) => {
        const totalHours = days * 24 + hours;
        return `${totalHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
};

/**
 * Default timer configuration
 */
export const DEFAULT_TIMER_CONFIG = {
    syncInterval: 10000, // 10 seconds
    maxDriftTolerance: 60, // 1 minute
    criticalThreshold: 300, // 5 minutes
    warningThreshold: 3600, // 1 hour
    autoStart: true,
    persistToStorage: true
};
