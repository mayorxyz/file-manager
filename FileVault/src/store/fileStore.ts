// File: src/store/fileStore.ts

import { create } from 'zustand';
import { FileItem, SortOption, ViewMode } from '@types/index';
import { readDirectory, deleteFile, moveFile, copyFile, renameFile, getParentPath } from '@services/fileService';
import { sortFiles } from '@utils/fileHelpers';

interface FileState {
  // State
  currentPath: string;
  pathHistory: string[];
  files: FileItem[];
  selectedFiles: FileItem[];
  sortOption: SortOption;
  viewMode: ViewMode;
  isLoading: boolean;
  error: string | null;
  showHiddenFiles: boolean;
  
  // Actions
  loadFiles: (path: string) => Promise<void>;
  navigateToFolder: (path: string) => void;
  goBack: () => void;
  goToHome: () => void;
  selectFile: (file: FileItem) => void;
  selectMultipleFiles: (files: FileItem[]) => void;
  clearSelection: () => void;
  deleteSelected: () => Promise<void>;
  moveSelected: (destinationPath: string) => Promise<void>;
  copySelected: (destinationPath: string) => Promise<void>;
  renameSelected: (newName: string) => Promise<void>;
  setSortOption: (option: SortOption) => void;
  setViewMode: (mode: ViewMode) => void;
  setShowHiddenFiles: (show: boolean) => void;
  setError: (error: string | null) => void;
  refreshCurrentPath: () => Promise<void>;
}

const getBasePath = (): string => {
  return '/';
};

export const useFileStore = create<FileState>((set, get) => ({
  // Initial state
  currentPath: getBasePath(),
  pathHistory: [],
  files: [],
  selectedFiles: [],
  sortOption: 'name',
  viewMode: 'list',
  isLoading: false,
  error: null,
  showHiddenFiles: false,
  
  // Load files from a directory
  loadFiles: async (path: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const files = await readDirectory(path, get().showHiddenFiles);
      const sorted = sortFiles(files, get().sortOption);
      
      set({
        files: sorted,
        currentPath: path,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to load files',
        isLoading: false,
      });
    }
  },
  
  // Navigate to a folder
  navigateToFolder: (path: string) => {
    set(state => ({
      pathHistory: [...state.pathHistory, state.currentPath],
    }));
    get().loadFiles(path);
  },
  
  // Go back to parent directory
  goBack: () => {
    const { pathHistory, currentPath } = get();
    
    if (pathHistory.length > 0) {
      const previousPath = pathHistory[pathHistory.length - 1];
      const newHistory = pathHistory.slice(0, -1);
      
      set({ pathHistory: newHistory });
      get().loadFiles(previousPath);
    } else {
      // No history, go to parent of current path
      const parentPath = getParentPath(currentPath);
      if (parentPath !== currentPath) {
        get().loadFiles(parentPath);
      }
    }
  },
  
  // Go to home directory
  goToHome: () => {
    set({ pathHistory: [] });
    get().loadFiles(getBasePath());
  },
  
  // Select a single file
  selectFile: (file: FileItem) => {
    set(state => {
      const isSelected = state.selectedFiles.some(f => f.id === file.id);
      
      if (isSelected) {
        return {
          selectedFiles: state.selectedFiles.filter(f => f.id !== file.id),
        };
      } else {
        return {
          selectedFiles: [...state.selectedFiles, file],
        };
      }
    });
  },
  
  // Select multiple files
  selectMultipleFiles: (files: FileItem[]) => {
    set({ selectedFiles: files });
  },
  
  // Clear selection
  clearSelection: () => {
    set({ selectedFiles: [] });
  },
  
  // Delete selected files
  deleteSelected: async () => {
    const { selectedFiles } = get();
    
    if (selectedFiles.length === 0) return;
    
    set({ isLoading: true });
    
    try {
      for (const file of selectedFiles) {
        await deleteFile(file.path);
      }
      
      // Reload current directory
      await get().loadFiles(get().currentPath);
      set({ selectedFiles: [], isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to delete files',
        isLoading: false,
      });
    }
  },
  
  // Move selected files to destination
  moveSelected: async (destinationPath: string) => {
    const { selectedFiles, currentPath } = get();
    
    if (selectedFiles.length === 0) return;
    
    set({ isLoading: true });
    
    try {
      for (const file of selectedFiles) {
        const destPath = `${destinationPath}/${file.name}`;
        await moveFile(file.path, destPath);
      }
      
      // Reload current directory
      await get().loadFiles(currentPath);
      set({ selectedFiles: [], isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to move files',
        isLoading: false,
      });
    }
  },
  
  // Copy selected files to destination
  copySelected: async (destinationPath: string) => {
    const { selectedFiles, currentPath } = get();
    
    if (selectedFiles.length === 0) return;
    
    set({ isLoading: true });
    
    try {
      for (const file of selectedFiles) {
        const destPath = `${destinationPath}/${file.name}`;
        await copyFile(file.path, destPath);
      }
      
      // Reload current directory
      await get().loadFiles(currentPath);
      set({ selectedFiles: [], isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to copy files',
        isLoading: false,
      });
    }
  },
  
  // Rename selected file (only works for single selection)
  renameSelected: async (newName: string) => {
    const { selectedFiles, currentPath } = get();
    
    if (selectedFiles.length !== 1) return;
    
    const file = selectedFiles[0];
    
    set({ isLoading: true });
    
    try {
      await renameFile(file.path, newName);
      
      // Reload current directory
      await get().loadFiles(currentPath);
      set({ selectedFiles: [], isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to rename file',
        isLoading: false,
      });
    }
  },
  
  // Set sort option
  setSortOption: (option: SortOption) => {
    set({ sortOption: option });
    // Re-sort current files
    const { files } = get();
    set({ files: sortFiles(files, option) });
  },
  
  // Set view mode
  setViewMode: (mode: ViewMode) => {
    set({ viewMode: mode });
  },
  
  // Toggle hidden files visibility
  setShowHiddenFiles: (show: boolean) => {
    set({ showHiddenFiles: show });
    // Reload current directory with new setting
    get().loadFiles(get().currentPath);
  },
  
  // Set error
  setError: (error: string | null) => {
    set({ error });
  },
  
  // Refresh current path
  refreshCurrentPath: async () => {
    const { currentPath } = get();
    await get().loadFiles(currentPath);
  },
}));
