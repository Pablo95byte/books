/**
 * BookDetail Page
 * Detailed view of a single book
 */

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Edit2,
  Trash2,
  BookOpen,
  Calendar,
  User,
  Building,
  Hash,
  Tag,
} from 'lucide-react';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import StarRating from '../components/ui/StarRating';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import useStore from '../store/useStore';
import { bookService } from '../lib/db';
import {
  getStatusLabel,
  getStatusColor,
  formatDate,
  calculateReadingDays,
} from '../lib/utils';

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { openModal, setSelectedBook } = useStore();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBook = async () => {
      try {
        const bookData = await bookService.getById(parseInt(id));
        if (!bookData) {
          navigate('/library');
          return;
        }
        setBook(bookData);
      } catch (error) {
        console.error('Error loading book:', error);
        navigate('/library');
      } finally {
        setLoading(false);
      }
    };

    loadBook();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!book) {
    return null;
  }

  const readingDays = calculateReadingDays(book.dateStarted, book.dateFinished);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 max-w-5xl mx-auto"
    >
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        icon={<ArrowLeft className="w-4 h-4" />}
      >
        Indietro
      </Button>

      {/* Book Header */}
      <Card>
        <Card.Content className="p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Book Cover */}
            <div className="md:col-span-1">
              <div className="relative aspect-[2/3] bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl overflow-hidden shadow-soft-lg">
                {book.coverUrl ? (
                  <img
                    src={book.coverUrl}
                    alt={book.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <BookOpen className="w-24 h-24 text-white/50" />
                  </div>
                )}
              </div>
            </div>

            {/* Book Info */}
            <div className="md:col-span-2 space-y-4">
              <div>
                <div className="flex items-start justify-between mb-2">
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100">
                    {book.title}
                  </h1>
                  <Badge variant={getStatusColor(book.status)}>
                    {getStatusLabel(book.status)}
                  </Badge>
                </div>

                <p className="text-xl text-gray-600 dark:text-gray-400">
                  di {book.author}
                </p>
              </div>

              {/* Rating */}
              {book.rating && (
                <div>
                  <StarRating rating={book.rating} readonly size="lg" />
                </div>
              )}

              {/* Category */}
              {book.category && (
                <div>
                  <Badge variant="primary">{book.category}</Badge>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Button
                  variant="primary"
                  onClick={() => {
                    setSelectedBook(book);
                    openModal('editBook', book);
                  }}
                  icon={<Edit2 className="w-4 h-4" />}
                >
                  Modifica
                </Button>
                <Button
                  variant="danger"
                  onClick={() => {
                    setSelectedBook(book);
                    openModal('deleteBook', book);
                  }}
                  icon={<Trash2 className="w-4 h-4" />}
                >
                  Elimina
                </Button>
              </div>
            </div>
          </div>
        </Card.Content>
      </Card>

      {/* Book Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Notes */}
          {book.notes && (
            <Card>
              <Card.Header>
                <Card.Title>Note personali</Card.Title>
              </Card.Header>
              <Card.Content>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {book.notes}
                </p>
              </Card.Content>
            </Card>
          )}

          {/* Reading Info */}
          {(book.dateStarted || book.dateFinished) && (
            <Card>
              <Card.Header>
                <Card.Title>Informazioni di lettura</Card.Title>
              </Card.Header>
              <Card.Content className="space-y-3">
                {book.dateStarted && (
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Data inizio
                      </p>
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        {formatDate(book.dateStarted)}
                      </p>
                    </div>
                  </div>
                )}

                {book.dateFinished && (
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Data fine
                      </p>
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        {formatDate(book.dateFinished)}
                      </p>
                    </div>
                  </div>
                )}

                {readingDays > 0 && (
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Tempo di lettura
                      </p>
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        {readingDays} giorni
                      </p>
                    </div>
                  </div>
                )}
              </Card.Content>
            </Card>
          )}
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <Card>
            <Card.Header>
              <Card.Title>Dettagli</Card.Title>
            </Card.Header>
            <Card.Content className="space-y-3">
              {book.author && (
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Autore</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {book.author}
                    </p>
                  </div>
                </div>
              )}

              {book.isbn && (
                <div className="flex items-start gap-3">
                  <Hash className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">ISBN</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100 font-mono text-sm">
                      {book.isbn}
                    </p>
                  </div>
                </div>
              )}

              {book.publisher && (
                <div className="flex items-start gap-3">
                  <Building className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Editore</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {book.publisher}
                    </p>
                  </div>
                </div>
              )}

              {book.publishYear && (
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Anno pubblicazione
                    </p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {book.publishYear}
                    </p>
                  </div>
                </div>
              )}

              {book.pages && (
                <div className="flex items-start gap-3">
                  <BookOpen className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Pagine</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {book.pages}
                    </p>
                  </div>
                </div>
              )}

              {book.category && (
                <div className="flex items-start gap-3">
                  <Tag className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Categoria</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {book.category}
                    </p>
                  </div>
                </div>
              )}
            </Card.Content>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default BookDetail;
