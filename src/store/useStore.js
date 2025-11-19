/**
 * Zustand Store - Global State Management
 *
 * This store manages:
 * - Books collection and CRUD operations
 * - UI state (theme, filters, modals)
 * - User preferences
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { bookService } from '../lib/db';
import toast from 'react-hot-toast';

const useStore = create(
  persist(
    (set, get) => ({
      // ============================================
      // BOOKS STATE
      // ============================================
      books: [],
      isLoading: false,
      error: null,

      // ============================================
      // UI STATE
      // ============================================
      theme: 'light',
      sidebarOpen: true,

      // View Mode: 'grid' | 'compact' | 'list' | 'table'
      viewMode: 'grid',

      // Filters
      filters: {
        search: '',
        status: 'all',
        category: 'all',
        author: 'all',
        rating: null,
      },

      // Sorting
      sortBy: 'dateAdded',
      sortOrder: 'desc',

      // Pagination
      currentPage: 1,
      itemsPerPage: 12,

      // Modals
      modals: {
        addBook: false,
        editBook: false,
        deleteBook: false,
        importExport: false,
      },

      selectedBook: null,

      // ============================================
      // BOOKS ACTIONS
      // ============================================

      /**
       * Load all books from database
       */
      loadBooks: async () => {
        set({ isLoading: true, error: null });
        try {
          const books = await bookService.getAll();
          set({ books, isLoading: false });
        } catch (error) {
          console.error('Error loading books:', error);
          set({ error: error.message, isLoading: false });
          toast.error('Errore nel caricamento dei libri');
        }
      },

      /**
       * Add a new book
       */
      addBook: async (book) => {
        set({ isLoading: true, error: null });
        try {
          const id = await bookService.add(book);
          const newBook = await bookService.getById(id);
          set(state => ({
            books: [...state.books, newBook],
            isLoading: false,
          }));
          toast.success('Libro aggiunto con successo!');
          return id;
        } catch (error) {
          console.error('Error adding book:', error);
          set({ error: error.message, isLoading: false });
          toast.error('Errore nell\'aggiunta del libro');
          throw error;
        }
      },

      /**
       * Update an existing book
       */
      updateBook: async (id, updates) => {
        set({ isLoading: true, error: null });
        try {
          await bookService.update(id, updates);
          set(state => ({
            books: state.books.map(book =>
              book.id === id ? { ...book, ...updates } : book
            ),
            isLoading: false,
          }));
          toast.success('Libro aggiornato!');
        } catch (error) {
          console.error('Error updating book:', error);
          set({ error: error.message, isLoading: false });
          toast.error('Errore nell\'aggiornamento del libro');
          throw error;
        }
      },

      /**
       * Delete a book
       */
      deleteBook: async (id) => {
        set({ isLoading: true, error: null });
        try {
          await bookService.delete(id);
          set(state => ({
            books: state.books.filter(book => book.id !== id),
            isLoading: false,
          }));
          toast.success('Libro eliminato');
        } catch (error) {
          console.error('Error deleting book:', error);
          set({ error: error.message, isLoading: false });
          toast.error('Errore nell\'eliminazione del libro');
          throw error;
        }
      },

      /**
       * Import books from JSON
       */
      importBooks: async (booksData) => {
        set({ isLoading: true, error: null });
        try {
          // Clear existing books (optional - you might want to merge instead)
          // await bookService.clear();

          // Import new books
          await bookService.bulkImport(booksData);

          // Reload books
          const books = await bookService.getAll();
          set({ books, isLoading: false });

          toast.success(`${booksData.length} libri importati con successo!`);
        } catch (error) {
          console.error('Error importing books:', error);
          set({ error: error.message, isLoading: false });
          toast.error('Errore nell\'importazione');
          throw error;
        }
      },

      /**
       * Export books to JSON
       */
      exportBooks: async () => {
        try {
          const json = await bookService.exportToJSON();
          return json;
        } catch (error) {
          console.error('Error exporting books:', error);
          toast.error('Errore nell\'esportazione');
          throw error;
        }
      },

      // ============================================
      // UI ACTIONS
      // ============================================

      /**
       * Toggle theme
       */
      toggleTheme: () => {
        set(state => {
          const newTheme = state.theme === 'light' ? 'dark' : 'light';

          // Update document class
          if (newTheme === 'dark') {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }

          return { theme: newTheme };
        });
      },

      /**
       * Set theme explicitly
       */
      setTheme: (theme) => {
        if (theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        set({ theme });
      },

      /**
       * Toggle sidebar
       */
      toggleSidebar: () => {
        set(state => ({ sidebarOpen: !state.sidebarOpen }));
      },

      /**
       * Set view mode
       */
      setViewMode: (viewMode) => {
        set({ viewMode });
      },

      /**
       * Set filters
       */
      setFilters: (filters) => {
        set(state => ({
          filters: { ...state.filters, ...filters },
          currentPage: 1, // Reset to first page when filtering
        }));
      },

      /**
       * Reset filters
       */
      resetFilters: () => {
        set({
          filters: {
            search: '',
            status: 'all',
            category: 'all',
            author: 'all',
            rating: null,
          },
          currentPage: 1,
        });
      },

      /**
       * Set sorting
       */
      setSorting: (sortBy, sortOrder) => {
        set({ sortBy, sortOrder });
      },

      /**
       * Set pagination
       */
      setPage: (page) => {
        set({ currentPage: page });
      },

      setItemsPerPage: (itemsPerPage) => {
        set({ itemsPerPage, currentPage: 1 });
      },

      /**
       * Modal actions
       */
      openModal: (modalName, book = null) => {
        set(state => ({
          modals: { ...state.modals, [modalName]: true },
          selectedBook: book,
        }));
      },

      closeModal: (modalName) => {
        set(state => ({
          modals: { ...state.modals, [modalName]: false },
          selectedBook: null,
        }));
      },

      closeAllModals: () => {
        set({
          modals: {
            addBook: false,
            editBook: false,
            deleteBook: false,
            importExport: false,
          },
          selectedBook: null,
        });
      },

      /**
       * Set selected book
       */
      setSelectedBook: (book) => {
        set({ selectedBook: book });
      },

      // ============================================
      // COMPUTED / SELECTORS
      // ============================================

      /**
       * Get filtered and sorted books
       */
      getFilteredBooks: () => {
        const { books, filters, sortBy, sortOrder } = get();

        let filtered = [...books];

        // Apply search filter
        if (filters.search) {
          const query = filters.search.toLowerCase();
          filtered = filtered.filter(
            book =>
              book.title.toLowerCase().includes(query) ||
              book.author.toLowerCase().includes(query) ||
              (book.notes && book.notes.toLowerCase().includes(query))
          );
        }

        // Apply status filter
        if (filters.status && filters.status !== 'all') {
          filtered = filtered.filter(book => book.status === filters.status);
        }

        // Apply category filter
        if (filters.category && filters.category !== 'all') {
          filtered = filtered.filter(book => book.category === filters.category);
        }

        // Apply author filter
        if (filters.author && filters.author !== 'all') {
          filtered = filtered.filter(book => book.author === filters.author);
        }

        // Apply rating filter
        if (filters.rating) {
          filtered = filtered.filter(book => book.rating === parseInt(filters.rating));
        }

        // Apply sorting
        filtered.sort((a, b) => {
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

          if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
          if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
          return 0;
        });

        return filtered;
      },

      /**
       * Get paginated books
       */
      getPaginatedBooks: () => {
        const { getFilteredBooks, currentPage, itemsPerPage } = get();
        const filtered = getFilteredBooks();

        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;

        return {
          books: filtered.slice(startIndex, endIndex),
          total: filtered.length,
          totalPages: Math.ceil(filtered.length / itemsPerPage),
          currentPage,
        };
      },

      /**
       * Get statistics
       */
      getStats: () => {
        const { books } = get();

        return {
          total: books.length,
          read: books.filter(b => b.status === 'finished').length,
          reading: books.filter(b => b.status === 'reading').length,
          toRead: books.filter(b => b.status === 'not_started').length,
        };
      },
    }),
    {
      name: 'library-tracker-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        theme: state.theme,
        sidebarOpen: state.sidebarOpen,
        viewMode: state.viewMode,
        filters: state.filters,
        sortBy: state.sortBy,
        sortOrder: state.sortOrder,
        itemsPerPage: state.itemsPerPage,
      }),
    }
  )
);

export default useStore;
