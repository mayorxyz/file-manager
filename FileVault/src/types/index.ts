// File: src/types/index.ts

/**
 * Represents a file or folder item in the file system
 */
export interface FileItem {
  id: string;
  name: string;
  path: string;
  uri: string;
  size: number;
  isDirectory: boolean;
  mimeType?: string;
  modificationDate: number;
  extension: string;
}

/**
 * Represents storage category breakdown
 */
export interface StorageCategory {
  label: string;
  size: number;
  color: string;
  icon: string;
}

/**
 * Represents overall storage information
 */
export interface StorageInfo {
  totalSpace: number;
  freeSpace: number;
  usedSpace: number;
  categories: StorageCategory[];
}

/**
 * Sort options for file listing
 */
export type SortOption = 'name' | 'date' | 'size' | 'type';

/**
 * View mode for file listing
 */
export type ViewMode = 'list' | 'grid';

/**
 * Theme mode preference
 */
export type ThemeMode = 'light' | 'dark' | 'system';

/**
 * File type categories for filtering
 */
export type FileType = 'all' | 'image' | 'video' | 'audio' | 'document' | 'other';

/**
 * Recent search item stored in AsyncStorage
 */
export interface RecentSearch {
  id: string;
  query: string;
  timestamp: number;
}

/**
 * Quick access folder preset
 */
export interface QuickAccessFolder {
  id: string;
  name: string;
  path: string;
  icon: string;
  color: string;
}

/**
 * File operation type for bottom sheet actions
 */
export type FileOperation = 
  | 'open' 
  | 'copy' 
  | 'move' 
  | 'rename' 
  | 'delete' 
  | 'share' 
  | 'info';

/**
 * Navigation params for file browser
 */
export type FileBrowserParams = {
  initialPath?: string;
};

/**
 * Navigation params for file preview
 */
export type PreviewScreenParams = {
  file: FileItem;
};

/**
 * App settings interface
 */
export interface AppSettings {
  themeMode: ThemeMode;
  defaultSortOption: SortOption;
  defaultViewMode: ViewMode;
  showHiddenFiles: boolean;
  confirmDelete: boolean;
}
