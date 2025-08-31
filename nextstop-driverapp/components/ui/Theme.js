// components/ui/theme.js
export const colors = {
  background: '#ffffff',
  foreground: '#143a2b',
  card: '#ffffff',
  cardForeground: '#143a2b',
  popover: '#ffffff',
  popoverForeground: '#143a2b',
  primary: '#22c55e',
  primaryForeground: '#ffffff',
  secondary: '#ecfdf5',
  secondaryForeground: '#16a34a',
  muted: '#f6fdf7',
  mutedForeground: '#475569',
  accent: '#dcfce7',
  accentForeground: '#166534',
  destructive: '#ef4444',
  destructiveForeground: '#ffffff',
  border: 'rgba(34, 197, 94, 0.28)',
  input: 'transparent',
  inputBackground: '#f7fef7',
  switchBackground: '#e5e7eb',
  ring: '#22c55e',
  
  // Chart colors
  chart1: '#22c55e',
  chart2: '#16a34a',
  chart3: '#15803d',
  chart4: '#84cc16',
  chart5: '#65a30d',
  
  // Sidebar specific colors
  sidebar: '#f7fef7',
  sidebarForeground: '#1a4d3a',
  sidebarPrimary: '#4ade80',
  sidebarPrimaryForeground: '#ffffff',
  sidebarAccent: '#dcfce7',
  sidebarAccentForeground: '#15803d',
  sidebarBorder: 'rgba(74, 222, 128, 0.3)',
  sidebarRing: '#4ade80',
  
  // Extended color palette for various UI states
  green50: '#f0fdf4',
  green100: '#dcfce7',
  green200: '#bbf7d0',
  green300: '#86efac',
  green400: '#4ade80',
  green500: '#22c55e',
  green600: '#16a34a',
  green700: '#15803d',
  green800: '#166534',
  green900: '#14532d',
  
  blue50: '#eff6ff',
  blue100: '#dbeafe',
  blue200: '#bfdbfe',
  blue300: '#93c5fd',
  blue400: '#60a5fa',
  blue500: '#3b82f6',
  blue600: '#2563eb',
  blue700: '#1d4ed8',
  blue800: '#1e40af',
  blue900: '#1e3a8a',
  
  yellow50: '#fefce8',
  yellow100: '#fef3c7',
  yellow200: '#fde68a',
  yellow300: '#fcd34d',
  yellow400: '#fbbf24',
  yellow500: '#f59e0b',
  yellow600: '#d97706',
  yellow700: '#b45309',
  yellow800: '#92400e',
  yellow900: '#78350f',
  
  red50: '#fef2f2',
  red100: '#fee2e2',
  red200: '#fecaca',
  red300: '#fca5a5',
  red400: '#f87171',
  red500: '#ef4444',
  red600: '#dc2626',
  red700: '#b91c1c',
  red800: '#991b1b',
  red900: '#7f1d1d',
  
  gray50: '#f9fafb',
  gray100: '#f3f4f6',
  gray200: '#e5e7eb',
  gray300: '#d1d5db',
  gray400: '#9ca3af',
  gray500: '#6b7280',
  gray600: '#4b5563',
  gray700: '#374151',
  gray800: '#1f2937',
  gray900: '#111827',
  
  orange50: '#fff7ed',
  orange100: '#ffedd5',
  orange200: '#fed7aa',
  orange300: '#fdba74',
  orange400: '#fb923c',
  orange500: '#f97316',
  orange600: '#ea580c',
  orange700: '#c2410c',
  orange800: '#9a3412',
  orange900: '#7c2d12',
};

