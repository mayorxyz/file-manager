// File: /workspace/FileVault/src/screens/StorageScreen.tsx

import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, ProgressBar, IconButton } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useStorage } from '../hooks/useStorage';
import { StorageBar } from '../components/StorageBar';
import { formatFileSize } from '../utils/fileHelpers';

interface StorageScreenProps {
  navigation: any;
}

export const StorageScreen: React.FC<StorageScreenProps> = ({ navigation }) => {
  const { storageInfo, loading, refreshStorage } = useStorage();

  if (loading || !storageInfo) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading storage info...</Text>
      </View>
    );
  }

  const { totalSpace, usedSpace, freeSpace, categories } = storageInfo;
  const usagePercent = totalSpace > 0 ? usedSpace / totalSpace : 0;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.title}>
          Storage Analytics
        </Text>
        <IconButton 
          icon="refresh" 
          size={24} 
          onPress={refreshStorage}
        />
      </View>

      {/* Main Storage Overview */}
      <Card style={styles.overviewCard}>
        <Card.Content>
          <View style={styles.overviewHeader}>
            <MaterialCommunityIcons name="sd" size={48} color="#1A73E8" />
            <View style={styles.overviewStats}>
              <Text variant="bodySmall" style={styles.overviewLabel}>
                Total Capacity
              </Text>
              <Text variant="headlineMedium" style={styles.overviewValue}>
                {formatFileSize(totalSpace)}
              </Text>
            </View>
          </View>
          
          <ProgressBar 
            progress={usagePercent} 
            color="#1A73E8"
            style={styles.progressBar}
          />
          
          <View style={styles.overviewDetails}>
            <View style={styles.detailItem}>
              <View style={styles.detailDotUsed} />
              <Text variant="bodySmall">Used</Text>
              <Text variant="bodySmall" style={styles.detailValue}>
                {formatFileSize(usedSpace)}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <View style={styles.detailDotFree} />
              <Text variant="bodySmall">Free</Text>
              <Text variant="bodySmall" style={styles.detailValue}>
                {formatFileSize(freeSpace)}
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Category Breakdown */}
      <Card style={styles.categoriesCard}>
        <Card.Title title="Storage by Category" />
        <Card.Content>
          {categories.map((category, index) => (
            <View key={index} style={styles.categoryRow}>
              <View style={styles.categoryIcon}>
                <MaterialCommunityIcons 
                  name={category.icon as any} 
                  size={24} 
                  color={category.color} 
                />
              </View>
              <View style={styles.categoryInfo}>
                <Text variant="bodyMedium" style={styles.categoryLabel}>
                  {category.label}
                </Text>
                <ProgressBar 
                  progress={totalSpace > 0 ? category.size / totalSpace : 0}
                  color={category.color}
                  style={styles.categoryProgress}
                />
              </View>
              <Text variant="bodyMedium" style={styles.categorySize}>
                {formatFileSize(category.size)}
              </Text>
            </View>
          ))}
        </Card.Content>
      </Card>

      {/* Storage Tips */}
      <Card style={styles.tipsCard}>
        <Card.Title title="Storage Tips" />
        <Card.Content>
          <View style={styles.tipItem}>
            <MaterialCommunityIcons name="lightbulb" size={20} color="#FBC02D" />
            <Text variant="bodySmall" style={styles.tipText}>
              Delete duplicate files to free up space
            </Text>
          </View>
          <View style={styles.tipItem}>
            <MaterialCommunityIcons name="lightbulb" size={20} color="#FBC02D" />
            <Text variant="bodySmall" style={styles.tipText}>
              Move large videos to cloud storage
            </Text>
          </View>
          <View style={styles.tipItem}>
            <MaterialCommunityIcons name="lightbulb" size={20} color="#FBC02D" />
            <Text variant="bodySmall" style={styles.tipText}>
              Clear app caches regularly
            </Text>
          </View>
          <View style={styles.tipItem}>
            <MaterialCommunityIcons name="lightbulb" size={20} color="#FBC02D" />
            <Text variant="bodySmall" style={styles.tipText}>
              Compress old documents and photos
            </Text>
          </View>
        </Card.Content>
      </Card>

      <View style={styles.footer} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontWeight: '700',
    color: '#1A73E8',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overviewCard: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  overviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  overviewStats: {
    flex: 1,
    marginLeft: 16,
  },
  overviewLabel: {
    color: '#757575',
    marginBottom: 4,
  },
  overviewValue: {
    fontWeight: '700',
  },
  progressBar: {
    height: 10,
    borderRadius: 5,
    backgroundColor: '#E0E0E0',
    marginBottom: 16,
  },
  overviewDetails: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailDotUsed: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#1A73E8',
    marginRight: 8,
  },
  detailDotFree: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#34A853',
    marginRight: 8,
  },
  detailValue: {
    fontWeight: '600',
    marginLeft: 4,
  },
  categoriesCard: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryLabel: {
    fontWeight: '500',
    marginBottom: 4,
  },
  categoryProgress: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E0E0E0',
  },
  categorySize: {
    fontWeight: '600',
    minWidth: 70,
    textAlign: 'right',
  },
  tipsCard: {
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  tipText: {
    flex: 1,
    marginLeft: 12,
    lineHeight: 20,
  },
  footer: {
    height: 32,
  },
});
