// File: src/services/fileService.ts

import * as FileSystem from 'expo-file-system';
import { FileItem } from '@types/index';
import { getFileExtension, getMimeType, generateId, isHiddenFile } from '@utils/fileHelpers';

/**
 * Get the base directory path for file browsing
 */
export const getBasePath = (): string => {
  return FileSystem.documentDirectory || '/';
};

/**
 * Read directory contents and return FileItem array
 * @param path - Directory path to read
 * @param showHidden - Whether to show hidden files
 * @returns Promise<FileItem[]> - Array of file items
 */
export const readDirectory = async (path: string, showHidden: boolean = false): Promise<FileItem[]> => {
  try {
    // Ensure path ends with slash
    const dirPath = path.endsWith('/') ? path : `${path}/`;
    
    const entries = await FileSystem.readDirectoryAsync(dirPath);
    
    const fileItems: FileItem[] = [];
    
    for (const entry of entries) {
      // Skip hidden files if not showing them
      if (!showHidden && isHiddenFile(entry)) {
        continue;
      }
      
      try {
        const fullPath = `${dirPath}${entry}`;
        const info = await FileSystem.getInfoAsync(fullPath, { size: true });
        
        if (info.exists) {
          const extension = getFileExtension(entry);
          
          fileItems.push({
            id: generateId(),
            name: entry,
            path: fullPath,
            uri: fullPath,
            size: info.size || 0,
            isDirectory: !info.isFile,
            mimeType: info.isFile ? getMimeType(extension) : undefined,
            modificationDate: info.modificationTime ? new Date(info.modificationTime).getTime() : Date.now(),
            extension: extension,
          });
        }
      } catch (error) {
        console.error(`Error reading file ${entry}:`, error);
        // Continue with other files
      }
    }
    
    return fileItems;
  } catch (error) {
    console.error('Error reading directory:', error);
    throw new Error(`Failed to read directory: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Copy file or folder to destination
 * @param from - Source path
 * @param to - Destination path
 */
export const copyFile = async (from: string, to: string): Promise<void> => {
  try {
    await FileSystem.copyAsync({ from, to });
  } catch (error) {
    console.error('Error copying file:', error);
    throw new Error(`Failed to copy file: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Move file or folder to destination
 * @param from - Source path
 * @param to - Destination path
 */
export const moveFile = async (from: string, to: string): Promise<void> => {
  try {
    await FileSystem.moveAsync({ from, to });
  } catch (error) {
    console.error('Error moving file:', error);
    throw new Error(`Failed to move file: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Delete file or folder
 * @param path - Path to delete
 */
export const deleteFile = async (path: string): Promise<void> => {
  try {
    const info = await FileSystem.getInfoAsync(path);
    if (info.exists) {
      await FileSystem.deleteAsync(path, { idempotent: true });
    }
  } catch (error) {
    console.error('Error deleting file:', error);
    throw new Error(`Failed to delete file: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Rename file or folder
 * @param oldPath - Current path
 * @param newName - New name
 * @returns Promise<string> - New path
 */
export const renameFile = async (oldPath: string, newName: string): Promise<string> => {
  try {
    // Get parent directory
    const parts = oldPath.split('/').filter(Boolean);
    parts.pop();
    const parentDir = '/' + parts.join('/') + '/';
    
    const newPath = `${parentDir}${newName}`;
    await FileSystem.moveAsync({ from: oldPath, to: newPath });
    
    return newPath;
  } catch (error) {
    console.error('Error renaming file:', error);
    throw new Error(`Failed to rename file: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Create new folder
 * @param path - Parent directory path
 * @param folderName - Name of new folder
 * @returns Promise<string> - Path to created folder
 */
export const createFolder = async (path: string, folderName: string): Promise<string> => {
  try {
    const folderPath = `${path}/${folderName}`;
    await FileSystem.makeDirectoryAsync(folderPath, { intermediates: true });
    return folderPath;
  } catch (error) {
    console.error('Error creating folder:', error);
    throw new Error(`Failed to create folder: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Get file metadata
 * @param path - File path
 * @returns Promise<FileSystem.FileInfo>
 */
export const getFileInfo = async (path: string): Promise<FileSystem.FileInfo> => {
  try {
    return await FileSystem.getInfoAsync(path, { size: true });
  } catch (error) {
    console.error('Error getting file info:', error);
    throw new Error(`Failed to get file info: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Read text file content
 * @param path - File path
 * @returns Promise<string> - File content
 */
export const readTextFile = async (path: string): Promise<string> => {
  try {
    return await FileSystem.readAsStringAsync(path);
  } catch (error) {
    console.error('Error reading text file:', error);
    throw new Error(`Failed to read file: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Write text content to file
 * @param path - File path
 * @param content - Text content
 */
export const writeTextFile = async (path: string, content: string): Promise<void> => {
  try {
    await FileSystem.writeAsStringAsync(path, content);
  } catch (error) {
    console.error('Error writing text file:', error);
    throw new Error(`Failed to write file: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Check if path exists
 * @param path - File/folder path
 * @returns Promise<boolean>
 */
export const pathExists = async (path: string): Promise<boolean> => {
  try {
    const info = await FileSystem.getInfoAsync(path);
    return info.exists;
  } catch (error) {
    return false;
  }
};

/**
 * Get parent directory path
 * @param path - Current path
 * @returns string - Parent path
 */
export const getParentPath = (path: string): string => {
  const parts = path.split('/').filter(Boolean);
  parts.pop();
  return '/' + parts.join('/');
};

/**
 * Get current folder name from path
 * @param path - Full path
 * @returns string - Folder name
 */
export const getCurrentFolderName = (path: string): string => {
  const parts = path.split('/').filter(Boolean);
  return parts.pop() || 'Root';
};
