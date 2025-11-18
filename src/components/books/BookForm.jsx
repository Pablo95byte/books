/**
 * BookForm Component
 * Form for adding/editing books
 */

import { useState, useEffect } from 'react';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Textarea from '../ui/Textarea';
import StarRating from '../ui/StarRating';
import Button from '../ui/Button';
import { formatDateForInput, validateISBN } from '../../lib/utils';

const BookForm = ({ book, onSubmit, onCancel, isLoading }) => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    status: 'not_started',
    rating: 0,
    category: '',
    coverUrl: '',
    pages: '',
    notes: '',
    publisher: '',
    publishYear: '',
    dateStarted: '',
    dateFinished: '',
    tags: [],
  });

  const [errors, setErrors] = useState({});

  // Populate form when editing
  useEffect(() => {
    if (book) {
      setFormData({
        ...book,
        dateStarted: book.dateStarted ? formatDateForInput(book.dateStarted) : '',
        dateFinished: book.dateFinished ? formatDateForInput(book.dateFinished) : '',
        tags: book.tags || [],
      });
    }
  }, [book]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleRatingChange = (rating) => {
    setFormData((prev) => ({ ...prev, rating }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Il titolo è obbligatorio';
    }

    if (!formData.author.trim()) {
      newErrors.author = "L'autore è obbligatorio";
    }

    if (formData.isbn && !validateISBN(formData.isbn)) {
      newErrors.isbn = 'ISBN non valido';
    }

    if (formData.pages && formData.pages < 0) {
      newErrors.pages = 'Il numero di pagine deve essere positivo';
    }

    if (formData.publishYear && (formData.publishYear < 0 || formData.publishYear > new Date().getFullYear())) {
      newErrors.publishYear = 'Anno di pubblicazione non valido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) return;

    // Prepare data
    const submitData = {
      ...formData,
      pages: formData.pages ? parseInt(formData.pages) : null,
      publishYear: formData.publishYear ? parseInt(formData.publishYear) : null,
      dateStarted: formData.dateStarted ? new Date(formData.dateStarted) : null,
      dateFinished: formData.dateFinished ? new Date(formData.dateFinished) : null,
    };

    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Title */}
      <Input
        label="Titolo"
        name="title"
        value={formData.title}
        onChange={handleChange}
        error={errors.title}
        required
        placeholder="Inserisci il titolo del libro"
      />

      {/* Author */}
      <Input
        label="Autore"
        name="author"
        value={formData.author}
        onChange={handleChange}
        error={errors.author}
        required
        placeholder="Nome dell'autore"
      />

      {/* ISBN */}
      <Input
        label="ISBN"
        name="isbn"
        value={formData.isbn}
        onChange={handleChange}
        error={errors.isbn}
        placeholder="ISBN-10 o ISBN-13 (opzionale)"
        helperText="Codice ISBN a 10 o 13 cifre"
      />

      {/* Status */}
      <Select
        label="Stato di lettura"
        name="status"
        value={formData.status}
        onChange={handleChange}
        required
        options={[
          { value: 'not_started', label: 'Da leggere' },
          { value: 'reading', label: 'In lettura' },
          { value: 'finished', label: 'Letto' },
        ]}
      />

      {/* Rating */}
      <div className="input-group">
        <label className="label">Valutazione</label>
        <StarRating
          rating={formData.rating}
          onChange={handleRatingChange}
          size="lg"
        />
      </div>

      {/* Category */}
      <Input
        label="Categoria / Genere"
        name="category"
        value={formData.category}
        onChange={handleChange}
        placeholder="es. Fiction, Saggistica, Thriller..."
      />

      {/* Pages */}
      <Input
        label="Numero di pagine"
        name="pages"
        type="number"
        value={formData.pages}
        onChange={handleChange}
        error={errors.pages}
        placeholder="300"
      />

      {/* Publisher */}
      <Input
        label="Editore"
        name="publisher"
        value={formData.publisher}
        onChange={handleChange}
        placeholder="Nome dell'editore"
      />

      {/* Publish Year */}
      <Input
        label="Anno di pubblicazione"
        name="publishYear"
        type="number"
        value={formData.publishYear}
        onChange={handleChange}
        error={errors.publishYear}
        placeholder="2023"
      />

      {/* Cover URL */}
      <Input
        label="URL copertina"
        name="coverUrl"
        type="url"
        value={formData.coverUrl}
        onChange={handleChange}
        placeholder="https://example.com/cover.jpg"
        helperText="Link diretto all'immagine di copertina"
      />

      {/* Date Started */}
      {(formData.status === 'reading' || formData.status === 'finished') && (
        <Input
          label="Data di inizio lettura"
          name="dateStarted"
          type="date"
          value={formData.dateStarted}
          onChange={handleChange}
        />
      )}

      {/* Date Finished */}
      {formData.status === 'finished' && (
        <Input
          label="Data di fine lettura"
          name="dateFinished"
          type="date"
          value={formData.dateFinished}
          onChange={handleChange}
        />
      )}

      {/* Notes */}
      <Textarea
        label="Note e opinioni personali"
        name="notes"
        value={formData.notes}
        onChange={handleChange}
        placeholder="Scrivi qui le tue note, opinioni o riflessioni su questo libro..."
        rows={5}
      />

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-4">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Annulla
        </Button>
        <Button type="submit" variant="primary" loading={isLoading}>
          {book ? 'Aggiorna libro' : 'Aggiungi libro'}
        </Button>
      </div>
    </form>
  );
};

export default BookForm;
