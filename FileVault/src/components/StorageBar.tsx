// File: /workspace/FileVault/src/components/StorageBar.tsx

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, ProgressBar } from 'react-native-paper';
import type { StorageInfo } from '../types';

interface StorageBarProps {
  storageInfo: StorageInfo;
}

export const StorageBar: React.FC<StorageBarProps> = ({ storageInfo }) => {
  const { totalSpace, usedSpace, freeSpace } = storageInfo;
  const usagePercent = totalSpace > 0 ? usedSpace / totalSpace : 0;

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="titleMedium" style={styles.title}>Storage</Text>
        <Text variant="bodySmall" style={styles.subtitle}>
          {formatBytes(usedSpace)} used of {formatBytes(totalSpace)}
        </Text>
      </View>

      <ProgressBar 
        progress={usagePercent} 
        color="#1A73E8"
        style={styles.progressBar}
      />

      <View style={styles.categories}>
        {storageInfo.categories.map((category, index) => (
          <View key={index} style={styles.categoryItem}>
            <View style={styles.categoryInfo}>
              <View style={[styles.colorDot, { backgroundColor: category.color }]} />
              <Text variant="bodySmall">{category.label}</Text>
            </View>
            <Text variant="bodySmall" style={styles.categorySize}>
              {formatBytes(category.size)}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.freeSpaceContainer}>
        <Text variant="bodySmall" style={styles.freeSpaceLabel}>Free Space:</Text>
        <Text variant="bodyMedium" style={styles.freeSpaceValue}>
          {formatBytes(freeSpace)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  header: {
    marginBottom: 12,
  },
  title: {
    fontWeight: '600',
    marginBottom: 4,
  },
  subtitle: {
    color: '#666',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 16,
    backgroundColor: '#E0E0E0',
  },
  categories: {
    marginBottom: 12,
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  categorySize: {
    fontWeight: '500',
  },
  freeSpaceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  freeSpaceLabel: {
    color: '#666',
  },
  freeSpaceValue: {
    fontWeight: '600',
    color: '#34A853',
  },
});
