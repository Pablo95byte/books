/**
 * Utility Functions
 *
 * Collection of reusable utility functions for the Library Tracker app
 */

import { clsx } from 'clsx';

/**
 * Combines class names conditionally
 * @param {...any} inputs
 * @returns {string}
 */
export function cn(...inputs) {
  return clsx(inputs);
}

/**
 * Format a date to a readable string
 * @param {Date|string} date
 * @param {string} locale - Default 'it-IT'
 * @returns {string}
 */
export function formatDate(date, locale = 'it-IT') {
  if (!date) return '';

  const d = new Date(date);
  if (isNaN(d.getTime())) return '';

  return d.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Format a date to a short string
 * @param {Date|string} date
 * @returns {string}
 */
export function formatDateShort(date) {
  if (!date) return '';

  const d = new Date(date);
  if (isNaN(d.getTime())) return '';

  return d.toLocaleDateString('it-IT', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

/**
 * Format date for input type="date"
 * @param {Date|string} date
 * @returns {string} YYYY-MM-DD format
 */
export function formatDateForInput(date) {
  if (!date) return '';

  const d = new Date(date);
  if (isNaN(d.getTime())) return '';

  return d.toISOString().split('T')[0];
}

/**
 * Calculate reading time in days
 * @param {Date|string} startDate
 * @param {Date|string} endDate
 * @returns {number}
 */
export function calculateReadingDays(startDate, endDate) {
  if (!startDate || !endDate) return 0;

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) return 0;

  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
}

/**
 * Get reading status label
 * @param {string} status
 * @returns {string}
 */
export function getStatusLabel(status) {
  const labels = {
    not_started: 'Da leggere',
    reading: 'In lettura',
    finished: 'Letto'
  };
  return labels[status] || status;
}

/**
 * Get reading status color
 * @param {string} status
 * @returns {string}
 */
export function getStatusColor(status) {
  const colors = {
    not_started: 'gray',
    reading: 'warning',
    finished: 'success'
  };
  return colors[status] || 'gray';
}

/**
 * Get rating stars emoji
 * @param {number} rating
 * @returns {string}
 */
export function getRatingStars(rating) {
  if (!rating) return '☆☆☆☆☆';

  const fullStars = '★'.repeat(Math.floor(rating));
  const emptyStars = '☆'.repeat(5 - Math.floor(rating));

  return fullStars + emptyStars;
}

/**
 * Truncate text with ellipsis
 * @param {string} text
 * @param {number} maxLength
 * @returns {string}
 */
export function truncate(text, maxLength = 100) {
  if (!text) return '';
  if (text.length <= maxLength) return text;

  return text.substring(0, maxLength).trim() + '...';
}

/**
 * Debounce function
 * @param {Function} func
 * @param {number} wait
 * @returns {Function}
 */
export function debounce(func, wait = 300) {
  let timeout;

  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Download a file
 * @param {string} content
 * @param {string} filename
 * @param {string} contentType
 */
export function downloadFile(content, filename, contentType = 'application/json') {
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();

  URL.revokeObjectURL(url);
}

/**
 * Read file content
 * @param {File} file
 * @returns {Promise<string>}
 */
export function readFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = (e) => reject(e);

    reader.readAsText(file);
  });
}

/**
 * Validate ISBN-10 or ISBN-13
 * @param {string} isbn
 * @returns {boolean}
 */
export function validateISBN(isbn) {
  if (!isbn) return true; // ISBN is optional

  // Remove hyphens and spaces
  const cleanISBN = isbn.replace(/[-\s]/g, '');

  // ISBN-10
  if (cleanISBN.length === 10) {
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cleanISBN[i]) * (10 - i);
    }
    const checkDigit = cleanISBN[9].toUpperCase();
    const calculatedCheck = (11 - (sum % 11)) % 11;
    const expectedCheck = calculatedCheck === 10 ? 'X' : calculatedCheck.toString();

    return checkDigit === expectedCheck;
  }

  // ISBN-13
  if (cleanISBN.length === 13) {
    let sum = 0;
    for (let i = 0; i < 12; i++) {
      sum += parseInt(cleanISBN[i]) * (i % 2 === 0 ? 1 : 3);
    }
    const checkDigit = parseInt(cleanISBN[12]);
    const calculatedCheck = (10 - (sum % 10)) % 10;

    return checkDigit === calculatedCheck;
  }

  return false;
}

