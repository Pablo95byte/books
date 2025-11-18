/**
 * Select Component
 * Dropdown select with label
 */

import { cn } from '../../lib/utils';

const Select = ({
  label,
  error,
  helperText,
  options = [],
  className,
  containerClassName,
  ...props
}) => {
  return (
    <div className={cn('input-group', containerClassName)}>
      {label && (
        <label className="label" htmlFor={props.id || props.name}>
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <select
        className={cn(
          'w-full px-4 py-2.5 rounded-lg border transition-colors duration-200',
          'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100',
          'focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
          error
            ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
            : 'border-gray-300 dark:border-gray-600',
          className
        )}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400 mt-1">
          {error}
        </p>
      )}

      {helperText && !error && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {helperText}
        </p>
      )}
    </div>
  );
};

export default Select;