// Dark mode colors
export const darkColors = {
  background: '#0f1f13',
  foreground: '#f0fdf4',
  card: '#1a2e20',
  cardForeground: '#f0fdf4',
  popover: '#1a2e20',
  popoverForeground: '#f0fdf4',
  primary: '#4ade80',
  primaryForeground: '#0f1f13',
  secondary: '#1a2e20',
  secondaryForeground: '#dcfce7',
  muted: '#1a2e20',
  mutedForeground: '#9ca3af',
  accent: '#1a2e20',
  accentForeground: '#dcfce7',
  destructive: '#ef4444',
  destructiveForeground: '#ffffff',
  border: '#1a2e20',
  input: '#1a2e20',
  inputBackground: '#1a2e20',
  switchBackground: '#374151',
  ring: '#4ade80',
  
  // Chart colors (same in dark mode)
  chart1: '#22c55e',
  chart2: '#16a34a',
  chart3: '#15803d',
  chart4: '#84cc16',
  chart5: '#65a30d',
  
  // Sidebar specific colors for dark mode
  sidebar: '#1a2e20',
  sidebarForeground: '#f0fdf4',
  sidebarPrimary: '#4ade80',
  sidebarPrimaryForeground: '#0f1f13',
  sidebarAccent: '#0f1f13',
  sidebarAccentForeground: '#dcfce7',
  sidebarBorder: '#1a2e20',
  sidebarRing: '#4ade80',
  
  // Extended palette adjusted for dark mode
  green50: '#14532d',
  green100: '#166534',
  green200: '#15803d',
  green300: '#16a34a',
  green400: '#22c55e',
  green500: '#4ade80',
  green600: '#86efac',
  green700: '#bbf7d0',
  green800: '#dcfce7',
  green900: '#f0fdf4',
  
  blue50: '#1e3a8a',
  blue100: '#1e40af',
  blue200: '#1d4ed8',
  blue300: '#2563eb',
  blue400: '#3b82f6',
  blue500: '#60a5fa',
  blue600: '#93c5fd',
  blue700: '#bfdbfe',
  blue800: '#dbeafe',
  blue900: '#eff6ff',
  
  yellow50: '#78350f',
  yellow100: '#92400e',
  yellow200: '#b45309',
  yellow300: '#d97706',
  yellow400: '#f59e0b',
  yellow500: '#fbbf24',
  yellow600: '#fcd34d',
  yellow700: '#fde68a',
  yellow800: '#fef3c7',
  yellow900: '#fefce8',
  
  red50: '#7f1d1d',
  red100: '#991b1b',
  red200: '#b91c1c',
  red300: '#dc2626',
  red400: '#ef4444',
  red500: '#f87171',
  red600: '#fca5a5',
  red700: '#fecaca',
  red800: '#fee2e2',
  red900: '#fef2f2',
  
  gray50: '#111827',
  gray100: '#1f2937',
  gray200: '#374151',
  gray300: '#4b5563',
  gray400: '#6b7280',
  gray500: '#9ca3af',
  gray600: '#d1d5db',
  gray700: '#e5e7eb',
  gray800: '#f3f4f6',
  gray900: '#f9fafb',
  
  orange50: '#7c2d12',
  orange100: '#9a3412',
  orange200: '#c2410c',
  orange300: '#ea580c',
  orange400: '#f97316',
  orange500: '#fb923c',
  orange600: '#fdba74',
  orange700: '#fed7aa',
  orange800: '#ffedd5',
  orange900: '#fff7ed',
};

// Utility function to get theme colors (for future dark mode implementation)
export const getThemeColors = (isDark = false) => {
  return isDark ? darkColors : colors;
};

// Font weights
export const fontWeights = {
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
};

// Radius values
export const radius = {
  sm: 4,
  md: 6,
  lg: 8,
  xl: 12,
  full: 9999,
};

// Typography scales
export const typography = {
  xs: { fontSize: 12, lineHeight: 16 },
  sm: { fontSize: 13.5, lineHeight: 19 },
  base: { fontSize: 15.5, lineHeight: 23 },
  lg: { fontSize: 18, lineHeight: 28 },
  xl: { fontSize: 20, lineHeight: 28 },
  '2xl': { fontSize: 24, lineHeight: 32 },
  '3xl': { fontSize: 30, lineHeight: 36 },
  '4xl': { fontSize: 36, lineHeight: 40 },
};

// Spacing values
export const spacing = {
  xs: 4,
  sm: 8,
  md: 14,
  lg: 20,
  xl: 28,
  '2xl': 44,
  '3xl': 60,
  '4xl': 76,
};

// Shadow definitions for React Native
export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 5,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 6,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.22,
    shadowRadius: 20,
    elevation: 10,
  },
};

// Default export for backward compatibility
export default colors;