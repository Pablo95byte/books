/**
 * Library Page
 * Display all books with filters and search
 */

import { SortAsc, SortDesc, Grid, Grid3x3, List, Table } from 'lucide-react';
import BookFilters from '../components/books/BookFilters';
import BookGrid from '../components/books/BookGrid';
import Select from '../components/ui/Select';
import useStore from '../store/useStore';

const Library = () => {
  const { sortBy, sortOrder, setSorting, viewMode, setViewMode } = useStore();

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

      {/* Sorting and View Controls */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
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
            className="p-2 rounded transition-all duration-300"
            style={{
              color: '#5d4037',
              border: '2px solid transparent'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(201, 169, 98, 0.1)';
              e.currentTarget.style.borderColor = '#c9a962';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.borderColor = 'transparent';
            }}
            aria-label="Toggle sort order"
          >
            {sortOrder === 'asc' ? (
              <SortAsc className="w-5 h-5" />
            ) : (
              <SortDesc className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* View Mode Selector */}
        <div className="flex items-center gap-1 p-1" style={{
          background: 'rgba(255, 255, 255, 0.6)',
          border: '2px solid #d4c4a8',
          borderRadius: '6px'
        }}>
          {[
            { mode: 'grid', icon: Grid, label: 'Griglia' },
            { mode: 'compact', icon: Grid3x3, label: 'Compatta' },
            { mode: 'list', icon: List, label: 'Lista' },
            { mode: 'table', icon: Table, label: 'Tabella' }
          ].map(({ mode, icon: Icon, label }) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className="p-2 rounded transition-all duration-300"
              style={{
                color: viewMode === mode ? '#f5f1e8' : '#5d4037',
                background: viewMode === mode ? 'linear-gradient(135deg, #8b5a2b 0%, #6d4423 100%)' : 'transparent',
                border: viewMode === mode ? '2px solid #c9a962' : '2px solid transparent',
                boxShadow: viewMode === mode ? '0 2px 4px rgba(62, 39, 35, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)' : 'none'
              }}
              onMouseEnter={(e) => {
                if (viewMode !== mode) {
                  e.currentTarget.style.background = 'rgba(201, 169, 98, 0.15)';
                }
              }}
              onMouseLeave={(e) => {
                if (viewMode !== mode) {
                  e.currentTarget.style.background = 'transparent';
                }
              }}
              title={label}
              aria-label={label}
            >
              <Icon className="w-5 h-5" />
            </button>
          ))}
        </div>
      </div>

      {/* Books Display */}
      <BookGrid viewMode={viewMode} />
    </div>
  );
};

export default Library;
