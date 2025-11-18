/**
 * IndexedDB Database Layer using Dexie.js
 *
 * This module provides a robust, offline-first database for the Library Tracker PWA.
 * Features:
 * - Full CRUD operations for books
 * - Efficient indexing for search and filters
 * - Transaction support
 * - Migration ready for future schema changes
 */

import Dexie from 'dexie';

// Database schema version 1
export const db = new Dexie('LibraryTrackerDB');

// Define schema
db.version(1).stores({
  books: '++id, title, author, isbn, status, rating, category, dateAdded, dateStarted, dateFinished',
  settings: 'key'
});

/**
 * Book Model Interface
 *
 * @typedef {Object} Book
 * @property {number} id - Auto-incremented primary key
 * @property {string} title - Book title
 * @property {string} author - Book author
 * @property {string} [isbn] - ISBN code (optional)
 * @property {string} status - Reading status: 'not_started' | 'reading' | 'finished'
 * @property {number} [rating] - Rating 1-5 (optional)
 * @property {string} [category] - Book category/genre (optional)
 * @property {string} [coverUrl] - Cover image URL (optional)
 * @property {number} [pages] - Total pages (optional)
 * @property {string} [notes] - Personal notes (optional)
 * @property {string} [publisher] - Publisher name (optional)
 * @property {number} [publishYear] - Publication year (optional)
 * @property {Date} dateAdded - Date when book was added to library
 * @property {Date} [dateStarted] - Date when started reading (optional)
 * @property {Date} [dateFinished] - Date when finished reading (optional)
 * @property {string[]} [tags] - Custom tags (optional)
 */

/**
 * Book Service - All database operations for books
 */
export const bookService = {
  /**
   * Get all books
   * @returns {Promise<Book[]>}
   */
  async getAll() {
    return await db.books.toArray();
  },

  /**
   * Get a single book by ID
   * @param {number} id
   * @returns {Promise<Book|undefined>}
   */
  async getById(id) {
    return await db.books.get(id);
  },

  /**
   * Add a new book
   * @param {Omit<Book, 'id'>} book
   * @returns {Promise<number>} The new book ID
   */
  async add(book) {
    const newBook = {
      ...book,
      dateAdded: new Date(),
      status: book.status || 'not_started'
    };
    return await db.books.add(newBook);
  },

  /**
   * Update an existing book
   * @param {number} id
   * @param {Partial<Book>} updates
   * @returns {Promise<number>} Number of updated records
   */
  async update(id, updates) {
    return await db.books.update(id, updates);
  },

  /**
   * Delete a book
   * @param {number} id
   * @returns {Promise<void>}
   */
  async delete(id) {
    return await db.books.delete(id);
  },

  /**
   * Search books by title or author
   * @param {string} query
   * @returns {Promise<Book[]>}
   */
  async search(query) {
    const lowerQuery = query.toLowerCase();
    return await db.books
      .filter(book =>
        book.title.toLowerCase().includes(lowerQuery) ||
        book.author.toLowerCase().includes(lowerQuery)
      )
      .toArray();
  },

  /**
   * Filter books by status
   * @param {string} status - 'not_started' | 'reading' | 'finished'
   * @returns {Promise<Book[]>}
   */
  async getByStatus(status) {
    return await db.books.where('status').equals(status).toArray();
  },

  /**
   * Get books by rating
   * @param {number} rating
   * @returns {Promise<Book[]>}
   */
  async getByRating(rating) {
    return await db.books.where('rating').equals(rating).toArray();
  },

  /**
   * Get books by category
   * @param {string} category
   * @returns {Promise<Book[]>}
   */
  async getByCategory(category) {
    return await db.books.where('category').equals(category).toArray();
  },

  /**
   * Get all unique categories
   * @returns {Promise<string[]>}
   */
  async getCategories() {
    const books = await db.books.toArray();
    const categories = [...new Set(books.map(b => b.category).filter(Boolean))];
    return categories.sort();
  },

  /**
   * Get all unique authors
   * @returns {Promise<string[]>}
   */
  async getAuthors() {
    const books = await db.books.toArray();
    const authors = [...new Set(books.map(b => b.author).filter(Boolean))];
    return authors.sort();
  },

  /**
   * Get reading statistics
   * @returns {Promise<Object>}
   */
  async getStats() {
    const books = await db.books.toArray();

    const stats = {
      total: books.length,
      read: books.filter(b => b.status === 'finished').length,
      reading: books.filter(b => b.status === 'reading').length,
      toRead: books.filter(b => b.status === 'not_started').length,
      avgRating: 0,
      totalPages: 0,
      avgReadingTime: 0,
      booksPerMonth: {},
      ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      topCategories: {},
    };

    // Calculate averages and distributions
    let ratedBooks = 0;
    let totalReadingDays = 0;
    let booksWithReadingTime = 0;

    books.forEach(book => {
      // Rating stats
      if (book.rating) {
        stats.avgRating += book.rating;
        stats.ratingDistribution[book.rating]++;
        ratedBooks++;
      }

      // Pages stats
      if (book.pages) {
        stats.totalPages += book.pages;
      }

      // Reading time stats
      if (book.dateStarted && book.dateFinished) {
        const days = Math.ceil(
          (new Date(book.dateFinished) - new Date(book.dateStarted)) / (1000 * 60 * 60 * 24)
        );
        totalReadingDays += days;
        booksWithReadingTime++;
      }

      // Books per month (for finished books)
      if (book.dateFinished) {
        const monthYear = new Date(book.dateFinished).toLocaleDateString('it-IT', {
          year: 'numeric',
          month: 'short'
        });
        stats.booksPerMonth[monthYear] = (stats.booksPerMonth[monthYear] || 0) + 1;
      }

      // Category distribution
      if (book.category) {
        stats.topCategories[book.category] = (stats.topCategories[book.category] || 0) + 1;
      }
    });

    stats.avgRating = ratedBooks > 0 ? (stats.avgRating / ratedBooks).toFixed(1) : 0;
    stats.avgReadingTime = booksWithReadingTime > 0
      ? Math.round(totalReadingDays / booksWithReadingTime)
      : 0;

    return stats;
  },

  /**
   * Bulk import books
   * @param {Book[]} books
   * @returns {Promise<number>} Last book ID
   */
  async bulkImport(books) {
    return await db.books.bulkAdd(books);
  },

  /**
   * Export all books to JSON
   * @returns {Promise<string>}
   */
  async exportToJSON() {
    const books = await db.books.toArray();
    return JSON.stringify(books, null, 2);
  },

  /**
   * Clear all books (use with caution!)
   * @returns {Promise<void>}
   */
  async clear() {
    return await db.books.clear();
  }
};

