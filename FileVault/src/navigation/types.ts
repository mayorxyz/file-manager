// File: /workspace/FileVault/src/navigation/types.ts

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { FileItem } from '../types';

// Root Stack Navigator Types
export type RootStackParamList = {
  MainTabs: undefined;
  Preview: { file: FileItem };
};

// Bottom Tab Navigator Types
export type MainTabParamList = {
  Home: undefined;
  Browse: { initialPath?: string };
  Search: undefined;
  Storage: undefined;
  Settings: undefined;
};

// Screen Props
export type HomeScreenProps = BottomTabScreenProps<MainTabParamList, 'Home'>;
export type BrowseScreenProps = BottomTabScreenProps<MainTabParamList, 'Browse'>;
export type SearchScreenProps = BottomTabScreenProps<MainTabParamList, 'Search'>;
export type StorageScreenProps = BottomTabScreenProps<MainTabParamList, 'Storage'>;
export type SettingsScreenProps = BottomTabScreenProps<MainTabParamList, 'Settings'>;

export type PreviewScreenProps = NativeStackScreenProps<RootStackParamList, 'Preview'>;

// Navigation Prop Types
export type MainTabNavigationProp = HomeScreenProps['navigation'];
export type RootStackNavigationProp = PreviewScreenProps['navigation'];