/**
 * Generate a random color for categories
 * @param {string} str
 * @returns {string}
 */
export function stringToColor(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  const colors = [
    'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
    'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
  ];

  return colors[Math.abs(hash) % colors.length];
}

/**
 * Sort array of books by various criteria
 * @param {Array} books
 * @param {string} sortBy
 * @param {string} order - 'asc' or 'desc'
 * @returns {Array}
 */
export function sortBooks(books, sortBy = 'dateAdded', order = 'desc') {
  const sorted = [...books].sort((a, b) => {
    let aVal = a[sortBy];
    let bVal = b[sortBy];

    // Handle dates
    if (sortBy.includes('date') || sortBy.includes('Date')) {
      aVal = aVal ? new Date(aVal) : new Date(0);
      bVal = bVal ? new Date(bVal) : new Date(0);
    }

    // Handle strings
    if (typeof aVal === 'string') {
      aVal = aVal.toLowerCase();
      bVal = bVal ? bVal.toLowerCase() : '';
    }

    // Handle undefined/null
    if (aVal === undefined || aVal === null) return 1;
    if (bVal === undefined || bVal === null) return -1;

    if (aVal < bVal) return order === 'asc' ? -1 : 1;
    if (aVal > bVal) return order === 'asc' ? 1 : -1;
    return 0;
  });

  return sorted;
}

/**
 * Filter books by multiple criteria
 * @param {Array} books
 * @param {Object} filters
 * @returns {Array}
 */
export function filterBooks(books, filters = {}) {
  let filtered = [...books];

  // Filter by search query
  if (filters.search) {
    const query = filters.search.toLowerCase();
    filtered = filtered.filter(
      book =>
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query) ||
        (book.notes && book.notes.toLowerCase().includes(query))
    );
  }

  // Filter by status
  if (filters.status && filters.status !== 'all') {
    filtered = filtered.filter(book => book.status === filters.status);
  }

  // Filter by rating
  if (filters.rating) {
    filtered = filtered.filter(book => book.rating === parseInt(filters.rating));
  }

  // Filter by category
  if (filters.category && filters.category !== 'all') {
    filtered = filtered.filter(book => book.category === filters.category);
  }

  // Filter by author
  if (filters.author && filters.author !== 'all') {
    filtered = filtered.filter(book => book.author === filters.author);
  }

  return filtered;
}

/**
 * Get book cover placeholder URL
 * @param {string} title
 * @returns {string}
 */
export function getBookCoverPlaceholder(title) {
  // Use a placeholder service or generate a simple colored background
  const encodedTitle = encodeURIComponent(title);
  return `https://via.placeholder.com/300x450/6366f1/ffffff?text=${encodedTitle}`;
}

/**
 * Calculate progress percentage
 * @param {number} current
 * @param {number} total
 * @returns {number}
 */
export function calculateProgress(current, total) {
  if (!total || total === 0) return 0;
  return Math.round((current / total) * 100);
}

/**
 * Format number with separators
 * @param {number} num
 * @returns {string}
 */
export function formatNumber(num) {
  return new Intl.NumberFormat('it-IT').format(num);
}

/**
 * Get relative time (e.g., "2 giorni fa")
 * @param {Date|string} date
 * @returns {string}
 */
export function getRelativeTime(date) {
  if (!date) return '';

  const d = new Date(date);
  if (isNaN(d.getTime())) return '';

  const now = new Date();
  const diffMs = now - d;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Oggi';
  if (diffDays === 1) return 'Ieri';
  if (diffDays < 7) return `${diffDays} giorni fa`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} settimane fa`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} mesi fa`;

  return `${Math.floor(diffDays / 365)} anni fa`;
}

export default {
  cn,
  formatDate,
  formatDateShort,
  formatDateForInput,
  calculateReadingDays,
  getStatusLabel,
  getStatusColor,
  getRatingStars,
  truncate,
  debounce,
  downloadFile,
  readFile,
  validateISBN,
  stringToColor,
  sortBooks,
  filterBooks,
  getBookCoverPlaceholder,
  calculateProgress,
  formatNumber,
  getRelativeTime
};
