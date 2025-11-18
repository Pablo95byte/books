/**
 * StatsCard Component
 * Display a single statistic with icon
 */

import { motion } from 'framer-motion';
import Card from '../ui/Card';

const StatsCard = ({ title, value, icon: Icon, color = 'primary', trend, subtitle }) => {
  const colorClasses = {
    primary: 'bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400',
    success: 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400',
    warning: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400',
    danger: 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400',
    gray: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="h-full">
        <Card.Content>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                {title}
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                {value}
              </p>
              {subtitle && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {subtitle}
                </p>
              )}
              {trend && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  {trend}
                </p>
              )}
            </div>

            {Icon && (
              <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
                <Icon className="w-6 h-6" />
              </div>
            )}
          </div>
        </Card.Content>
      </Card>
    </motion.div>
  );
};

export default StatsCard;
