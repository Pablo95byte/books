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
    <nav className="sticky top-0 z-30 backdrop-blur-sm" style={{
      borderBottom: '2px solid #d4c4a8',
      background: 'rgba(255, 255, 255, 0.95)',
      boxShadow: '0 2px 8px rgba(62, 39, 35, 0.08)'
    }}>
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo + Menu */}
          <div className="flex items-center gap-4">
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-2 rounded hover:bg-vintage-cream dark:hover:bg-vintage-brownDark transition-colors"
              style={{ color: '#5d4037' }}
              aria-label="Toggle sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded flex items-center justify-center" style={{
                background: 'linear-gradient(135deg, #8b5a2b 0%, #6d4423 100%)',
                border: '2px solid #c9a962',
                boxShadow: '0 2px 4px rgba(62, 39, 35, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
              }}>
                <span className="text-2xl">📚</span>
              </div>
              <span className="font-bold text-xl hidden sm:block" style={{
                fontFamily: "'Playfair Display', serif",
                color: '#3e2723',
                letterSpacing: '0.02em'
              }}>
                Bibliothèque
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
            >
              <span className="hidden sm:inline">Scansiona</span>
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
              className="p-2 rounded transition-all duration-300"
              style={{
                color: '#5d4037',
                border: '2px solid transparent',
                ...(theme === 'dark' ? {
                  background: 'rgba(45, 36, 22, 0.6)',
                  borderColor: '#8b5a2b'
                } : {})
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(201, 169, 98, 0.15)';
                e.currentTarget.style.borderColor = '#c9a962';
              }}
              onMouseLeave={(e) => {
                if (theme === 'dark') {
                  e.currentTarget.style.background = 'rgba(45, 36, 22, 0.6)';
                  e.currentTarget.style.borderColor = '#8b5a2b';
                } else {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.borderColor = 'transparent';
                }
              }}
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5" />
              ) : (
                <Sun className="w-5 h-5" style={{ color: '#daa520' }} />
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
