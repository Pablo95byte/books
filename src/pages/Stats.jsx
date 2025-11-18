/**
 * Stats Page
 * Detailed statistics and charts
 */

import { useEffect, useState } from 'react';
import {
  BookOpen,
  BookCheck,
  Star,
  TrendingUp,
  Calendar,
  Target,
} from 'lucide-react';
import StatsCard from '../components/dashboard/StatsCard';
import {
  BooksPerMonthChart,
  ReadingStatusChart,
  RatingDistributionChart,
} from '../components/dashboard/ReadingChart';
import Card from '../components/ui/Card';
import { bookService } from '../lib/db';

const Stats = () => {
  const [stats, setStats] = useState(null);
  const [topCategories, setTopCategories] = useState([]);

  useEffect(() => {
    const loadStats = async () => {
      const statsData = await bookService.getStats();
      setStats(statsData);

      // Get top categories
      const categories = Object.entries(statsData.topCategories)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5);
      setTopCategories(categories);
    };

    loadStats();
  }, []);

  if (!stats) return null;

  return (
    <div
      className="space-y-8"
    >
      {/* Header */}
      <div>
        <h1 className="page-title">📊 Statistiche</h1>
        <p className="page-subtitle">
          Analizza le tue abitudini di lettura
        </p>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatsCard
          title="Totale libri"
          value={stats.total}
          icon={BookOpen}
          color="primary"
        />
        <StatsCard
          title="Libri letti"
          value={stats.read}
          icon={BookCheck}
          color="success"
        />
        <StatsCard
          title="Valutazione media"
          value={stats.avgRating ? `${stats.avgRating}★` : 'N/D'}
          icon={Star}
          color="warning"
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
        />
        <StatsCard
          title="Obiettivo annuale"
          value={`${stats.read} / 50`}
          icon={Target}
          color="primary"
          subtitle={`${Math.round((stats.read / 50) * 100)}% completato`}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ReadingStatusChart />
        <RatingDistributionChart />
      </div>

      <BooksPerMonthChart />

      {/* Top Categories */}
      {topCategories.length > 0 && (
        <Card>
          <Card.Header>
            <Card.Title>Top categorie</Card.Title>
          </Card.Header>
          <Card.Content>
            <div className="space-y-4">
              {topCategories.map(([category, count], index) => (
                <div key={category} className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center font-bold text-primary-600 dark:text-primary-400">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {category}
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {count} {count === 1 ? 'libro' : 'libri'}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-primary-600 h-2 rounded-full transition-all duration-500"
                        style={{
                          width: `${(count / stats.total) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card.Content>
        </Card>
      )}
    </div>
  );
};

export default Stats;
