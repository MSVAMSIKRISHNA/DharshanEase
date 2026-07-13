/**
 * Format a date string to a readable format
 */
export const formatDate = (dateStr, options = {}) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const defaults = { year: 'numeric', month: 'long', day: 'numeric', ...options };
  return date.toLocaleDateString('en-IN', defaults);
};

/**
 * Format a date string to short format (DD MMM YYYY)
 */
export const formatDateShort = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

/**
 * Format time string
 */
export const formatTime = (timeStr) => {
  if (!timeStr) return '';
  const [hours, minutes] = timeStr.split(':');
  const h = parseInt(hours, 10);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hr = h % 12 || 12;
  return `${hr}:${minutes} ${ampm}`;
};

/**
 * Format currency in INR
 */
export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Truncate text to given length
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

/**
 * Get initials from name
 */
export const getInitials = (name) => {
  if (!name) return 'U';
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

/**
 * Get status badge class
 */
export const getStatusBadge = (status) => {
  const map = {
    confirmed: 'badge-success',
    pending: 'badge-warning',
    cancelled: 'badge-danger',
    completed: 'badge-info',
    active: 'badge-success',
    inactive: 'badge-danger',
    paid: 'badge-success',
    refunded: 'badge-warning',
    failed: 'badge-danger',
  };
  return map[status?.toLowerCase()] || 'badge-saffron';
};

/**
 * Get uploaded image URL
 */
export const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  
  const apiUrl = import.meta.env.VITE_API_URL || '';
  if (apiUrl.startsWith('http')) {
    const baseUrl = apiUrl.replace(/\/api$/, '');
    return `${baseUrl}/uploads/${path}`;
  }
  
  return `/uploads/${path}`;
};

/**
 * Validate email
 */
export const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

/**
 * Validate phone number (Indian)
 */
export const isValidPhone = (phone) => {
  return /^[6-9]\d{9}$/.test(phone);
};

/**
 * Generate star array for rating display
 */
export const getStarArray = (rating, max = 5) => {
  const stars = [];
  for (let i = 1; i <= max; i++) {
    if (i <= Math.floor(rating)) {
      stars.push('full');
    } else if (i - 0.5 <= rating) {
      stars.push('half');
    } else {
      stars.push('empty');
    }
  }
  return stars;
};

/**
 * Debounce function
 */
export const debounce = (func, delay = 300) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

/**
 * Get relative time (e.g., "2 hours ago")
 */
export const getRelativeTime = (dateStr) => {
  const now = new Date();
  const date = new Date(dateStr);
  const seconds = Math.floor((now - date) / 1000);

  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'week', seconds: 604800 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1) {
      return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`;
    }
  }

  return 'Just now';
};
