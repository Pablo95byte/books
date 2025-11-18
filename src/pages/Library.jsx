/**
 * Library Page
 * Display all books with filters and search
 */

import { SortAsc, SortDesc } from 'lucide-react';
import BookFilters from '../components/books/BookFilters';
import BookGrid from '../components/books/BookGrid';
import Select from '../components/ui/Select';
import useStore from '../store/useStore';

const Library = () => {
  const { sortBy, sortOrder, setSorting } = useStore();

  return (
    <div
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">La mia libreria</h1>
          <p className="page-subtitle">
            Tutti i tuoi libri in un unico posto
          </p>
        </div>
      </div>

      {/* Filters */}
      <BookFilters />

      {/* Sorting */}
      <div className="flex items-center gap-4">
        <Select
          value={sortBy}
          onChange={(e) => setSorting(e.target.value, sortOrder)}
          options={[
            { value: 'dateAdded', label: 'Data aggiunta' },
            { value: 'title', label: 'Titolo' },
            { value: 'author', label: 'Autore' },
            { value: 'rating', label: 'Valutazione' },
            { value: 'dateFinished', label: 'Data fine lettura' },
          ]}
          containerClassName="w-48"
        />

        <button
          onClick={() => setSorting(sortBy, sortOrder === 'asc' ? 'desc' : 'asc')}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="Toggle sort order"
        >
          {sortOrder === 'asc' ? (
            <SortAsc className="w-5 h-5" />
          ) : (
            <SortDesc className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Books Grid */}
      <BookGrid />
    </div>
  );
};

export default Library;
