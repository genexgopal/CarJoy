// ResponsiveContainer.jsx - Responsive container for modern screen resolutions
import React from 'react';

/**
 * ResponsiveContainer - Adapts content width based on screen resolution
 * Breakpoints:
 * - Mobile: < 640px (full width with padding)
 * - Tablet: 640px - 1024px (full width with padding)
 * - Desktop: 1024px - 1920px (max-w-7xl with padding)
 * - Ultra-wide: 1920px - 2560px (max-w-screen-2xl with padding)
 * - 4K+: 2560px+ (max-w-full with padding)
 */

export const ResponsiveContainer = ({ children, className = '' }) => {
  return (
    <div className={`
      w-full
      px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12
      py-8 sm:py-10 lg:py-12
      mx-auto
      transition-all duration-300
      ${className}
    `}>
      <style>{`
        /* Mobile First - 640px and below */
        @media (max-width: 639px) {
          .responsive-content {
            max-width: 100%;
          }
        }
        
        /* Tablet - 640px to 1024px */
        @media (min-width: 640px) and (max-width: 1023px) {
          .responsive-content {
            max-width: 100%;
          }
        }
        
        /* Desktop - 1024px to 1920px */
        @media (min-width: 1024px) and (max-width: 1919px) {
          .responsive-content {
            max-width: 1280px; /* 7xl */
          }
        }
        
        /* Ultra-wide - 1920px to 2560px */
        @media (min-width: 1920px) and (max-width: 2559px) {
          .responsive-content {
            max-width: 1536px; /* screen-2xl */
          }
        }
        
        /* 4K+ - 2560px and above */
        @media (min-width: 2560px) {
          .responsive-content {
            max-width: 90vw;
            margin: 0 auto;
          }
        }
      `}</style>
      <div className="responsive-content">
        {children}
      </div>
    </div>
  );
};

export default ResponsiveContainer;
