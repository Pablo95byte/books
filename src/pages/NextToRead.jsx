/**
 * NextToRead Page
 * Display books marked as "to read"
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookMarked } from 'lucide-react';
import BookCard from '../components/books/BookCard';
import EmptyState from '../components/ui/EmptyState';
import Spinner from '../components/ui/Spinner';
import useStore from '../store/useStore';
import { bookService } from '../lib/db';

const NextToRead = () => {
  const navigate = useNavigate();
  const { books, openModal, isLoading } = useStore();
  const [toReadBooks, setToReadBooks] = useState([]);

  useEffect(() => {
    const loadToReadBooks = async () => {
      const books = await bookService.getByStatus('not_started');
      // Sort by date added (newest first)
      books.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
      setToReadBooks(books);
    };

    loadToReadBooks();
  }, [books]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h1 className="page-title">📚 Prossime letture</h1>
        <p className="page-subtitle">
          {toReadBooks.length > 0
            ? `${toReadBooks.length} libri in attesa di essere letti`
            : 'La tua lista è vuota'}
        </p>
      </div>

      {/* Books Grid */}
      {toReadBooks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {toReadBooks.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onClick={() => navigate(`/book/${book.id}`)}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={BookMarked}
          title="Nessun libro in lista"
          description="Aggiungi libri che desideri leggere in futuro per tenere traccia delle tue prossime letture"
          onAction={() => openModal('addBook')}
          actionLabel="Aggiungi libro"
        />
      )}
    </div>
  );
};

export default NextToRead;
