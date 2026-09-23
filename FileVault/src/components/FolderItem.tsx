// File: src/components/FolderItem.tsx

import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import { FileItem as FileItemType } from '@types/index';
import { formatDate } from '@utils/fileHelpers';
import { COLORS } from '@utils/constants';

interface FolderItemProps {
  folder: FileItemType;
  onPress?: () => void;
  onLongPress?: () => void;
}

export const FolderItem: React.FC<FolderItemProps> = ({
  folder,
  onPress,
  onLongPress,
}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <IconButton
          icon="folder"
          size={48}
          iconColor={COLORS.primary}
        />
      </View>
      <View style={styles.content}>
        <Text
          variant="bodyMedium"
          numberOfLines={1}
          style={styles.folderName}
        >
          {folder.name}
        </Text>
        <Text variant="labelSmall" style={styles.folderMeta}>
          {formatDate(folder.modificationDate)}
        </Text>
      </View>
      <IconButton
        icon="chevron-right"
        size={24}
        iconColor={COLORS.textSecondary}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  iconContainer: {
    marginRight: 8,
  },
  content: {
    flex: 1,
  },
  folderName: {
    fontWeight: '500',
  },
  folderMeta: {
    color: COLORS.textSecondary,
    marginTop: 2,
  },
});
