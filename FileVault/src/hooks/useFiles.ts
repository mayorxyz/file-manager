// File: src/hooks/useFiles.ts

import { useCallback } from 'react';
import { useFileStore } from '@store/fileStore';
import { FileItem } from '@types/index';

/**
 * Custom hook for file operations
 */
export const useFiles = () => {
  const {
    currentPath,
    pathHistory,
    files,
    selectedFiles,
    isLoading,
    error,
    sortOption,
    viewMode,
    showHiddenFiles,
    loadFiles,
    navigateToFolder,
    goBack,
    goToHome,
    selectFile,
    selectMultipleFiles,
    clearSelection,
    deleteSelected,
    moveSelected,
    copySelected,
    renameSelected,
    setSortOption,
    setViewMode,
    setShowHiddenFiles,
    setError,
    refreshCurrentPath,
  } = useFileStore();

  /**
   * Navigate into a folder
   */
  const openFolder = useCallback((folder: FileItem) => {
    if (folder.isDirectory) {
      navigateToFolder(folder.path);
    }
  }, [navigateToFolder]);

  /**
   * Check if a file is currently selected
   */
  const isSelected = useCallback((file: FileItem) => {
    return selectedFiles.some(f => f.id === file.id);
  }, [selectedFiles]);

  /**
   * Toggle selection for a file
   */
  const toggleSelection = useCallback((file: FileItem) => {
    selectFile(file);
  }, [selectFile]);

  /**
   * Get count of selected files
   */
  const selectedCount = selectedFiles.length;

  /**
   * Check if any files are selected
   */
  const hasSelection = selectedCount > 0;

  /**
   * Check if all files are selected
   */
  const allSelected = files.length > 0 && selectedCount === files.length;

  /**
   * Select all files in current directory
   */
  const selectAll = useCallback(() => {
    selectMultipleFiles(files);
  }, [files, selectMultipleFiles]);

  /**
   * Handle file press (open folder or select file)
   */
  const handleFilePress = useCallback((file: FileItem, isSelectionMode: boolean) => {
    if (isSelectionMode) {
      toggleSelection(file);
    } else if (file.isDirectory) {
      openFolder(file);
    } else {
      // For files, we might want to preview them
      // This would be handled by the parent component
      toggleSelection(file);
    }
  }, [toggleSelection, openFolder]);

  return {
    // State
    currentPath,
    pathHistory,
    files,
    selectedFiles,
    isLoading,
    error,
    sortOption,
    viewMode,
    showHiddenFiles,
    
    // Computed
    selectedCount,
    hasSelection,
    allSelected,
    isSelected,
    
    // Actions
    loadFiles,
    navigateToFolder,
    goBack,
    goToHome,
    openFolder,
    selectFile,
    selectMultipleFiles,
    clearSelection,
    deleteSelected,
    moveSelected,
    copySelected,
    renameSelected,
    setSortOption,
    setViewMode,
    setShowHiddenFiles,
    setError,
    refreshCurrentPath,
    toggleSelection,
    selectAll,
    handleFilePress,
  };
};
