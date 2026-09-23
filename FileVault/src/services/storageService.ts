// File: src/services/storageService.ts

import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';
import { StorageInfo, StorageCategory } from '@types/index';
import { CATEGORY_COLORS } from '@utils/constants';
import { getFileCategory } from '@utils/fileHelpers';

/**
 * Get storage information for the device
 * @returns Promise<StorageInfo>
 */
export const getStorageInfo = async (): Promise<StorageInfo> => {
  try {
    // Get filesystem info
    const fsInfo = await FileSystem.getFreeDiskStorageAsync();
    
    // Get total space (approximate based on typical device storage)
    // Note: Expo doesn't provide a direct way to get total storage
    // We estimate based on free space and typical usage patterns
    const freeSpace = fsInfo;
    
    // For Android, we can get more accurate info
    let totalSpace: number;
    
    if (Platform.OS === 'android') {
      // Android typically reports free space accurately
      // Estimate total based on common device sizes
      // This is an approximation - in production, you'd use native modules
      totalSpace = estimateTotalStorage(freeSpace);
    } else {
      // iOS estimation
      totalSpace = estimateTotalStorage(freeSpace);
    }
    
    const usedSpace = totalSpace - freeSpace;
    
    // Get category breakdown (this would ideally scan actual files)
    const categories = await getCategoryBreakdown();
    
    return {
      totalSpace,
      freeSpace,
      usedSpace,
      categories,
    };
  } catch (error) {
    console.error('Error getting storage info:', error);
    // Return default values on error
    return {
      totalSpace: 64 * 1024 * 1024 * 1024, // 64 GB default
      freeSpace: 32 * 1024 * 1024 * 1024, // 32 GB default
      usedSpace: 32 * 1024 * 1024 * 1024,
      categories: [],
    };
  }
};

/**
 * Estimate total storage based on free space
 * This is a heuristic approach since Expo doesn't provide total storage directly
 */
const estimateTotalStorage = (freeSpace: number): number => {
  // Common device storage sizes in bytes
  const storageSizes = [
    16 * 1024 * 1024 * 1024,  // 16 GB
    32 * 1024 * 1024 * 1024,  // 32 GB
    64 * 1024 * 1024 * 1024,  // 64 GB
    128 * 1024 * 1024 * 1024, // 128 GB
    256 * 1024 * 1024 * 1024, // 256 GB
    512 * 1024 * 1024 * 1024, // 512 GB
    1024 * 1024 * 1024 * 1024, // 1 TB
  ];
  
  // Find the most likely total storage size
  // Assume at least 10% is always used
  const minTotal = freeSpace / 0.9;
  
  for (const size of storageSizes) {
    if (size >= minTotal) {
      return size;
    }
  }
  
  // If free space is larger than our max estimate, use a multiple
  return Math.ceil(minTotal / (256 * 1024 * 1024 * 1024)) * (256 * 1024 * 1024 * 1024);
};

/**
 * Get storage breakdown by category
 * In a real app, this would scan actual files and calculate sizes
 * For now, we return estimated/placeholder data
 */
const getCategoryBreakdown = async (): Promise<StorageCategory[]> => {
  try {
    // This is a placeholder implementation
    // In production, you would:
    // 1. Scan the file system recursively
    // 2. Categorize each file by extension
    // 3. Sum up sizes per category
    
    const baseDir = FileSystem.documentDirectory;
    if (!baseDir) {
      return getDefaultCategories();
    }
    
    // Read directory contents
    const entries = await FileSystem.readDirectoryAsync(baseDir);
    
    const categorySizes: Record<string, number> = {
      images: 0,
      videos: 0,
      audio: 0,
      documents: 0,
      apps: 0,
      other: 0,
    };
    
    // Scan files in the base directory
    for (const entry of entries) {
      try {
        const fullPath = `${baseDir}${entry}`;
        const info = await FileSystem.getInfoAsync(fullPath, { size: true });
        
        if (info.exists && info.size) {
          const ext = entry.split('.').pop()?.toLowerCase() || '';
          const category = getFileCategory(ext);
          
          if (categorySizes[category] !== undefined) {
            categorySizes[category] += info.size;
          } else {
            categorySizes.other += info.size;
          }
        }
      } catch (error) {
        // Skip files we can't read
      }
    }
    
    // Convert to StorageCategory array
    return Object.entries(categorySizes)
      .filter(([_, size]) => size > 0)
      .map(([key, size]) => ({
        label: key.charAt(0).toUpperCase() + key.slice(1),
        size,
        color: CATEGORY_COLORS[key as keyof typeof CATEGORY_COLORS] || '#9AA0A6',
        icon: getCategoryIcon(key),
      }));
  } catch (error) {
    console.error('Error getting category breakdown:', error);
    return getDefaultCategories();
  }
};

/**
 * Get default category placeholders
 */
const getDefaultCategories = (): StorageCategory[] => {
  return [
    { label: 'Images', size: 0, color: CATEGORY_COLORS.images, icon: 'image' },
    { label: 'Videos', size: 0, color: CATEGORY_COLORS.videos, icon: 'video' },
    { label: 'Audio', size: 0, color: CATEGORY_COLORS.audio, icon: 'music-note' },
    { label: 'Documents', size: 0, color: CATEGORY_COLORS.documents, icon: 'file-document' },
    { label: 'Other', size: 0, color: CATEGORY_COLORS.other, icon: 'folder-outline' },
  ];
};

/**
 * Get icon name for category
 */
const getCategoryIcon = (category: string): string => {
  const icons: Record<string, string> = {
    images: 'image',
    videos: 'video',
    audio: 'music-note',
    documents: 'file-document',
    apps: 'applications',
    other: 'folder-outline',
  };
  return icons[category] || 'folder-outline';
};

/**
 * Format storage percentage
 * @param used - Used space
 * @param total - Total space
 * @returns Percentage string
 */
export const getStoragePercentage = (used: number, total: number): string => {
  if (total === 0) return '0%';
  return `${Math.round((used / total) * 100)}%`;
};
