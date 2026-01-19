import React, { createContext, useContext, useState, useEffect } from 'react';
import { themes, defaultTheme, THEME_STORAGE_KEY, applyThemeColors } from '../config/themes';

// Create context
const ThemeContext = createContext(undefined);

/**
 * ThemeProvider component that manages theme state and applies CSS variables
 */
export function ThemeProvider({ children }) {
  const [currentThemeId, setCurrentThemeId] = useState(() => {
    // Try to get theme from localStorage on initial load
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme && themes[savedTheme]) {
        return savedTheme;
      }
    }
    return defaultTheme;
  });

  // Get the current theme object
  const currentTheme = themes[currentThemeId] || themes[defaultTheme];

  // Apply theme colors when theme changes
  useEffect(() => {
    if (currentTheme) {
      applyThemeColors(currentTheme.colors);
      // Save to localStorage
      localStorage.setItem(THEME_STORAGE_KEY, currentThemeId);
    }
  }, [currentThemeId, currentTheme]);

  // Apply theme on initial mount
  useEffect(() => {
    if (currentTheme) {
      applyThemeColors(currentTheme.colors);
    }
  }, []);

  /**
   * Change to a different theme
   * @param {string} themeId - The theme ID to switch to
   */
  const setTheme = (themeId) => {
    if (themes[themeId]) {
      setCurrentThemeId(themeId);
    } else {
      console.warn(`Theme "${themeId}" not found. Available themes:`, Object.keys(themes));
    }
  };

  // Get list of all available themes for the dropdown
  const availableThemes = Object.values(themes);

  const value = {
    currentTheme,
    currentThemeId,
    setTheme,
    availableThemes,
    themes,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Hook to access theme context
 * @returns {Object} Theme context value
 */
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export default ThemeContext;

