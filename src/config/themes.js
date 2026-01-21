/**
 * Theme Configuration for ShipMyParcel Admin
 * Contains color definitions for all available themes
 */

export const themes = {
  // Theme 1: Express Orange (Current default)
  expressOrange: {
    id: 'expressOrange',
    name: 'Express Orange',
    description: 'Vibrant orange for express delivery services',
    colors: {
      // Primary Colors (Orange)
      primary: '#f26522',
      primaryDark: '#d4541a',
      primaryLight: '#ff8533',
      primary50: '#fff7ed',
      primary100: '#ffedd5',
      primaryRing: 'rgba(242, 101, 34, 0.15)',
      primaryShadow: 'rgba(242, 101, 34, 0.25)',
      primaryShadowHover: 'rgba(242, 101, 34, 0.35)',
      // Secondary Colors (Navy Blue)
      secondary: '#003366',
      secondaryDark: '#001a4d',
      secondaryLight: '#004080',
      secondary50: '#e6f0ff',
      secondary100: '#cce0ff',
      secondaryRing: 'rgba(0, 51, 102, 0.15)',
      // Sidebar
      sidebarGradientStart: '#001a4d',
      sidebarGradientMid: '#002855',
      sidebarGradientEnd: '#003366',
      // Sidebar Text Colors (for dark sidebar)
      sidebarText: '#ffffff',
      sidebarTextMuted: '#94a3b8',
      sidebarHoverBg: 'rgba(255, 255, 255, 0.1)',
      sidebarBorder: 'rgba(255, 255, 255, 0.1)',
    },
    preview: ['#f26522', '#003366'],
  },

  // Theme 2: Modern Indigo (From Zynix screenshot)
  modernIndigo: {
    id: 'modernIndigo',
    name: 'Modern Indigo',
    description: 'Professional indigo theme with modern aesthetics',
    colors: {
      // Primary Colors (Indigo/Purple-Blue)
      primary: '#6366f1',
      primaryDark: '#4f46e5',
      primaryLight: '#818cf8',
      primary50: '#eef2ff',
      primary100: '#e0e7ff',
      primaryRing: 'rgba(99, 102, 241, 0.15)',
      primaryShadow: 'rgba(99, 102, 241, 0.25)',
      primaryShadowHover: 'rgba(99, 102, 241, 0.35)',
      // Secondary Colors (Dark Slate)
      secondary: '#1e293b',
      secondaryDark: '#0f172a',
      secondaryLight: '#334155',
      secondary50: '#f8fafc',
      secondary100: '#f1f5f9',
      secondaryRing: 'rgba(30, 41, 59, 0.15)',
      // Sidebar
      sidebarGradientStart: '#0f172a',
      sidebarGradientMid: '#1e293b',
      sidebarGradientEnd: '#334155',
      // Sidebar Text Colors (for dark sidebar)
      sidebarText: '#ffffff',
      sidebarTextMuted: '#94a3b8',
      sidebarHoverBg: 'rgba(255, 255, 255, 0.1)',
      sidebarBorder: 'rgba(255, 255, 255, 0.1)',
    },
    preview: ['#6366f1', '#1e293b'],
  },

  // Theme 3: Eco Green
  ecoGreen: {
    id: 'ecoGreen',
    name: 'Eco Green',
    description: 'Earth-friendly green for sustainable delivery',
    colors: {
      // Primary Colors (Emerald Green)
      primary: '#10b981',
      primaryDark: '#059669',
      primaryLight: '#34d399',
      primary50: '#ecfdf5',
      primary100: '#d1fae5',
      primaryRing: 'rgba(16, 185, 129, 0.15)',
      primaryShadow: 'rgba(16, 185, 129, 0.25)',
      primaryShadowHover: 'rgba(16, 185, 129, 0.35)',
      // Secondary Colors (Forest/Slate)
      secondary: '#1f2937',
      secondaryDark: '#111827',
      secondaryLight: '#374151',
      secondary50: '#f9fafb',
      secondary100: '#f3f4f6',
      secondaryRing: 'rgba(31, 41, 55, 0.15)',
      // Sidebar
      sidebarGradientStart: '#111827',
      sidebarGradientMid: '#1f2937',
      sidebarGradientEnd: '#374151',
      // Sidebar Text Colors (for dark sidebar)
      sidebarText: '#ffffff',
      sidebarTextMuted: '#9ca3af',
      sidebarHoverBg: 'rgba(255, 255, 255, 0.1)',
      sidebarBorder: 'rgba(255, 255, 255, 0.1)',
    },
    preview: ['#10b981', '#1f2937'],
  },

  // Theme 4: Ocean Blue
  oceanBlue: {
    id: 'oceanBlue',
    name: 'Ocean Blue',
    description: 'Clean blue theme with white background for professional use',
    colors: {
      // Primary Colors (Professional Blue)
      primary: '#2563eb',
      primaryDark: '#1d4ed8',
      primaryLight: '#3b82f6',
      primary50: '#eff6ff',
      primary100: '#dbeafe',
      primaryRing: 'rgba(37, 99, 235, 0.15)',
      primaryShadow: 'rgba(37, 99, 235, 0.25)',
      primaryShadowHover: 'rgba(37, 99, 235, 0.35)',
      // Secondary Colors (White/Light)
      secondary: '#1e40af',
      secondaryDark: '#1e3a8a',
      secondaryLight: '#3b82f6',
      secondary50: '#ffffff',
      secondary100: '#f8fafc',
      secondaryRing: 'rgba(30, 64, 175, 0.15)',
      // Sidebar (Blue gradient for contrast with white content)
      sidebarGradientStart: '#1e3a8a',
      sidebarGradientMid: '#1e40af',
      sidebarGradientEnd: '#2563eb',
      // Sidebar Text Colors (for dark sidebar)
      sidebarText: '#ffffff',
      sidebarTextMuted: '#93c5fd',
      sidebarHoverBg: 'rgba(255, 255, 255, 0.1)',
      sidebarBorder: 'rgba(255, 255, 255, 0.1)',
    },
    preview: ['#2563eb', '#1e40af'],
  },

  // Theme 5: Clean White (Light Mode)
  cleanWhite: {
    id: 'cleanWhite',
    name: 'Clean White',
    description: 'Minimal white theme with dark text for maximum readability',
    colors: {
      // Primary Colors (Purple Accent)
      primary: '#735dff',
      primaryDark: '#5b45e0',
      primaryLight: '#9182ff',
      primary50: '#f5f3ff',
      primary100: '#ede9fe',
      primaryRing: 'rgba(115, 93, 255, 0.15)',
      primaryShadow: 'rgba(115, 93, 255, 0.20)',
      primaryShadowHover: 'rgba(115, 93, 255, 0.30)',
      // Secondary Colors (Dark Gray for Text)
      secondary: '#1f2937',
      secondaryDark: '#111827',
      secondaryLight: '#374151',
      secondary50: '#ffffff',
      secondary100: '#f9fafb',
      secondaryRing: 'rgba(31, 41, 55, 0.10)',
      // Sidebar (White with subtle gray tones)
      sidebarGradientStart: '#ffffff',
      sidebarGradientMid: '#f9fafb',
      sidebarGradientEnd: '#f3f4f6',
      // Sidebar Text Colors (for light/white sidebar - dark text)
      sidebarText: '#1f2937',
      sidebarTextMuted: '#6b7280',
      sidebarHoverBg: 'rgba(115, 93, 255, 0.08)',
      sidebarBorder: '#e5e7eb',
    },
    preview: ['#735dff', '#ffffff'],
  },
};

