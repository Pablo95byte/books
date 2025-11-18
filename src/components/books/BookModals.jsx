/**
 * BookModals Component
 * All modals for book operations (Add, Edit, Delete, Import/Export)
 */

import { useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import BookForm from './BookForm';
import useStore from '../../store/useStore';
import { downloadFile, readFile } from '../../lib/utils';
import toast from 'react-hot-toast';

const BookModals = () => {
  const {
    modals,
    closeModal,
    selectedBook,
    addBook,
    updateBook,
    deleteBook,
    importBooks,
    exportBooks,
    isLoading,
  } = useStore();

  const [deleteConfirm, setDeleteConfirm] = useState('');

  // Add Book Modal
  const handleAddBook = async (bookData) => {
    try {
      await addBook(bookData);
      closeModal('addBook');
    } catch (error) {
      console.error('Error adding book:', error);
    }
  };

  // Edit Book Modal
  const handleEditBook = async (bookData) => {
    try {
      await updateBook(selectedBook.id, bookData);
      closeModal('editBook');
    } catch (error) {
      console.error('Error updating book:', error);
    }
  };

  // Delete Book Modal
  const handleDeleteBook = async () => {
    if (deleteConfirm !== selectedBook?.title) {
      toast.error('Il titolo inserito non corrisponde');
      return;
    }

    try {
      await deleteBook(selectedBook.id);
      closeModal('deleteBook');
      setDeleteConfirm('');
    } catch (error) {
      console.error('Error deleting book:', error);
    }
  };

  // Export Books
  const handleExport = async () => {
    try {
      const json = await exportBooks();
      const filename = `library-backup-${new Date().toISOString().split('T')[0]}.json`;
      downloadFile(json, filename, 'application/json');
      toast.success('Libreria esportata con successo!');
    } catch (error) {
      console.error('Error exporting books:', error);
    }
  };

  // Import Books
  const handleImport = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const content = await readFile(file);
      const books = JSON.parse(content);

      if (!Array.isArray(books)) {
        toast.error('Formato file non valido');
        return;
      }

      await importBooks(books);
      closeModal('importExport');
    } catch (error) {
      console.error('Error importing books:', error);
      toast.error('Errore durante l\'importazione');
    }
  };

  return (
    <>
      {/* Add Book Modal */}
      <Modal
        isOpen={modals.addBook}
        onClose={() => closeModal('addBook')}
        title="Aggiungi nuovo libro"
        size="lg"
      >
        <BookForm
          onSubmit={handleAddBook}
          onCancel={() => closeModal('addBook')}
          isLoading={isLoading}
        />
      </Modal>

      {/* Edit Book Modal */}
      <Modal
        isOpen={modals.editBook}
        onClose={() => closeModal('editBook')}
        title="Modifica libro"
        size="lg"
      >
        <BookForm
          book={selectedBook}
          onSubmit={handleEditBook}
          onCancel={() => closeModal('editBook')}
          isLoading={isLoading}
        />
      </Modal>

      {/* Delete Book Modal */}
      <Modal
        isOpen={modals.deleteBook}
        onClose={() => {
          closeModal('deleteBook');
          setDeleteConfirm('');
        }}
        title="Elimina libro"
        size="md"
        footer={
          <>
            <Button
              variant="ghost"
              onClick={() => {
                closeModal('deleteBook');
                setDeleteConfirm('');
              }}
            >
              Annulla
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteBook}
              loading={isLoading}
              disabled={deleteConfirm !== selectedBook?.title}
            >
              Elimina definitivamente
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-red-800 dark:text-red-200 font-medium mb-2">
              ⚠️ Attenzione: questa azione è irreversibile
            </p>
            <p className="text-red-700 dark:text-red-300 text-sm">
              Stai per eliminare il libro "<strong>{selectedBook?.title}</strong>" di{' '}
              <strong>{selectedBook?.author}</strong>.
            </p>
          </div>

          <div>
            <label className="label">
              Per confermare, digita il titolo del libro:
            </label>
            <input
              type="text"
              value={deleteConfirm}
              onChange={(e) => setDeleteConfirm(e.target.value)}
              placeholder={selectedBook?.title}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>
        </div>
      </Modal>

      {/* Import/Export Modal */}
      <Modal
        isOpen={modals.importExport}
        onClose={() => closeModal('importExport')}
        title="Import / Export"
        size="md"
      >
        <div className="space-y-6">
          {/* Export Section */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
              📤 Esporta libreria
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Scarica tutti i tuoi libri in formato JSON. Potrai usare questo file per
              importare la libreria in futuro o come backup.
            </p>
            <Button variant="primary" onClick={handleExport}>
              Scarica backup (JSON)
            </Button>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700" />

          {/* Import Section */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
              📥 Importa libreria
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Carica un file JSON precedentemente esportato per ripristinare o unire
              la tua libreria.
            </p>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 mb-4">
              <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                ⚠️ L'importazione aggiungerà i libri alla libreria esistente. I duplicati
                verranno gestiti automaticamente.
              </p>
            </div>

            <label className="btn btn-secondary cursor-pointer">
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
              Seleziona file JSON
            </label>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default BookModals;
