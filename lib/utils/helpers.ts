/**
 * Generate a reference code for lost/found items
 * Format: LF-YYYY-XXXX where XXXX is a random 4-digit number
 */
export function generateReferenceCode(): string {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `LF-${year}-${randomNum}`;
}

/**
 * Format date to readable string
 */
export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Format date and time
 */
export function formatDateTime(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Get status badge color
 */
export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    verified: 'bg-blue-100 text-blue-800',
    claimed: 'bg-green-100 text-green-800',
    unclaimed: 'bg-gray-100 text-gray-800',
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Log activity to console in development
 */
export function logActivity(action: string, details: Record<string, any>): void {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Activity] ${action}:`, details);
  }
}

/**
 * Send email notification (console logging for testing)
 */
export async function sendEmailNotification(
  email: string,
  subject: string,
  message: string,
  details?: Record<string, any>
): Promise<void> {
  // In production, you would use Resend or another email service
  console.log('[Email Notification]', {
    to: email,
    subject,
    message,
    details,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Get statistics for dashboard
 */
export interface DashboardStats {
  totalItems: number;
  pendingItems: number;
  claimedItems: number;
  unclaimedItems: number;
  totalUsers: number;
  totalClaims: number;
  totalInquiries: number;
}

/**
 * Check if user is admin
 */
export function isAdmin(userRole?: string): boolean {
  return userRole === 'admin';
}