// Default theme
export const defaultTheme = 'cleanWhite';

// Theme storage key
export const THEME_STORAGE_KEY = 'shipmyparcel-admin-theme';

/**
 * Apply theme colors to CSS custom properties
 * @param {Object} colors - Theme color object
 */
export function applyThemeColors(colors) {
  const root = document.documentElement;
  
  // Primary colors
  root.style.setProperty('--color-primary', colors.primary);
  root.style.setProperty('--color-primary-dark', colors.primaryDark);
  root.style.setProperty('--color-primary-light', colors.primaryLight);
  root.style.setProperty('--color-primary-50', colors.primary50);
  root.style.setProperty('--color-primary-100', colors.primary100);
  root.style.setProperty('--color-primary-ring', colors.primaryRing);
  root.style.setProperty('--color-primary-shadow', colors.primaryShadow);
  root.style.setProperty('--color-primary-shadow-hover', colors.primaryShadowHover);
  
  // Secondary colors
  root.style.setProperty('--color-secondary', colors.secondary);
  root.style.setProperty('--color-secondary-dark', colors.secondaryDark);
  root.style.setProperty('--color-secondary-light', colors.secondaryLight);
  root.style.setProperty('--color-secondary-50', colors.secondary50);
  root.style.setProperty('--color-secondary-100', colors.secondary100);
  root.style.setProperty('--color-secondary-ring', colors.secondaryRing);
  
  // Sidebar gradients
  root.style.setProperty('--sidebar-gradient-start', colors.sidebarGradientStart);
  root.style.setProperty('--sidebar-gradient-mid', colors.sidebarGradientMid);
  root.style.setProperty('--sidebar-gradient-end', colors.sidebarGradientEnd);

  // Sidebar text colors
  root.style.setProperty('--sidebar-text', colors.sidebarText);
  root.style.setProperty('--sidebar-text-muted', colors.sidebarTextMuted);
  root.style.setProperty('--sidebar-hover-bg', colors.sidebarHoverBg);
  root.style.setProperty('--sidebar-border', colors.sidebarBorder);
}

export default themes;

