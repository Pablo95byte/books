/**
 * Google Books API Service
 * Fetch book data from ISBN
 */

const GOOGLE_BOOKS_API = 'https://www.googleapis.com/books/v1/volumes';

/**
 * Search book by ISBN using Google Books API
 * @param {string} isbn - ISBN-10 or ISBN-13
 * @returns {Promise<Object|null>} Book data or null
 */
export async function searchBookByISBN(isbn) {
  try {
    const cleanISBN = isbn.replace(/[-\s]/g, '');
    const response = await fetch(
      `${GOOGLE_BOOKS_API}?q=isbn:${cleanISBN}`
    );

    if (!response.ok) {
      throw new Error('Google Books API error');
    }

    const data = await response.json();

    if (!data.items || data.items.length === 0) {
      return null;
    }

    const book = data.items[0].volumeInfo;

    // Map Google Books data to our format
    return {
      title: book.title || '',
      author: book.authors?.[0] || '',
      isbn: cleanISBN,
      category: book.categories?.[0] || '',
      coverUrl: book.imageLinks?.thumbnail?.replace('http:', 'https:') || '',
      pages: book.pageCount || null,
      publisher: book.publisher || '',
      publishYear: book.publishedDate ? parseInt(book.publishedDate.split('-')[0]) : null,
      notes: book.description || '',
      status: 'not_started',
      rating: 0,
    };
  } catch (error) {
    console.error('Error fetching book from ISBN:', error);
    return null;
  }
}

/**
 * Search books by title or author
 * @param {string} query
 * @returns {Promise<Array>}
 */
export async function searchBooks(query) {
  try {
    const response = await fetch(
      `${GOOGLE_BOOKS_API}?q=${encodeURIComponent(query)}&maxResults=10`
    );

    if (!response.ok) {
      throw new Error('Google Books API error');
    }

    const data = await response.json();

    if (!data.items) {
      return [];
    }

    return data.items.map(item => {
      const book = item.volumeInfo;
      return {
        title: book.title || '',
        author: book.authors?.[0] || '',
        isbn: book.industryIdentifiers?.find(id => id.type.includes('ISBN'))?.identifier || '',
        category: book.categories?.[0] || '',
        coverUrl: book.imageLinks?.thumbnail?.replace('http:', 'https:') || '',
        pages: book.pageCount || null,
        publisher: book.publisher || '',
        publishYear: book.publishedDate ? parseInt(book.publishedDate.split('-')[0]) : null,
      };
    });
  } catch (error) {
    console.error('Error searching books:', error);
    return [];
  }
}

export default {
  searchBookByISBN,
  searchBooks,
};
