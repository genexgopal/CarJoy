import { createContext, useContext, useEffect } from 'react';
import { themes, defaultTheme, applyThemeColors } from '../config/themes';

// Create context
const ThemeContext = createContext(undefined);

// Fixed theme - Clean White
const FIXED_THEME = themes[defaultTheme] || themes.cleanWhite;

/**
 * ThemeProvider component that applies the Clean White theme
 * Theme switching has been removed - this is a static theme application
 */
export function ThemeProvider({ children }) {
  // Apply theme colors on initial mount
  useEffect(() => {
    if (FIXED_THEME) {
      applyThemeColors(FIXED_THEME.colors);
    }
  }, []);

  const value = {
    currentTheme: FIXED_THEME,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Hook to access theme context (for components that still reference it)
 * @returns {Object} Theme context value
 */
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    // Return a safe default if used outside provider
    return { currentTheme: FIXED_THEME };
  }
  return context;
}

export default ThemeContext;

