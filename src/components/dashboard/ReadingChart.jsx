/**
 * ReadingChart Component
 * Chart showing books read over time
 */

import { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import Card from '../ui/Card';
import { bookService } from '../../lib/db';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

export const BooksPerMonthChart = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      const stats = await bookService.getStats();
      const { booksPerMonth } = stats;

      // Get last 12 months
      const months = Object.keys(booksPerMonth).slice(-12);
      const values = months.map((month) => booksPerMonth[month]);

      setChartData({
        labels: months,
        datasets: [
          {
            label: 'Libri letti',
            data: values,
            backgroundColor: 'rgba(99, 102, 241, 0.8)',
            borderColor: 'rgba(99, 102, 241, 1)',
            borderWidth: 1,
            borderRadius: 6,
          },
        ],
      });
    };

    loadData();
  }, []);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        borderRadius: 8,
        titleFont: {
          size: 14,
        },
        bodyFont: {
          size: 13,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  if (!chartData) return null;

  return (
    <Card>
      <Card.Header>
        <Card.Title>Libri letti per mese</Card.Title>
      </Card.Header>
      <Card.Content>
        <div className="h-64">
          <Bar data={chartData} options={options} />
        </div>
      </Card.Content>
    </Card>
  );
};

export const ReadingStatusChart = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      const stats = await bookService.getStats();

      setChartData({
        labels: ['Da leggere', 'In lettura', 'Letti'],
        datasets: [
          {
            data: [stats.toRead, stats.reading, stats.read],
            backgroundColor: [
              'rgba(156, 163, 175, 0.8)', // gray
              'rgba(251, 191, 36, 0.8)',  // yellow
              'rgba(34, 197, 94, 0.8)',   // green
            ],
            borderColor: [
              'rgba(156, 163, 175, 1)',
              'rgba(251, 191, 36, 1)',
              'rgba(34, 197, 94, 1)',
            ],
            borderWidth: 2,
          },
        ],
      });
    };

    loadData();
  }, []);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        borderRadius: 8,
        titleFont: {
          size: 14,
        },
        bodyFont: {
          size: 13,
        },
      },
    },
  };

  if (!chartData) return null;

  return (
    <Card>
      <Card.Header>
        <Card.Title>Stato di lettura</Card.Title>
      </Card.Header>
      <Card.Content>
        <div className="h-64 flex items-center justify-center">
          <Doughnut data={chartData} options={options} />
        </div>
      </Card.Content>
    </Card>
  );
};

export const RatingDistributionChart = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      const stats = await bookService.getStats();
      const { ratingDistribution } = stats;

      setChartData({
        labels: ['★', '★★', '★★★', '★★★★', '★★★★★'],
        datasets: [
          {
            label: 'Numero di libri',
            data: [
              ratingDistribution[1],
              ratingDistribution[2],
              ratingDistribution[3],
              ratingDistribution[4],
              ratingDistribution[5],
            ],
            backgroundColor: 'rgba(251, 191, 36, 0.8)',
            borderColor: 'rgba(251, 191, 36, 1)',
            borderWidth: 1,
            borderRadius: 6,
          },
        ],
      });
    };

    loadData();
  }, []);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        borderRadius: 8,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  if (!chartData) return null;

  return (
    <Card>
      <Card.Header>
        <Card.Title>Distribuzione valutazioni</Card.Title>
      </Card.Header>
      <Card.Content>
        <div className="h-64">
          <Bar data={chartData} options={options} />
        </div>
      </Card.Content>
    </Card>
  );
};
