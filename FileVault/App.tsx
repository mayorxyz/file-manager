// File: /workspace/FileVault/App.tsx

import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { PaperProvider, MD3LightTheme, MD3DarkTheme } from 'react-native-paper';
import { useColorScheme } from 'react-native';
import { AppNavigator } from './src/navigation/AppNavigator';
import { useSettingsStore } from './src/store/settingsStore';
import { usePermissions } from './src/hooks/usePermissions';
import { theme } from './src/theme/theme';

export default function App() {
  const { themeMode } = useSettingsStore();
  const { hasPermission, requestPermission } = usePermissions();
  const colorScheme = useColorScheme();

  // Determine active theme based on settings
  const isDarkMode = themeMode === 'dark' || (themeMode === 'system' && colorScheme === 'dark');
  const activeTheme = isDarkMode 
    ? { ...MD3DarkTheme, colors: theme.dark.colors }
    : { ...MD3LightTheme, colors: theme.light.colors };

  useEffect(() => {
    // Request permissions on app launch
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission]);

  return (
    <PaperProvider theme={activeTheme}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      <AppNavigator />
    </PaperProvider>
  );
}
