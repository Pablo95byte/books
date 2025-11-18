/**
 * Dashboard Page
 * Main overview with stats and recent books
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BookOpen,
  BookCheck,
  BookMarked,
  Library,
  TrendingUp,
  Star,
} from 'lucide-react';
import StatsCard from '../components/dashboard/StatsCard';
import { ReadingStatusChart, RatingDistributionChart } from '../components/dashboard/ReadingChart';
import BookCard from '../components/books/BookCard';
import Button from '../components/ui/Button';
import useStore from '../store/useStore';
import { bookService } from '../lib/db';

const Dashboard = () => {
  const navigate = useNavigate();
  const { books, openModal } = useStore();
  const [stats, setStats] = useState(null);
  const [recentBooks, setRecentBooks] = useState([]);
  const [currentlyReading, setCurrentlyReading] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const statsData = await bookService.getStats();
      setStats(statsData);

      // Get recent books (last 4 added)
      const allBooks = await bookService.getAll();
      const recent = allBooks
        .sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded))
        .slice(0, 4);
      setRecentBooks(recent);

      // Get currently reading books
      const reading = await bookService.getByStatus('reading');
      setCurrentlyReading(reading.slice(0, 4));
    };

    loadData();
  }, [books]);

  if (!stats) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      {/* Header */}
      <div>
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">
          Benvenuto nella tua libreria personale
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Totale libri"
          value={stats.total}
          icon={Library}
          color="primary"
          subtitle="Nella tua libreria"
        />
        <StatsCard
          title="Libri letti"
          value={stats.read}
          icon={BookCheck}
          color="success"
          subtitle={`${Math.round((stats.read / stats.total) * 100) || 0}% del totale`}
        />
        <StatsCard
          title="In lettura"
          value={stats.reading}
          icon={BookOpen}
          color="warning"
          subtitle="Libri in corso"
        />
        <StatsCard
          title="Da leggere"
          value={stats.toRead}
          icon={BookMarked}
          color="gray"
          subtitle="Nella tua lista"
        />
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Valutazione media"
          value={stats.avgRating ? `${stats.avgRating}★` : 'N/D'}
          icon={Star}
          color="warning"
          subtitle="Dei libri valutati"
        />
        <StatsCard
          title="Tempo medio lettura"
          value={stats.avgReadingTime || 'N/D'}
          icon={TrendingUp}
          color="primary"
          subtitle={stats.avgReadingTime ? 'giorni per libro' : ''}
        />
        <StatsCard
          title="Pagine totali"
          value={stats.totalPages.toLocaleString()}
          icon={BookOpen}
          color="success"
          subtitle="Pagine lette"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ReadingStatusChart />
        <RatingDistributionChart />
      </div>

      {/* Currently Reading */}
      {currentlyReading.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              📖 In lettura ora
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/library?status=reading')}
            >
              Vedi tutti
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {currentlyReading.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onClick={() => navigate(`/book/${book.id}`)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Recent Books */}
      {recentBooks.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              🆕 Aggiunti di recente
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/library')}
            >
              Vedi tutti
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentBooks.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onClick={() => navigate(`/book/${book.id}`)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {stats.total === 0 && (
        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center">
            <Library className="w-12 h-12 text-primary-600 dark:text-primary-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            La tua libreria è vuota
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
            Inizia ad aggiungere i tuoi libri preferiti per tenere traccia delle tue
            letture e scoprire nuove statistiche interessanti!
          </p>
          <Button onClick={() => openModal('addBook')}>
            Aggiungi il tuo primo libro
          </Button>
        </div>
      )}
    </motion.div>
  );
};

export default Dashboard;
