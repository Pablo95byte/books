/**
 * BookGrid Component
 * Grid layout for books with pagination
 */

import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import BookCard from './BookCard';
import EmptyState from '../ui/EmptyState';
import Button from '../ui/Button';
import Spinner from '../ui/Spinner';
import useStore from '../../store/useStore';

const BookGrid = () => {
  const navigate = useNavigate();
  const {
    isLoading,
    getPaginatedBooks,
    setPage,
    openModal,
  } = useStore();

  const { books, total, totalPages, currentPage } = getPaginatedBooks();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Spinner size="lg" />
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <EmptyState
        title="Nessun libro trovato"
        description="Prova a modificare i filtri o aggiungi un nuovo libro alla tua libreria"
        onAction={() => openModal('addBook')}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Mostrando <span className="font-semibold">{books.length}</span> di{' '}
          <span className="font-semibold">{total}</span> libri
        </p>
      </div>

      {/* Books Grid */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        layout
      >
          {books.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onClick={() => navigate(`/book/${book.id}`)}
            />
          ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setPage(currentPage - 1)}
            disabled={currentPage === 1}
            icon={<ChevronLeft className="w-4 h-4" />}
          >
            Precedente
          </Button>

          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
              // Show first, last, current, and adjacent pages
              if (
                page === 1 ||
                page === totalPages ||
                Math.abs(page - currentPage) <= 1
              ) {
                return (
                  <button
                    key={page}
                    onClick={() => setPage(page)}
                    className={`
                      min-w-[40px] h-10 px-3 rounded-lg font-medium transition-all
                      ${
                        page === currentPage
                          ? 'bg-primary-600 text-white shadow-md'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }
                    `}
                  >
                    {page}
                  </button>
                );
              } else if (Math.abs(page - currentPage) === 2) {
                return (
                  <span key={page} className="px-2 text-gray-400">
                    ...
                  </span>
                );
              }
              return null;
            })}
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            icon={<ChevronRight className="w-4 h-4" />}
          >
            Successivo
          </Button>
        </div>
      )}
    </div>
  );
};

export default BookGrid;
