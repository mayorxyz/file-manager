// File: src/theme/theme.ts

import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';
import { COLORS } from '@utils/constants';

/**
 * Custom light theme based on Material Design 3
 */
export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: COLORS.primary,
    secondary: COLORS.secondary,
    error: COLORS.error,
    background: COLORS.background,
    surface: COLORS.surface,
    text: COLORS.text,
    onPrimary: '#FFFFFF',
    onSecondary: '#FFFFFF',
    onError: '#FFFFFF',
    onBackground: COLORS.text,
    onSurface: COLORS.text,
    surfaceVariant: '#E8F0FE',
    onSurfaceVariant: COLORS.textSecondary,
    outline: COLORS.divider,
  },
};

/**
 * Custom dark theme based on Material Design 3
 */
export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#64B5F6', // Lighter blue for dark mode
    secondary: '#81C784', // Lighter green for dark mode
    error: '#FF8A80', // Lighter red for dark mode
    background: COLORS.backgroundDark,
    surface: COLORS.surfaceDark,
    text: COLORS.textDark,
    onPrimary: '#000000',
    onSecondary: '#000000',
    onError: '#000000',
    onBackground: COLORS.textDark,
    onSurface: COLORS.textDark,
    surfaceVariant: '#2D2D2D',
    onSurfaceVariant: COLORS.textSecondaryDark,
    outline: COLORS.dividerDark,
  },
};

/**
 * Get theme based on mode
 * @param mode - Theme mode ('light', 'dark', or 'system')
 * @returns Theme object
 */
export const getTheme = (mode: 'light' | 'dark' | 'system'): typeof lightTheme => {
  if (mode === 'system') {
    // In a real app, you'd use useColorScheme() from react-native
    // For now, default to light
    return lightTheme;
  }
  
  return mode === 'dark' ? darkTheme : lightTheme;
};

/**
 * Common theme configuration
 */
export const themeConfig = {
  roundness: 12,
  fonts: {
    regular: {
      fontFamily: 'System',
      fontWeight: '400',
    },
    medium: {
      fontFamily: 'System',
      fontWeight: '500',
    },
    bold: {
      fontFamily: 'System',
      fontWeight: '700',
    },
    light: {
      fontFamily: 'System',
      fontWeight: '300',
    },
    thin: {
      fontFamily: 'System',
      fontWeight: '100',
    },
  },
};
