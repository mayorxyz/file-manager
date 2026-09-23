// File: src/services/searchService.ts

import Fuse from 'fuse.js';
import { FileItem, FileType, RecentSearch } from '@types/index';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { generateId } from '@utils/fileHelpers';

const RECENT_SEARCHES_KEY = '@filevault:recentSearches';

/**
 * Search files using fuzzy matching
 * @param files - Array of files to search
 * @param query - Search query string
 * @param fileType - Optional file type filter
 * @returns Filtered array of FileItem
 */
export const searchFiles = (files: FileItem[], query: string, fileType?: FileType): FileItem[] => {
  if (!query.trim()) {
    return files;
  }
  
  // Filter by file type first if specified
  let filteredFiles = files;
  if (fileType && fileType !== 'all') {
    filteredFiles = filterByFileType(files, fileType);
  }
  
  // Use Fuse.js for fuzzy search
  const fuse = new Fuse(filteredFiles, {
    keys: ['name'],
    threshold: 0.3, // Lower = more strict matching
    includeScore: true,
    minMatchCharLength: 2,
  });
  
  const results = fuse.search(query);
  return results.map(result => result.item);
};

/**
 * Filter files by type
 * @param files - Array of files
 * @param fileType - Type to filter by
 * @returns Filtered array
 */
const filterByFileType = (files: FileItem[], fileType: FileType): FileItem[] => {
  return files.filter(file => {
    if (file.isDirectory) return false;
    
    const ext = file.extension.toLowerCase();
    
    switch (fileType) {
      case 'image':
        return ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'].includes(ext);
      case 'video':
        return ['mp4', 'avi', 'mkv', 'mov', 'wmv', 'flv', 'webm'].includes(ext);
      case 'audio':
        return ['mp3', 'wav', 'aac', 'ogg', 'flac', 'm4a'].includes(ext);
      case 'document':
        return ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'rtf', 'md'].includes(ext);
      default:
        return true;
    }
  });
};

/**
 * Save search to recent searches
 * @param query - Search query to save
 */
export const saveRecentSearch = async (query: string): Promise<void> => {
  try {
    if (!query.trim()) return;
    
    const existing = await getRecentSearches();
    
    // Remove if already exists (to move to top)
    const filtered = existing.filter(search => search.query !== query);
    
    // Add new search at the beginning
    const newSearch: RecentSearch = {
      id: generateId(),
      query: query.trim(),
      timestamp: Date.now(),
    };
    
    const updated = [newSearch, ...filtered].slice(0, 10); // Keep max 10
    
    await AsyncStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Error saving recent search:', error);
  }
};

/**
 * Get recent searches from storage
 * @returns Promise<RecentSearch[]>
 */
export const getRecentSearches = async (): Promise<RecentSearch[]> => {
  try {
    const stored = await AsyncStorage.getItem(RECENT_SEARCHES_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    return [];
  } catch (error) {
    console.error('Error getting recent searches:', error);
    return [];
  }
};

/**
 * Clear all recent searches
 */
export const clearRecentSearches = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(RECENT_SEARCHES_KEY);
  } catch (error) {
    console.error('Error clearing recent searches:', error);
  }
};

/**
 * Remove a specific recent search
 * @param query - Query to remove
 */
export const removeRecentSearch = async (query: string): Promise<void> => {
  try {
    const existing = await getRecentSearches();
    const filtered = existing.filter(search => search.query !== query);
    await AsyncStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error removing recent search:', error);
  }
};
