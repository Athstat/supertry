/**
 * Formats a time duration into days, hours, and minutes
 */
export function formatCountdown(targetDate: Date | string): string {
  const now = new Date();
  const target = new Date(targetDate);
  const diff = target.getTime() - now.getTime();

  // If the deadline has passed, return a message
  if (diff <= 0) {
    return 'Closed';
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  // Format the output
  const parts: string[] = [];

  if (days > 0) {
    parts.push(`${days.toString().padStart(2, '0')} day${days !== 1 ? 's' : ''}`);
  }

  parts.push(`${hours.toString().padStart(2, '0')} hrs`);
  parts.push(`${minutes.toString().padStart(2, '0')} mins`);

  return parts.join(' ');
}
