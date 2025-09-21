import React from 'react';

// Reusable loading spinner with size, color, and optional label
const LoadingSpinner = ({
  size = 'md',
  color = 'blue',
  className = '',
  text = null,
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  const colorClasses = {
    blue: 'border-blue-600',
    gray: 'border-gray-600',
    white: 'border-white',
    green: 'border-green-600',
    red: 'border-red-600',
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`
          ${sizeClasses[size]}
          ${colorClasses[color]}
          border-2 border-t-transparent rounded-full animate-spin
        `}
      />
      {text && <span className="ml-2 text-sm text-gray-600">{text}</span>}
    </div>
  );
};

export default LoadingSpinner;
