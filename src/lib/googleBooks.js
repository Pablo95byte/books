/**
 * Google Books API Service
 * Fetch book data from ISBN with maximum data extraction
 */

const GOOGLE_BOOKS_API = 'https://www.googleapis.com/books/v1/volumes';

/**
 * Extract all ISBN codes from Google Books data
 * @param {Array} identifiers - Industry identifiers from Google Books
 * @returns {string} Preferred ISBN (13 first, then 10)
 */
function extractISBN(identifiers) {
  if (!identifiers || identifiers.length === 0) return '';

  // Prefer ISBN-13, fallback to ISBN-10
  const isbn13 = identifiers.find(id => id.type === 'ISBN_13');
  const isbn10 = identifiers.find(id => id.type === 'ISBN_10');

  return (isbn13?.identifier || isbn10?.identifier || '').replace(/[-\s]/g, '');
}

/**
 * Get the best quality cover image
 * @param {Object} imageLinks - Image links from Google Books
 * @returns {string} Best quality image URL
 */
function getBestCoverImage(imageLinks) {
  if (!imageLinks) return '';

  // Priority: extraLarge > large > medium > small > thumbnail
  const imageUrl =
    imageLinks.extraLarge ||
    imageLinks.large ||
    imageLinks.medium ||
    imageLinks.small ||
    imageLinks.thumbnail ||
    '';

  // Always use HTTPS and remove zoom parameter for max quality
  return imageUrl
    .replace('http:', 'https:')
    .replace('&zoom=1', '&zoom=0')
    .replace('&edge=curl', ''); // Remove curl effect for cleaner image
}

/**
 * Extract year from various date formats
 * @param {string} dateString - Date from Google Books (YYYY, YYYY-MM, YYYY-MM-DD)
 * @returns {number|null} Year
 */
function extractYear(dateString) {
  if (!dateString) return null;

  const match = dateString.match(/^(\d{4})/);
  return match ? parseInt(match[1]) : null;
}

/**
 * Clean and format description
 * @param {string} description - Raw HTML description from Google Books
 * @returns {string} Clean text description
 */
function cleanDescription(description) {
  if (!description) return '';

  // Remove HTML tags
  return description
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/?[^>]+(>|$)/g, '')
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .trim();
}

/**
 * Search book by ISBN using Google Books API
 * EXTRACTS ALL AVAILABLE DATA!
 * @param {string} isbn - ISBN-10 or ISBN-13
 * @returns {Promise<Object|null>} Complete book data or null
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
      console.warn('No book found for ISBN:', cleanISBN);
      return null;
    }

    const book = data.items[0].volumeInfo;
    const saleInfo = data.items[0].saleInfo;

    // Extract ALL available information
    const bookData = {
      // Basic info
      title: book.title || '',
      subtitle: book.subtitle || '',

      // Authors - join multiple authors with comma
      author: book.authors?.join(', ') || '',

      // ISBN - prefer ISBN-13
      isbn: extractISBN(book.industryIdentifiers) || cleanISBN,

      // Categories - join multiple categories
      category: book.categories?.join(', ') || '',

      // Images - get highest quality available
      coverUrl: getBestCoverImage(book.imageLinks),

      // Publication details
      publisher: book.publisher || '',
      publishYear: extractYear(book.publishedDate),

      // Book details
      pages: book.pageCount || null,
      language: book.language?.toUpperCase() || '',

      // Description - cleaned from HTML
      notes: cleanDescription(book.description),

      // Additional metadata
      maturityRating: book.maturityRating || '',
      contentVersion: book.contentVersion || '',

      // Default values (user will set these)
      status: 'not_started',
      rating: null,

      // Extra info for potential future use (stored in notes if needed)
      _extraInfo: {
        previewLink: book.previewLink || '',
        infoLink: book.infoLink || '',
        canonicalVolumeLink: book.canonicalVolumeLink || '',
        printType: book.printType || '',
        averageRating: book.averageRating || null,
        ratingsCount: book.ratingsCount || null,
        country: saleInfo?.country || '',
        isEbook: saleInfo?.isEbook || false,
      }
    };

    // Log extracted data for debugging
    console.log('📚 Book data extracted from ISBN:', {
      title: bookData.title,
      author: bookData.author,
      pages: bookData.pages,
      publisher: bookData.publisher,
      year: bookData.publishYear,
      categories: bookData.category,
      language: bookData.language,
      hasDescription: !!bookData.notes,
      hasCover: !!bookData.coverUrl
    });

    return bookData;
  } catch (error) {
    console.error('❌ Error fetching book from ISBN:', error);
    return null;
  }
}

/**
 * Search books by title or author
 * EXTRACTS ALL AVAILABLE DATA for each result!
 * @param {string} query - Search query
 * @param {number} maxResults - Maximum results (default 10)
 * @returns {Promise<Array>} Array of complete book data
 */
export async function searchBooks(query, maxResults = 10) {
  try {
    const response = await fetch(
      `${GOOGLE_BOOKS_API}?q=${encodeURIComponent(query)}&maxResults=${maxResults}`
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
      const saleInfo = item.saleInfo;

      return {
        // Basic info
        title: book.title || '',
        subtitle: book.subtitle || '',

        // Authors - all authors joined
        author: book.authors?.join(', ') || '',

        // ISBN - prefer ISBN-13
        isbn: extractISBN(book.industryIdentifiers),

        // Categories - all categories joined
        category: book.categories?.join(', ') || '',

        // Best quality image
        coverUrl: getBestCoverImage(book.imageLinks),

        // Publication details
        publisher: book.publisher || '',
        publishYear: extractYear(book.publishedDate),

        // Book details
        pages: book.pageCount || null,
        language: book.language?.toUpperCase() || '',

        // Description
        notes: cleanDescription(book.description),

        // Ratings from Google
        averageRating: book.averageRating || null,
        ratingsCount: book.ratingsCount || null,

        // Default values
        status: 'not_started',
        rating: null,

        // Extra metadata
        _extraInfo: {
          previewLink: book.previewLink || '',
          infoLink: book.infoLink || '',
          isEbook: saleInfo?.isEbook || false,
        }
      };
    });
  } catch (error) {
    console.error('❌ Error searching books:', error);
    return [];
  }
}

export default {
  searchBookByISBN,
  searchBooks,
};
