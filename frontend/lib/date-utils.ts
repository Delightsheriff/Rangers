/**
 * Format a date into a readable string
 * @param date The date to format
 * @param format The format to use (short, medium, long)
 * @returns A formatted date string
 */
export function formatDate(
  date: Date | undefined,
  format: 'short' | 'medium' | 'long' = 'medium',
): string {
  if (!date) return '';

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: format === 'short' ? 'short' : 'long',
    day: 'numeric',
  };

  if (format === 'long') {
    options.weekday = 'long';
  }

  return date.toLocaleDateString('en-US', options);
}

/**
 * Format a date with time
 * @param date The date to format
 * @param includeSeconds Whether to include seconds
 * @returns A formatted date and time string
 */
export function formatDateTime(date: Date | undefined, includeSeconds = false): string {
  if (!date) return '';

  const dateOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    second: includeSeconds ? '2-digit' : undefined,
    hour12: true,
  };

  const dateStr = date.toLocaleDateString('en-US', dateOptions);
  const timeStr = date.toLocaleTimeString('en-US', timeOptions);

  return `${dateStr} at ${timeStr}`;
}

/**
 * Get a relative time string (e.g., "2 days ago", "just now")
 * @param date The date to format
 * @returns A relative time string
 */
export function getRelativeTimeString(date: Date | undefined): string {
  if (!date) return '';

  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInSecs = Math.floor(diffInMs / 1000);
  const diffInMins = Math.floor(diffInSecs / 60);
  const diffInHours = Math.floor(diffInMins / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInSecs < 60) {
    return 'Just now';
  } else if (diffInMins < 60) {
    return `${diffInMins} ${diffInMins === 1 ? 'minute' : 'minutes'} ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
  } else if (diffInDays < 7) {
    return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
  } else {
    return formatDate(date);
  }
}
