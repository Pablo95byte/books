/**
 * Navbar Component
 * Top navigation bar with theme toggle and actions
 */

import { Moon, Sun, Menu, Plus, Download, Camera } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import useStore from '../../store/useStore';
import Button from '../ui/Button';
import ISBNScanner from '../books/ISBNScanner';

const Navbar = () => {
  const { theme, toggleTheme, toggleSidebar, openModal, addBook } = useStore();
  const [showScanner, setShowScanner] = useState(false);

  const handleBookFound = async (bookData) => {
    setShowScanner(false);
    // Add book directly from scanner
    try {
      await addBook(bookData);
    } catch (error) {
      console.error('Error adding scanned book:', error);
    }
  };

  return (
    <nav className="sticky top-0 z-30 border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo + Menu */}
          <div className="flex items-center gap-4">
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-600 to-primary-700 flex items-center justify-center">
                <span className="text-white font-bold text-lg">📚</span>
              </div>
              <span className="font-bold text-xl text-gray-900 dark:text-gray-100 hidden sm:block">
                Library Tracker
              </span>
            </Link>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            {/* Scanner ISBN */}
            <Button
              variant="success"
              size="sm"
              onClick={() => setShowScanner(true)}
              icon={<Camera className="w-4 h-4" />}
              className="hidden sm:flex"
            >
              Scansiona
            </Button>

            {/* Add Book */}
            <Button
              variant="primary"
              size="sm"
              onClick={() => openModal('addBook')}
              icon={<Plus className="w-4 h-4" />}
            >
              <span className="hidden sm:inline">Aggiungi</span>
            </Button>

            {/* Import/Export */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => openModal('importExport')}
              icon={<Download className="w-4 h-4" />}
            >
              <span className="hidden md:inline">Backup</span>
            </Button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5" />
              ) : (
                <Sun className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ISBN Scanner */}
      {showScanner && (
        <ISBNScanner
          onBookFound={handleBookFound}
          onClose={() => setShowScanner(false)}
        />
      )}
    </nav>
  );
};

export default Navbar;
