// File: src/components/FileItem.tsx

import React from 'react';
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Text, IconButton, Checkbox } from 'react-native-paper';
import { FileItem as FileItemType } from '@types/index';
import { getFileIcon, formatFileSize, formatDate } from '@utils/fileHelpers';
import { COLORS } from '@utils/constants';

interface FileItemProps {
  file: FileItemType;
  isSelected?: boolean;
  isSelectionMode?: boolean;
  viewMode?: 'list' | 'grid';
  onPress?: () => void;
  onLongPress?: () => void;
}

export const FileItem: React.FC<FileItemProps> = ({
  file,
  isSelected = false,
  isSelectionMode = false,
  viewMode = 'list',
  onPress,
  onLongPress,
}) => {
  const icon = getFileIcon(file);

  if (viewMode === 'grid') {
    return (
      <TouchableOpacity
        style={[styles.gridContainer, isSelected && styles.gridSelected]}
        onPress={onPress}
        onLongPress={onLongPress}
        activeOpacity={0.7}
      >
        <View style={styles.gridIconContainer}>
          <IconButton
            icon={icon}
            size={40}
            iconColor={file.isDirectory ? COLORS.primary : COLORS.textSecondary}
          />
          {isSelectionMode && (
            <View style={styles.gridCheckbox}>
              <Checkbox
                status={isSelected ? 'checked' : 'unchecked'}
                onPress={onPress}
              />
            </View>
          )}
        </View>
        <Text
          variant="bodySmall"
          numberOfLines={2}
          style={[styles.gridName, isSelected && styles.selectedText]}
        >
          {file.name}
        </Text>
        {!file.isDirectory && (
          <Text variant="labelSmall" style={styles.gridSize}>
            {formatFileSize(file.size)}
          </Text>
        )}
      </TouchableOpacity>
    );
  }

  // List view (default)
  return (
    <TouchableOpacity
      style={[styles.listContainer, isSelected && styles.listSelected]}
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.7}
    >
      {isSelectionMode && (
        <Checkbox
          status={isSelected ? 'checked' : 'unchecked'}
          onPress={onPress}
        />
      )}
      <IconButton
        icon={icon}
        size={32}
        iconColor={file.isDirectory ? COLORS.primary : COLORS.textSecondary}
      />
      <View style={styles.listContent}>
        <Text
          variant="bodyMedium"
          numberOfLines={1}
          style={[styles.fileName, isSelected && styles.selectedText]}
        >
          {file.name}
        </Text>
        <Text variant="labelSmall" style={styles.fileMeta}>
          {!file.isDirectory && `${formatFileSize(file.size)} • `}
          {formatDate(file.modificationDate)}
        </Text>
      </View>
      {Platform.OS === 'ios' && !isSelectionMode && (
        <IconButton icon="chevron-right" size={20} iconColor={COLORS.textSecondary} />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // Grid view styles
  gridContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 12,
    margin: 4,
    alignItems: 'center',
    width: '33%',
    minWidth: 100,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  gridSelected: {
    backgroundColor: '#E8F0FE',
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  gridIconContainer: {
    position: 'relative',
    alignItems: 'center',
  },
  gridCheckbox: {
    position: 'absolute',
    top: -5,
    right: -5,
  },
  gridName: {
    textAlign: 'center',
    marginTop: 4,
    fontWeight: '500',
  },
  gridSize: {
    textAlign: 'center',
    marginTop: 2,
    color: COLORS.textSecondary,
  },
  
  // List view styles
  listContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  listSelected: {
    backgroundColor: '#E8F0FE',
  },
  listContent: {
    flex: 1,
    marginLeft: 8,
  },
  fileName: {
    fontWeight: '500',
  },
  fileMeta: {
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  selectedText: {
    color: COLORS.primary,
    fontWeight: '600',
  },
});
