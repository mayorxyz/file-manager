// File: src/store/settingsStore.ts

import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeMode, SortOption, ViewMode, AppSettings } from '@types/index';
import { DEFAULT_SORT_OPTION, DEFAULT_VIEW_MODE, DEFAULT_THEME_MODE } from '@utils/constants';

const SETTINGS_KEY = '@filevault:settings';

interface SettingsState extends AppSettings {
  // Actions
  loadSettings: () => Promise<void>;
  setThemeMode: (mode: ThemeMode) => Promise<void>;
  setSortOption: (option: SortOption) => Promise<void>;
  setViewMode: (mode: ViewMode) => Promise<void>;
  setShowHiddenFiles: (show: boolean) => Promise<void>;
  setConfirmDelete: (confirm: boolean) => Promise<void>;
  resetSettings: () => Promise<void>;
}

const defaultSettings: AppSettings = {
  themeMode: DEFAULT_THEME_MODE,
  defaultSortOption: DEFAULT_SORT_OPTION,
  defaultViewMode: DEFAULT_VIEW_MODE,
  showHiddenFiles: false,
  confirmDelete: true,
};

export const useSettingsStore = create<SettingsState>((set, get) => ({
  // Initial state
  ...defaultSettings,
  
  // Load settings from AsyncStorage
  loadSettings: async () => {
    try {
      const stored = await AsyncStorage.getItem(SETTINGS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        set(parsed);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  },
  
  // Set theme mode
  setThemeMode: async (mode: ThemeMode) => {
    set({ themeMode: mode });
    await saveSettings(get());
  },
  
  // Set sort option
  setSortOption: async (option: SortOption) => {
    set({ defaultSortOption: option });
    await saveSettings(get());
  },
  
  // Set view mode
  setViewMode: async (mode: ViewMode) => {
    set({ defaultViewMode: mode });
    await saveSettings(get());
  },
  
  // Toggle hidden files visibility
  setShowHiddenFiles: async (show: boolean) => {
    set({ showHiddenFiles: show });
    await saveSettings(get());
  },
  
  // Toggle delete confirmation
  setConfirmDelete: async (confirm: boolean) => {
    set({ confirmDelete: confirm });
    await saveSettings(get());
  },
  
  // Reset to default settings
  resetSettings: async () => {
    set(defaultSettings);
    await AsyncStorage.removeItem(SETTINGS_KEY);
  },
}));

/**
 * Save settings to AsyncStorage
 */
const saveSettings = async (state: AppSettings): Promise<void> => {
  try {
    await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Error saving settings:', error);
  }
};
