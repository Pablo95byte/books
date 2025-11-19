/**
 * BookGrid Component
 * Multi-view layout for books with pagination
 */

import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import BookCard from './BookCard';
import EmptyState from '../ui/EmptyState';
import Button from '../ui/Button';
import Spinner from '../ui/Spinner';
import useStore from '../../store/useStore';

const BookGrid = ({ viewMode = 'grid' }) => {
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

  // Render status badge
  const getStatusBadge = (status) => {
    const statusConfig = {
      not_started: { label: 'Da leggere', color: '#8b5a2b' },
      reading: { label: 'In lettura', color: '#daa520' },
      finished: { label: 'Letto', color: '#4e6741' }
    };
    const config = statusConfig[status] || statusConfig.not_started;
    return (
      <span style={{
        padding: '2px 8px',
        borderRadius: '3px',
        fontSize: '0.75rem',
        fontFamily: "'Playfair Display', serif",
        fontWeight: 600,
        border: `1px solid ${config.color}`,
        color: config.color,
        background: `${config.color}15`
      }}>
        {config.label}
      </span>
    );
  };

  // Render rating stars
  const renderRating = (rating) => {
    if (!rating) return <span style={{ color: '#c9a962', fontSize: '0.875rem' }}>Non valutato</span>;
    return (
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className="w-4 h-4"
            style={{
              fill: i < rating ? '#daa520' : 'none',
              stroke: '#daa520',
              strokeWidth: 1.5
            }}
          />
        ))}
      </div>
    );
  };

  const renderBooksView = () => {
    switch (viewMode) {
      case 'grid':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {books.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onClick={() => navigate(`/book/${book.id}`)}
              />
            ))}
          </div>
        );

      case 'compact':
        return (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {books.map((book) => (
              <div
                key={book.id}
                onClick={() => navigate(`/book/${book.id}`)}
                className="card-hover cursor-pointer p-3"
              >
                {book.coverUrl && (
                  <img
                    src={book.coverUrl}
                    alt={book.title}
                    className="w-full aspect-[2/3] object-cover rounded mb-2"
                    style={{ border: '1px solid #d4c4a8' }}
                  />
                )}
                <h3 style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#3e2723',
                  marginBottom: '0.25rem',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical'
                }}>
                  {book.title}
                </h3>
                <p style={{
                  fontFamily: "'Crimson Text', serif",
                  fontSize: '0.75rem',
                  color: '#6d4423',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {book.author}
                </p>
              </div>
            ))}
          </div>
        );

      case 'list':
        return (
          <div className="space-y-3">
            {books.map((book) => (
              <div
                key={book.id}
                onClick={() => navigate(`/book/${book.id}`)}
                className="card-hover cursor-pointer p-4"
              >
                <div className="flex gap-4">
                  {book.coverUrl && (
                    <img
                      src={book.coverUrl}
                      alt={book.title}
                      className="w-16 h-24 object-cover rounded flex-shrink-0"
                      style={{ border: '1px solid #d4c4a8' }}
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex-1">
                        <h3 style={{
                          fontFamily: "'Playfair Display', serif",
                          fontSize: '1.125rem',
                          fontWeight: 600,
                          color: '#3e2723',
                          marginBottom: '0.25rem'
                        }}>
                          {book.title}
                        </h3>
                        <p style={{
                          fontFamily: "'Crimson Text', serif",
                          fontSize: '1rem',
                          color: '#6d4423'
                        }}>
                          {book.author}
                        </p>
                      </div>
                      {renderRating(book.rating)}
                    </div>
                    <div className="flex items-center gap-4 flex-wrap">
                      {getStatusBadge(book.status)}
                      {book.category && (
                        <span style={{
                          fontFamily: "'Crimson Text', serif",
                          fontSize: '0.875rem',
                          color: '#8b5a2b'
                        }}>
                          {book.category}
                        </span>
                      )}
                      {book.pages && (
                        <span style={{
                          fontFamily: "'Crimson Text', serif",
                          fontSize: '0.875rem',
                          color: '#8b5a2b'
                        }}>
                          {book.pages} pagine
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );

      case 'table':
        return (
          <div className="overflow-x-auto">
            <table className="w-full" style={{
              fontFamily: "'Crimson Text', serif",
              borderCollapse: 'separate',
              borderSpacing: 0
            }}>
              <thead>
                <tr style={{
                  background: 'linear-gradient(135deg, rgba(201, 169, 98, 0.15) 0%, rgba(218, 165, 32, 0.1) 100%)',
                  border: '2px solid #d4c4a8'
                }}>
                  <th style={{
                    padding: '12px 16px',
                    textAlign: 'left',
                    fontFamily: "'Playfair Display', serif",
                    fontWeight: 600,
                    color: '#5d4037',
                    borderBottom: '2px solid #d4c4a8'
                  }}>Titolo</th>
                  <th style={{
                    padding: '12px 16px',
                    textAlign: 'left',
                    fontFamily: "'Playfair Display', serif",
                    fontWeight: 600,
                    color: '#5d4037',
                    borderBottom: '2px solid #d4c4a8'
                  }}>Autore</th>
                  <th style={{
                    padding: '12px 16px',
                    textAlign: 'left',
                    fontFamily: "'Playfair Display', serif",
                    fontWeight: 600,
                    color: '#5d4037',
                    borderBottom: '2px solid #d4c4a8'
                  }}>Categoria</th>
                  <th style={{
                    padding: '12px 16px',
                    textAlign: 'center',
                    fontFamily: "'Playfair Display', serif",
                    fontWeight: 600,
                    color: '#5d4037',
                    borderBottom: '2px solid #d4c4a8'
                  }}>Stato</th>
                  <th style={{
                    padding: '12px 16px',
                    textAlign: 'center',
                    fontFamily: "'Playfair Display', serif",
                    fontWeight: 600,
                    color: '#5d4037',
                    borderBottom: '2px solid #d4c4a8'
                  }}>Valutazione</th>
                  <th style={{
                    padding: '12px 16px',
                    textAlign: 'center',
                    fontFamily: "'Playfair Display', serif",
                    fontWeight: 600,
                    color: '#5d4037',
                    borderBottom: '2px solid #d4c4a8'
                  }}>Pagine</th>
                </tr>
              </thead>
              <tbody>
                {books.map((book, index) => (
                  <tr
                    key={book.id}
                    onClick={() => navigate(`/book/${book.id}`)}
                    className="cursor-pointer transition-all duration-300"
                    style={{
                      background: index % 2 === 0 ? 'rgba(255, 255, 255, 0.5)' : 'transparent',
                      borderBottom: '1px solid #d4c4a8'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(201, 169, 98, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = index % 2 === 0 ? 'rgba(255, 255, 255, 0.5)' : 'transparent';
                    }}
                  >
                    <td style={{
                      padding: '12px 16px',
                      fontWeight: 600,
                      color: '#3e2723'
                    }}>{book.title}</td>
                    <td style={{
                      padding: '12px 16px',
                      color: '#6d4423'
                    }}>{book.author}</td>
                    <td style={{
                      padding: '12px 16px',
                      color: '#8b5a2b'
                    }}>{book.category || '-'}</td>
                    <td style={{
                      padding: '12px 16px',
                      textAlign: 'center'
                    }}>
                      {getStatusBadge(book.status)}
                    </td>
                    <td style={{
                      padding: '12px 16px',
                      textAlign: 'center'
                    }}>
                      {renderRating(book.rating)}
                    </td>
                    <td style={{
                      padding: '12px 16px',
                      textAlign: 'center',
                      color: '#8b5a2b'
                    }}>{book.pages || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p style={{
          fontFamily: "'Crimson Text', serif",
          fontSize: '0.875rem',
          color: '#6d4423'
        }}>
          Mostrando <span style={{ fontWeight: 600 }}>{books.length}</span> di{' '}
          <span style={{ fontWeight: 600 }}>{total}</span> libri
        </p>
      </div>

      {/* Books View */}
      {renderBooksView()}

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
                    className="min-w-[40px] h-10 px-3 rounded font-medium transition-all duration-300"
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      color: page === currentPage ? '#f5f1e8' : '#5d4037',
                      background: page === currentPage ? 'linear-gradient(135deg, #8b5a2b 0%, #6d4423 100%)' : 'rgba(255, 255, 255, 0.6)',
                      border: `2px solid ${page === currentPage ? '#c9a962' : '#d4c4a8'}`,
                      boxShadow: page === currentPage ? '0 2px 4px rgba(62, 39, 35, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)' : 'none'
                    }}
                    onMouseEnter={(e) => {
                      if (page !== currentPage) {
                        e.currentTarget.style.background = 'rgba(201, 169, 98, 0.15)';
                        e.currentTarget.style.borderColor = '#c9a962';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (page !== currentPage) {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.6)';
                        e.currentTarget.style.borderColor = '#d4c4a8';
                      }
                    }}
                  >
                    {page}
                  </button>
                );
              } else if (Math.abs(page - currentPage) === 2) {
                return (
                  <span key={page} className="px-2" style={{ color: '#c9a962' }}>
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
