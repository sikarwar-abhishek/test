import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook for synchronized timer functionality
 * Keeps local timer in sync with server timer using localStorage
 * 
 * @param {string} serverTime - Time string from server in HH:MM:SS format
 * @param {string} storageKey - Unique key for localStorage
 * @param {Object} options - Configuration options
 * @returns {Object} Timer state and utilities
 */
export function useTimerSync(serverTime, storageKey = 'timer_sync', options = {}) {
    const {
        syncInterval = 10000, // How often to sync to localStorage (ms)
        maxDriftTolerance = 60, // Max acceptable drift from server time (seconds)
        onExpired = null, // Callback when timer expires
        autoStart = true // Whether to start timer automatically
    } = options;

    const [currentTime, setCurrentTime] = useState(null);
    const [isExpired, setIsExpired] = useState(false);
    const [isRunning, setIsRunning] = useState(false);
    const intervalRef = useRef(null);
    const lastSyncRef = useRef(null);

    // Parse time string (HH:MM:SS) to total seconds
    const parseTimeToSeconds = useCallback((timeString) => {
        if (!timeString || typeof timeString !== 'string') return 0;
        const parts = timeString.split(':').map(Number);
        if (parts.length !== 3 || parts.some(isNaN)) return 0;
        const [hours, minutes, seconds] = parts;
        return (hours * 3600) + (minutes * 60) + seconds;
    }, []);

    // Convert seconds to formatted time object
    const formatTime = useCallback((totalSeconds) => {
        if (totalSeconds <= 0) {
            return { days: 0, hours: 0, minutes: 0, seconds: 0, totalSeconds: 0 };
        }
        
        const days = Math.floor(totalSeconds / 86400);
        const hours = Math.floor((totalSeconds % 86400) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        
        return { days, hours, minutes, seconds, totalSeconds };
    }, []);

    // Get stored timer data from localStorage
    const getStoredTimerData = useCallback(() => {
        try {
            const stored = localStorage.getItem(storageKey);
            return stored ? JSON.parse(stored) : null;
        } catch (error) {
            console.error('Error reading timer from localStorage:', error);
            return null;
        }
    }, [storageKey]);

    // Store timer data to localStorage
    const storeTimerData = useCallback((data) => {
        try {
            localStorage.setItem(storageKey, JSON.stringify(data));
        } catch (error) {
            console.error('Error storing timer to localStorage:', error);
        }
    }, [storageKey]);

    // Calculate current time based on stored data and elapsed time
    const calculateCurrentTime = useCallback((storedData) => {
        if (!storedData) return null;
        
        const now = Date.now();
        const timeSinceLastSync = Math.floor((now - storedData.lastSync) / 1000);
        return Math.max(0, storedData.remainingSeconds - timeSinceLastSync);
    }, []);

    // Sync with server time
    const syncWithServer = useCallback(() => {
        if (!serverTime) return;

        const serverTimeInSeconds = parseTimeToSeconds(serverTime);
        const now = Date.now();
        const storedData = getStoredTimerData();

        let initialTimeInSeconds = serverTimeInSeconds;

        // If we have stored data and server time hasn't changed significantly, use calculated time
        if (storedData && storedData.serverTime === serverTime) {
            const calculatedTime = calculateCurrentTime(storedData);
            
            // Use calculated time if it's reasonable (not too far off from server time)
            if (calculatedTime !== null && 
                calculatedTime > 0 && 
                Math.abs(calculatedTime - serverTimeInSeconds) < maxDriftTolerance) {
                initialTimeInSeconds = calculatedTime;
            }
        }

        setCurrentTime(initialTimeInSeconds);
        setIsExpired(initialTimeInSeconds <= 0);

        // Store the sync data
        storeTimerData({
            serverTime,
            remainingSeconds: initialTimeInSeconds,
            lastSync: now
        });

        lastSyncRef.current = now;

        if (initialTimeInSeconds <= 0 && onExpired) {
            onExpired();
        }
    }, [serverTime, parseTimeToSeconds, getStoredTimerData, calculateCurrentTime, 
        maxDriftTolerance, storeTimerData, onExpired]);

    // Start the timer
    const startTimer = useCallback(() => {
        if (isExpired || currentTime <= 0) return;
        
        setIsRunning(true);
        
        intervalRef.current = setInterval(() => {
            setCurrentTime(prevTime => {
                const newTime = Math.max(0, prevTime - 1);
                
                if (newTime <= 0) {
                    setIsExpired(true);
                    setIsRunning(false);
                    if (onExpired) onExpired();
                    return 0;
                }

                // Update localStorage periodically
                const now = Date.now();
                if (lastSyncRef.current && (now - lastSyncRef.current) >= syncInterval) {
                    storeTimerData({
                        serverTime,
                        remainingSeconds: newTime,
                        lastSync: now
                    });
                    lastSyncRef.current = now;
                }

                return newTime;
            });
        }, 1000);
    }, [currentTime, isExpired, onExpired, syncInterval, storeTimerData, serverTime]);

    // Stop the timer
    const stopTimer = useCallback(() => {
        setIsRunning(false);
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    }, []);

    // Reset timer to server time
    const resetTimer = useCallback(() => {
        stopTimer();
        syncWithServer();
        if (autoStart && currentTime > 0) {
            setTimeout(startTimer, 0);
        }
    }, [stopTimer, syncWithServer, autoStart, currentTime, startTimer]);

    // Initialize timer when server time changes
    useEffect(() => {
        syncWithServer();
    }, [syncWithServer]);

    // Auto-start timer
    useEffect(() => {
        if (autoStart && currentTime !== null && currentTime > 0 && !isRunning && !isExpired) {
            startTimer();
        }
    }, [autoStart, currentTime, isRunning, isExpired, startTimer]);

    // Handle visibility change to sync when tab becomes active
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (!document.hidden && currentTime !== null && !isExpired) {
                const storedData = getStoredTimerData();
                if (storedData && storedData.serverTime === serverTime) {
                    const calculatedTime = calculateCurrentTime(storedData);
                    
                    if (calculatedTime !== null) {
                        if (calculatedTime > 0) {
                            setCurrentTime(calculatedTime);
                            setIsExpired(false);
                            if (autoStart && !isRunning) {
                                startTimer();
                            }
                        } else {
                            setCurrentTime(0);
                            setIsExpired(true);
                            stopTimer();
                            if (onExpired) onExpired();
                        }
                    }
                }
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, [currentTime, isExpired, serverTime, getStoredTimerData, calculateCurrentTime, 
        autoStart, isRunning, startTimer, stopTimer, onExpired]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    // Format current time for display
    const formattedTime = formatTime(currentTime || 0);

    return {
        currentTime,
        formattedTime,
        isExpired,
        isRunning,
        startTimer,
        stopTimer,
        resetTimer,
        syncWithServer
    };
}
