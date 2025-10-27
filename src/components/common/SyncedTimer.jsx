import { useTimerSync } from '@/src/hooks/useTimerSync';
import { cn } from '@/src/lib/utils';

/**
 * Advanced synchronized timer component with multiple display formats
 * 
 * @param {string} time - Server time in HH:MM:SS format
 * @param {string} syncKey - Unique localStorage key for this timer
 * @param {string} format - Display format: 'full', 'compact', 'minimal', 'custom'
 * @param {string} className - Additional CSS classes
 * @param {Function} onExpired - Callback when timer expires
 * @param {Object} customFormat - Custom format configuration
 * @param {boolean} showExpiredMessage - Whether to show expired message
 * @param {string} expiredMessage - Custom expired message
 * @param {boolean} hideWhenExpired - Hide component when expired
 * @param {Object} styles - Custom styles for different states
 */
export default function SyncedTimer({
    time,
    syncKey = 'synced_timer',
    format = 'full',
    className = '',
    onExpired = null,
    customFormat = null,
    showExpiredMessage = true,
    expiredMessage = 'Expired',
    hideWhenExpired = false,
    styles = {}
}) {
    const { formattedTime, isExpired, currentTime, isRunning } = useTimerSync(time, syncKey, {
        syncInterval: 10000,
        maxDriftTolerance: 60,
        autoStart: true,
        onExpired
    });

    // Don't render if hiding when expired
    if (isExpired && hideWhenExpired) {
        return null;
    }

    // Loading state - show server time as fallback
    if (currentTime === null && time) {
        const [hours, minutes, seconds] = time.split(':').map(Number);
        const days = Math.floor(hours / 24);
        return (
            <div className={cn('timer-loading', className)} style={styles.loading}>
                {formatDisplay({ days, hours: hours % 24, minutes, seconds }, format, customFormat)}
            </div>
        );
    }

    // Expired state
    if (isExpired) {
        if (!showExpiredMessage) return null;
        
        return (
            <div className={cn('timer-expired text-red-500', className)} style={styles.expired}>
                <p>{expiredMessage}</p>
            </div>
        );
    }

    // Active countdown
    const { days, hours, minutes, seconds } = formattedTime;
    const timerClasses = cn(
        'timer-active',
        {
            'timer-running': isRunning,
            'timer-paused': !isRunning,
            'timer-critical': currentTime <= 300, // Last 5 minutes
            'timer-warning': currentTime <= 3600 && currentTime > 300, // Last hour
        },
        className
    );

    return (
        <div className={timerClasses} style={styles.active}>
            {formatDisplay({ days, hours, minutes, seconds }, format, customFormat)}
        </div>
    );
}

/**
 * Format time display based on format type
 */
function formatDisplay(timeObj, format, customFormat) {
    const { days, hours, minutes, seconds } = timeObj;

    switch (format) {
        case 'full':
            return <p>{days}d : {hours}h : {minutes}m : {seconds}s</p>;
            
        case 'compact':
            if (days > 0) return <p>{days}d {hours}h {minutes}m</p>;
            if (hours > 0) return <p>{hours}h {minutes}m {seconds}s</p>;
            return <p>{minutes}m {seconds}s</p>;
            
        case 'minimal':
            if (days > 0) return <p>{days}d {hours}h</p>;
            if (hours > 0) return <p>{hours}h {minutes}m</p>;
            return <p>{minutes}:{seconds.toString().padStart(2, '0')}</p>;
            
        case 'digital':
            const totalHours = days * 24 + hours;
            return (
                <div className="font-mono text-lg">
                    {totalHours.toString().padStart(2, '0')}:
                    {minutes.toString().padStart(2, '0')}:
                    {seconds.toString().padStart(2, '0')}
                </div>
            );
            
        case 'badges':
            return (
                <div className="flex gap-1 text-xs">
                    {days > 0 && <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">{days}d</span>}
                    {hours > 0 && <span className="bg-green-100 text-green-800 px-2 py-1 rounded">{hours}h</span>}
                    {minutes > 0 && <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">{minutes}m</span>}
                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded">{seconds}s</span>
                </div>
            );
            
        case 'custom':
            if (customFormat && typeof customFormat.render === 'function') {
                return customFormat.render(timeObj);
            }
            return formatDisplay(timeObj, 'full', null);
            
        default:
            return <p>{days}d : {hours}h : {minutes}m : {seconds}s</p>;
    }
}

/**
 * Utility component for countdown with progress bar
 */
export function TimerWithProgress({
    time,
    syncKey,
    totalDuration, // Total duration in seconds for progress calculation
    className = '',
    showProgress = true,
    progressClassName = '',
    ...timerProps
}) {
    const { currentTime, isExpired } = useTimerSync(time, syncKey, {
        syncInterval: 10000,
        maxDriftTolerance: 60,
        autoStart: true
    });

    const progressPercentage = totalDuration && currentTime 
        ? Math.max(0, Math.min(100, (currentTime / totalDuration) * 100))
        : 0;

    return (
        <div className={cn('timer-with-progress', className)}>
            <SyncedTimer time={time} syncKey={syncKey} {...timerProps} />
            {showProgress && !isExpired && (
                <div className={cn('w-full bg-gray-200 rounded-full h-2 mt-2', progressClassName)}>
                    <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${progressPercentage}%` }}
                    />
                </div>
            )}
        </div>
    );
}

/**
 * Utility component for multiple timers
 */
export function MultiTimer({ timers = [], className = '' }) {
    return (
        <div className={cn('multi-timer space-y-2', className)}>
            {timers.map((timer, index) => (
                <div key={timer.syncKey || index} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{timer.label}</span>
                    <SyncedTimer {...timer} />
                </div>
            ))}
        </div>
    );
}

/**
 * Hook for timer utilities
 */
export function useTimerUtils() {
    const parseTimeString = (timeString) => {
        if (!timeString || typeof timeString !== 'string') return 0;
        const [hours, minutes, seconds] = timeString.split(':').map(Number);
        return (hours * 3600) + (minutes * 60) + seconds;
    };

    const formatTimeString = (totalSeconds) => {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    const isTimerCritical = (timeString, threshold = 300) => {
        return parseTimeString(timeString) <= threshold;
    };

    return {
        parseTimeString,
        formatTimeString,
        isTimerCritical
    };
}
