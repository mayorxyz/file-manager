// File: src/utils/fileHelpers.ts

import { FileItem, SortOption } from '@types/index';
import { FILE_TYPE_ICONS, EXTENSION_MIME_MAP, FILE_SIZE_UNITS } from './constants';

/**
 * Format file size to human-readable string
 * @param bytes - File size in bytes
 * @returns Formatted file size string (e.g., "1.5 MB")
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const dm = 2; // decimal places
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${FILE_SIZE_UNITS[i]}`;
};

/**
 * Get file extension from filename
 * @param filename - Name of the file
 * @returns File extension without dot (e.g., "pdf")
 */
export const getFileExtension = (filename: string): string => {
  const parts = filename.split('.');
  if (parts.length > 1) {
    return parts.pop()?.toLowerCase() || '';
  }
  return '';
};

/**
 * Get MIME type from file extension
 * @param extension - File extension
 * @returns MIME type string
 */
export const getMimeType = (extension: string): string | undefined => {
  return EXTENSION_MIME_MAP[extension.toLowerCase()];
};

/**
 * Get appropriate icon for file type
 * @param file - FileItem object
 * @returns Material Community Icons name
 */
export const getFileIcon = (file: FileItem): string => {
  if (file.isDirectory) {
    return FILE_TYPE_ICONS.folder;
  }
  
  const ext = file.extension.toLowerCase();
  
  // Check for specific file types
  if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'].includes(ext)) {
    return FILE_TYPE_ICONS.image;
  }
  
  if (['mp4', 'avi', 'mkv', 'mov', 'wmv', 'flv', 'webm'].includes(ext)) {
    return FILE_TYPE_ICONS.video;
  }
  
  if (['mp3', 'wav', 'aac', 'ogg', 'flac', 'm4a'].includes(ext)) {
    return FILE_TYPE_ICONS.audio;
  }
  
  if (ext === 'pdf') {
    return FILE_TYPE_ICONS.pdf;
  }
  
  if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext)) {
    return FILE_TYPE_ICONS.archive;
  }
  
  if (['js', 'ts', 'jsx', 'tsx', 'html', 'css', 'json', 'xml', 'py', 'java', 'cpp', 'c', 'swift', 'kt'].includes(ext)) {
    return FILE_TYPE_ICONS.code;
  }
  
  if (['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'rtf', 'md'].includes(ext)) {
    return FILE_TYPE_ICONS.document;
  }
  
  return FILE_TYPE_ICONS.default;
};

/**
 * Get file category based on extension
 * @param extension - File extension
 * @returns Category string
 */
export const getFileCategory = (extension: string): string => {
  const ext = extension.toLowerCase();
  
  if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'].includes(ext)) {
    return 'images';
  }
  
  if (['mp4', 'avi', 'mkv', 'mov', 'wmv', 'flv', 'webm'].includes(ext)) {
    return 'videos';
  }
  
  if (['mp3', 'wav', 'aac', 'ogg', 'flac', 'm4a'].includes(ext)) {
    return 'audio';
  }
  
  if (['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'rtf', 'md'].includes(ext)) {
    return 'documents';
  }
  
  return 'other';
};

/**
 * Sort files array based on option
 * @param files - Array of FileItem
 * @param option - Sort option
 * @returns Sorted array (folders always first)
 */
export const sortFiles = (files: FileItem[], option: SortOption): FileItem[] => {
  return [...files].sort((a, b) => {
    // Folders always come first
    if (a.isDirectory && !b.isDirectory) return -1;
    if (!a.isDirectory && b.isDirectory) return 1;
    
    switch (option) {
      case 'name':
        return a.name.localeCompare(b.name);
      
      case 'date':
        return b.modificationDate - a.modificationDate;
      
      case 'size':
        if (a.isDirectory && b.isDirectory) return 0;
        if (a.isDirectory) return 1;
        if (b.isDirectory) return -1;
        return b.size - a.size;
      
      case 'type':
        return a.extension.localeCompare(b.extension);
      
      default:
        return 0;
    }
  });
};

/**
 * Format date to readable string
 * @param timestamp - Unix timestamp in milliseconds
 * @returns Formatted date string
 */
export const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  // Today
  if (diffDays === 0) {
    return `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  }
  
  // Yesterday
  if (diffDays === 1) {
    return `Yesterday at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  }
  
  // This week
  if (diffDays < 7) {
    return date.toLocaleDateString([], { weekday: 'long' });
  }
  
  // This year
  if (now.getFullYear() === date.getFullYear()) {
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  }
  
  // Older
  return date.toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' });
};

/**
 * Generate unique ID for file item
 * @returns Unique string ID
 */
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Sanitize filename for safe usage
 * @param filename - Original filename
 * @returns Sanitized filename
 */
export const sanitizeFilename = (filename: string): string => {
  return filename
    .replace(/[<>:"/\\|?*]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
};

/**
 * Check if file is hidden (starts with dot)
 * @param filename - File name
 * @returns True if hidden
 */
export const isHiddenFile = (filename: string): boolean => {
  return filename.startsWith('.');
};
