// File: src/components/FileGrid.tsx

import React from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { FileItem as FileItemType, ViewMode } from '@types/index';
import { FileItem } from './FileItem';
import { COLORS } from '@utils/constants';

interface FileGridProps {
  files: FileItemType[];
  selectedFiles: FileItemType[];
  viewMode?: ViewMode;
  isLoading?: boolean;
  isSelectionMode?: boolean;
  onRefresh?: () => void;
  onFilePress?: (file: FileItemType) => void;
  onFileLongPress?: (file: FileItemType) => void;
  ListEmptyComponent?: React.ReactNode;
}

export const FileGrid: React.FC<FileGridProps> = ({
  files,
  selectedFiles,
  viewMode = 'list',
  isLoading = false,
  isSelectionMode = false,
  onRefresh,
  onFilePress,
  onFileLongPress,
  ListEmptyComponent,
}) => {
  const isSelected = (file: FileItemType) => {
    return selectedFiles.some(f => f.id === file.id);
  };

  const renderItem = ({ item }: { item: FileItemType }) => (
    <FileItem
      file={item}
      isSelected={isSelected(item)}
      isSelectionMode={isSelectionMode}
      viewMode={viewMode}
      onPress={() => onFilePress?.(item)}
      onLongPress={() => onFileLongPress?.(item)}
    />
  );

  if (viewMode === 'grid') {
    return (
      <FlatList
        data={files}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={3}
        contentContainerStyle={styles.gridContent}
        refreshing={isLoading}
        onRefresh={onRefresh}
        ListEmptyComponent={ListEmptyComponent}
      />
    );
  }

  // List view
  return (
    <FlatList
      data={files}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContent}
      refreshing={isLoading}
      onRefresh={onRefresh}
      ListEmptyComponent={ListEmptyComponent}
    />
  );
};

const styles = StyleSheet.create({
  gridContent: {
    padding: 4,
  },
  listContent: {
    paddingBottom: 80, // Space for bottom sheet
  },
});
