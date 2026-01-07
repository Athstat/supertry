import { logger } from "../../../services/logger";

/**
 * Formats a date string into a more readable format
 * 
 * @param dateString The date string to format
 * @returns Formatted date string (e.g. "01 Jan 2000")
 */
export const formatDate = (dateString: Date): string => {
  if (!dateString) return 'Unknown';
  try {
    const date = new Date(dateString);
    return `${String(date.getDate()).padStart(2, '0')} ${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][date.getMonth()]} ${date.getFullYear()}`;
  } catch (e) {
    logger.error("Error ", e)
    return 'Unknown';
  }
};
