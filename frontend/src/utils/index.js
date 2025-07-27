// Main utils export file
export * from './urdu';

// Additional utility functions
export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function debounce(func, wait) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function throttle(func, limit) {
  let inThrottle;
  return (...args) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

export function formatTime(date = new Date()) {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

export function formatDate(date = new Date()) {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

export function capitalizeFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function truncateText(text, maxLength) {
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength) + '...';
}