/**
 * Settings Service - App settings and preferences
 */
export const settingsService = {
  /**
   * Get a setting value
   * @param {string} key
   * @returns {Promise<any>}
   */
  async get(key) {
    const setting = await db.settings.get(key);
    return setting?.value;
  },

  /**
   * Set a setting value
   * @param {string} key
   * @param {any} value
   * @returns {Promise<string>}
   */
  async set(key, value) {
    return await db.settings.put({ key, value });
  },

  /**
   * Delete a setting
   * @param {string} key
   * @returns {Promise<void>}
   */
  async delete(key) {
    return await db.settings.delete(key);
  }
};

// Initialize database and handle errors
db.on('ready', () => {
  console.log('✅ Database initialized successfully');
});

db.on('populate', async () => {
  console.log('🔄 Populating database with sample data...');

  // Optional: Add sample books for first-time users
  await db.books.bulkAdd([
    {
      title: "1984",
      author: "George Orwell",
      status: "finished",
      rating: 5,
      category: "Dystopian Fiction",
      pages: 328,
      notes: "Un capolavoro della letteratura distopica. Incredibilmente attuale.",
      dateAdded: new Date('2024-01-15'),
      dateStarted: new Date('2024-01-20'),
      dateFinished: new Date('2024-02-10'),
      tags: ["dystopia", "classics", "must-read"]
    },
    {
      title: "Sapiens: A Brief History of Humankind",
      author: "Yuval Noah Harari",
      status: "reading",
      rating: 4,
      category: "Non-fiction",
      pages: 443,
      notes: "Affascinante viaggio nella storia dell'umanità.",
      dateAdded: new Date('2024-02-01'),
      dateStarted: new Date('2024-02-15'),
      tags: ["history", "science", "evolution"]
    },
    {
      title: "The Clean Coder",
      author: "Robert C. Martin",
      status: "not_started",
      category: "Programming",
      pages: 256,
      dateAdded: new Date('2024-03-01'),
      tags: ["programming", "professional-development"]
    }
  ]);
});

export default db;
