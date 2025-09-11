import { formatDistanceToNow, format, isToday, isYesterday } from 'date-fns';

/**
 * Format timestamp for social media posts
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted time string
 */
export const formatPostTimestamp = (dateString) => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    
    // Check if date is invalid
    if (isNaN(date.getTime())) {
      return 'Invalid date';
    }
    
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    
    // Less than 1 minute
    if (diffInMinutes < 1) {
      return 'Just now';
    }
    
    // Less than 1 hour - show minutes
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    }
    
    // Less than 24 hours - show hours
    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    }
    
    // Less than 7 days - show days
    if (diffInDays < 7) {
      return `${diffInDays}d ago`;
    }
    
    // Less than 30 days - show weeks
    if (diffInDays < 30) {
      const weeks = Math.floor(diffInDays / 7);
      return `${weeks}w ago`;
    }
    
    // More than 30 days - show formatted date
    if (isToday(date)) {
      return format(date, 'HH:mm');
    }
    
    if (isYesterday(date)) {
      return 'Yesterday';
    }
    
    // Show month and day for current year, full date for previous years
    const currentYear = now.getFullYear();
    const dateYear = date.getFullYear();
    
    if (currentYear === dateYear) {
      return format(date, 'MMM d');
    } else {
      return format(date, 'MMM d, yyyy');
    }
    
  } catch (error) {
    console.error('Error formatting timestamp:', error);
    return 'Invalid date';
  }
};

/**
 * Format timestamp with relative time using date-fns
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted relative time string
 */
export const formatRelativeTime = (dateString) => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) {
      return 'Invalid date';
    }
    
    return formatDistanceToNow(date, { addSuffix: true });
  } catch (error) {
    console.error('Error formatting relative time:', error);
    return 'Invalid date';
  }
};
