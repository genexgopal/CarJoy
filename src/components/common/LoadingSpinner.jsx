import React from 'react';

/**
 * LoadingSpinner Component
 * 
 * A reusable loading spinner with multiple size variants.
 * Uses CSS custom properties for theming.
 * 
 * @param {Object} props
 * @param {'sm' | 'md' | 'lg' | 'xl'} props.size - Size of the spinner
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.fullScreen - Whether to display as full screen overlay
 * @param {string} props.message - Optional loading message
 */
export const LoadingSpinner = ({ 
  size = 'md', 
  className = '', 
  fullScreen = false,
  message = ''
}) => {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
    xl: 'w-16 h-16 border-4',
  };

  const spinner = (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <div
        className={`${sizes[size]} rounded-full animate-spin`}
        style={{
          borderColor: 'var(--color-primary-light, #e5e7eb)',
          borderTopColor: 'var(--color-primary, #006666)',
        }}
        role="status"
        aria-label="Loading"
      />
      {message && (
        <p className="text-sm text-gray-600 font-medium">{message}</p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
        {spinner}
      </div>
    );
  }

  return spinner;
};

/**
 * PageLoader Component
 * 
 * Full page loading state for route transitions
 */
export const PageLoader = ({ message = 'Loading...' }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <LoadingSpinner size="xl" message={message} />
  </div>
);

export default LoadingSpinner;

