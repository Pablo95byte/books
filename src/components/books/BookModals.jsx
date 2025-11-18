/**
 * BookModals Component
 * All modals: Add, Edit, Delete, Import/Export, Scanner, Cloud Backup
 */

import { useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import BookForm from './BookForm';
import ISBNScanner from './ISBNScanner';
import CloudBackup from './CloudBackup';
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
    books,
    isLoading,
  } = useStore();

  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [showScanner, setShowScanner] = useState(false);
  const [scannedBookData, setScannedBookData] = useState(null);

  // Add Book Modal
  const handleAddBook = async (bookData) => {
    try {
      await addBook(bookData);
      closeModal('addBook');
      setScannedBookData(null); // Reset scanned data
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
      const data = JSON.parse(content);

      // Support both old format (array) and new format (object with books array)
      const booksToImport = Array.isArray(data) ? data : data.books;

      if (!Array.isArray(booksToImport)) {
        toast.error('Formato file non valido');
        return;
      }

      await importBooks(booksToImport);
      closeModal('importExport');
    } catch (error) {
      console.error('Error importing books:', error);
      toast.error('Errore durante l\'importazione');
    }
  };

  // Scanner ISBN
  const handleBookFound = (bookData) => {
    setScannedBookData(bookData);
    setShowScanner(false);
    closeModal('importExport'); // Close import/export modal if open

    // Open add book modal with pre-filled data
    setTimeout(() => {
      useStore.getState().openModal('addBook');
    }, 100);
  };

  // Cloud Backup Restore
  const handleCloudRestore = async (restoredBooks) => {
    try {
      await importBooks(restoredBooks);
    } catch (error) {
      console.error('Error restoring from cloud:', error);
      toast.error('Errore durante il ripristino');
    }
  };

  return (
    <>
      {/* Add Book Modal */}
      <Modal
        isOpen={modals.addBook}
        onClose={() => {
          closeModal('addBook');
          setScannedBookData(null);
        }}
        title="Aggiungi nuovo libro"
        size="lg"
      >
        <BookForm
          book={scannedBookData} // Pre-fill with scanned data if available
          onSubmit={handleAddBook}
          onCancel={() => {
            closeModal('addBook');
            setScannedBookData(null);
          }}
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

      {/* Import/Export & Cloud Backup Modal */}
      <Modal
        isOpen={modals.importExport}
        onClose={() => closeModal('importExport')}
        title="Backup & Sincronizzazione Cloud"
        size="lg"
      >
        <div className="space-y-6">
          {/* Local Import/Export */}
          <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
              📤 Backup Locale
            </h3>

            <div className="space-y-3">
              <Button
                variant="primary"
                className="w-full"
                onClick={handleExport}
              >
                Scarica backup (JSON)
              </Button>

              <label className="btn btn-secondary cursor-pointer w-full">
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="hidden"
                />
                Carica backup (JSON)
              </label>
            </div>
          </div>

          {/* Cloud Backup */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
              ☁️ Backup Cloud
            </h3>
            <CloudBackup
              books={books}
              onRestore={handleCloudRestore}
              onClose={() => closeModal('importExport')}
            />
          </div>
        </div>
      </Modal>

      {/* ISBN Scanner */}
      {showScanner && (
        <ISBNScanner
          onBookFound={handleBookFound}
          onClose={() => setShowScanner(false)}
        />
      )}
    </>
  );
};

// Export function to open scanner from outside
export const openScanner = () => {
  const event = new CustomEvent('openScanner');
  window.dispatchEvent(event);
};

// Listen for scanner events
if (typeof window !== 'undefined') {
  window.addEventListener('openScanner', () => {
    const BookModalsInstance = document.querySelector('[data-bookmodals]');
    if (BookModalsInstance) {
      BookModalsInstance.click();
    }
  });
}

export default BookModals;
