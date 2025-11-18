/**
 * BookFilters Component
 * Search and filter controls for books
 */

import { useState, useEffect } from 'react';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import useStore from '../../store/useStore';
import { bookService } from '../../lib/db';
import { debounce } from '../../lib/utils';

const BookFilters = () => {
  const { filters, setFilters, resetFilters } = useStore();
  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  // Load categories and authors
  useEffect(() => {
    const loadOptions = async () => {
      const cats = await bookService.getCategories();
      const auths = await bookService.getAuthors();
      setCategories(cats);
      setAuthors(auths);
    };
    loadOptions();
  }, []);

  // Debounced search
  const handleSearchChange = debounce((value) => {
    setFilters({ search: value });
  }, 300);

  const handleFilterChange = (name, value) => {
    setFilters({ [name]: value });
  };

  const hasActiveFilters = () => {
    return (
      filters.search ||
      filters.status !== 'all' ||
      filters.category !== 'all' ||
      filters.author !== 'all' ||
      filters.rating
    );
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="flex-1">
          <Input
            placeholder="Cerca per titolo, autore o note..."
            defaultValue={filters.search}
            onChange={(e) => handleSearchChange(e.target.value)}
            icon={<Search className="w-4 h-4" />}
          />
        </div>

        <Button
          variant="ghost"
          onClick={() => setShowFilters(!showFilters)}
          icon={<SlidersHorizontal className="w-4 h-4" />}
        >
          Filtri
        </Button>

        {hasActiveFilters() && (
          <Button
            variant="ghost"
            onClick={resetFilters}
            icon={<X className="w-4 h-4" />}
          >
            Reset
          </Button>
        )}
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
          {/* Status Filter */}
          <Select
            label="Stato"
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            options={[
              { value: 'all', label: 'Tutti gli stati' },
              { value: 'not_started', label: 'Da leggere' },
              { value: 'reading', label: 'In lettura' },
              { value: 'finished', label: 'Letti' },
            ]}
          />

          {/* Category Filter */}
          <Select
            label="Categoria"
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            options={[
              { value: 'all', label: 'Tutte le categorie' },
              ...categories.map((cat) => ({ value: cat, label: cat })),
            ]}
          />

          {/* Author Filter */}
          <Select
            label="Autore"
            value={filters.author}
            onChange={(e) => handleFilterChange('author', e.target.value)}
            options={[
              { value: 'all', label: 'Tutti gli autori' },
              ...authors.map((author) => ({ value: author, label: author })),
            ]}
          />

          {/* Rating Filter */}
          <Select
            label="Valutazione"
            value={filters.rating || ''}
            onChange={(e) =>
              handleFilterChange('rating', e.target.value ? parseInt(e.target.value) : null)
            }
            options={[
              { value: '', label: 'Tutte le valutazioni' },
              { value: '5', label: '★★★★★ (5)' },
              { value: '4', label: '★★★★☆ (4)' },
              { value: '3', label: '★★★☆☆ (3)' },
              { value: '2', label: '★★☆☆☆ (2)' },
              { value: '1', label: '★☆☆☆☆ (1)' },
            ]}
          />
        </div>
      )}
    </div>
  );
};

export default BookFilters;
