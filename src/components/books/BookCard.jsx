/**
 * BookCard Component
 * Display a book in card format
 */

import { Edit2, Trash2, Calendar, BookOpen } from 'lucide-react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import StarRating from '../ui/StarRating';
import useStore from '../../store/useStore';
import {
  getStatusLabel,
  getStatusColor,
  formatDateShort,
  truncate,
} from '../../lib/utils';

const BookCard = ({ book, onClick }) => {
  const { openModal, setSelectedBook } = useStore();

  const handleEdit = (e) => {
    e.stopPropagation();
    setSelectedBook(book);
    openModal('editBook', book);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    setSelectedBook(book);
    openModal('deleteBook', book);
  };

  return (
    <div
    >
      <Card hover onClick={onClick} className="h-full flex flex-col overflow-hidden group">
        {/* Book Cover */}
        <div className="relative h-48 bg-gradient-to-br from-primary-400 to-primary-600 overflow-hidden">
          {book.coverUrl ? (
            <img
              src={book.coverUrl}
              alt={book.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <BookOpen className="w-16 h-16 text-white/50" />
            </div>
          )}

          {/* Overlay with actions */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
            <button
              onClick={handleEdit}
              className="p-2 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Edit book"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleDelete}
              className="p-2 bg-white dark:bg-gray-800 rounded-lg hover:bg-red-50 dark:hover:bg-red-900 text-red-600 transition-colors"
              aria-label="Delete book"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Status Badge */}
          <div className="absolute top-2 right-2">
            <Badge variant={getStatusColor(book.status)} size="sm">
              {getStatusLabel(book.status)}
            </Badge>
          </div>
        </div>

        {/* Book Info */}
        <Card.Content className="flex-1 flex flex-col">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1 line-clamp-2">
            {book.title}
          </h3>

          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            {book.author}
          </p>

          {/* Rating */}
          {book.rating && (
            <div className="mb-3">
              <StarRating rating={book.rating} readonly size="sm" />
            </div>
          )}

          {/* Category */}
          {book.category && (
            <div className="mb-3">
              <Badge variant="gray" size="sm">
                {book.category}
              </Badge>
            </div>
          )}

          {/* Notes Preview */}
          {book.notes && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">
              {truncate(book.notes, 80)}
            </p>
          )}

          {/* Meta Info */}
          <div className="mt-auto pt-3 border-t border-gray-200 dark:border-gray-700 space-y-1 text-xs text-gray-500 dark:text-gray-400">
            {book.pages && (
              <div className="flex items-center gap-1">
                <BookOpen className="w-3 h-3" />
                <span>{book.pages} pagine</span>
              </div>
            )}

            {book.dateFinished && (
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>Finito: {formatDateShort(book.dateFinished)}</span>
              </div>
            )}

            {book.status === 'reading' && book.dateStarted && (
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>Iniziato: {formatDateShort(book.dateStarted)}</span>
              </div>
            )}
          </div>
        </Card.Content>
      </Card>
    </div>
  );
};

export default BookCard;
