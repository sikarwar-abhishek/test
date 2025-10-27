import { useTimerSync } from '@/src/hooks/useTimerSync';

export default function Timer({ time, syncKey = 'daily_challenge_timer', className = '' }) {
    const { formattedTime, isExpired, currentTime } = useTimerSync(time, syncKey, {
        syncInterval: 10000, // Sync to localStorage every 10 seconds
        maxDriftTolerance: 60, // Allow 60 seconds drift from server time
        autoStart: true
    });

    // Loading state - show server time as fallback
    if (currentTime === null && time) {
        const [hours, minutes, seconds] = time.split(':').map(Number);
        const days = Math.floor(hours / 24);
        return (
            <div className={className}>
                <p>{days}d : {hours % 24}h : {minutes}m : {seconds}s</p>
            </div>
        );
    }

    // Expired state
    if (isExpired) {
        return (
            <div className={className}>
                <p className="text-red-500">Expired</p>
            </div>
        );
    }

    // Active countdown
    const { days, hours, minutes, seconds } = formattedTime;

    return (
        <div className={className}>
            <p>{days}d : {hours}h : {minutes}m : {seconds}s</p>
        </div>
    );
}