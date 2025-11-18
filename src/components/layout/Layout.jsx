/**
 * Layout Component
 * Main app layout wrapper
 */

import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import useStore from '../../store/useStore';
import { setupAutoBackup } from '../../lib/cloudBackup';
import { bookService } from '../../lib/db';

const Layout = () => {
  const { loadBooks, setTheme, theme } = useStore();

  // Load books on mount
  useEffect(() => {
    loadBooks();
  }, [loadBooks]);

  // Apply theme on mount
  useEffect(() => {
    setTheme(theme);
  }, []);

  // Setup auto-backup (runs every 24h)
  useEffect(() => {
    setupAutoBackup(async () => {
      return await bookService.getAll();
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: 'var(--toast-bg)',
            color: 'var(--toast-color)',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />

      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="flex">
        {/* Sidebar */}
        <Sidebar />

        {/* Page Content */}
        <main className="flex-1 min-h-[calc(100vh-64px)]">
          <div className="container-custom py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
