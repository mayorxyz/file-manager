// File: /workspace/FileVault/src/screens/HomeScreen.tsx

import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Card, IconButton, ActivityIndicator } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFileStore } from '../store/fileStore';
import { useSettingsStore } from '../store/settingsStore';
import { useStorage } from '../hooks/useStorage';
import { StorageBar } from '../components/StorageBar';
import { FileItem as FileItemType } from '../types';
import { getFileIcon, formatFileSize } from '../utils/fileHelpers';

const QUICK_ACCESS_FOLDERS = [
  { name: 'Downloads', icon: 'download', path: '/Download' },
  { name: 'Documents', icon: 'file-document', path: '/Documents' },
  { name: 'Pictures', icon: 'image', path: '/Pictures' },
  { name: 'Music', icon: 'music-note', path: '/Music' },
  { name: 'Videos', icon: 'video', path: '/Movies' },
  { name: 'DCIM', icon: 'camera', path: '/DCIM' },
];

interface HomeScreenProps {
  navigation: any;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { storageInfo, loading: storageLoading } = useStorage();
  const { recentFiles, loadRecentFiles } = useFileStore();
  const { themeMode } = useSettingsStore();

  useEffect(() => {
    loadRecentFiles();
  }, []);

  const handleQuickAccessPress = (folder: typeof QUICK_ACCESS_FOLDERS[0]) => {
    navigation.navigate('Browse', { initialPath: folder.path });
  };

  const handleFilePress = (file: FileItemType) => {
    if (file.isDirectory) {
      navigation.navigate('Browse', { initialPath: file.path });
    } else {
      navigation.navigate('Preview', { file });
    }
  };

  const renderRecentFiles = () => {
    if (recentFiles.length === 0) {
      return (
        <View style={styles.emptyRecent}>
          <Text variant="bodyMedium" style={styles.emptyText}>
            No recent files
          </Text>
        </View>
      );
    }

    return recentFiles.slice(0, 5).map((file, index) => (
      <TouchableOpacity 
        key={file.id} 
        onPress={() => handleFilePress(file)}
        style={styles.recentFileItem}
      >
        <MaterialCommunityIcons 
          name={getFileIcon(file.name, file.isDirectory) as any} 
          size={32} 
          color="#1A73E8" 
        />
        <View style={styles.recentFileInfo}>
          <Text numberOfLines={1} style={styles.recentFileName}>
            {file.name}
          </Text>
          <Text variant="bodySmall" style={styles.recentFileSize}>
            {formatFileSize(file.size)}
          </Text>
        </View>
      </TouchableOpacity>
    ));
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.title}>
          FileVault
        </Text>
        <IconButton 
          icon="magnify" 
          size={24} 
          onPress={() => navigation.navigate('Search')}
        />
      </View>

      {storageLoading ? (
        <ActivityIndicator size="large" color="#1A73E8" style={styles.loading} />
      ) : storageInfo ? (
        <StorageBar storageInfo={storageInfo} />
      ) : null}

      {/* Quick Access Section */}
      <View style={styles.section}>
        <Text variant="titleMedium" style={styles.sectionTitle}>
          Quick Access
        </Text>
        <View style={styles.quickAccessGrid}>
          {QUICK_ACCESS_FOLDERS.map((folder, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleQuickAccessPress(folder)}
              style={styles.quickAccessItem}
            >
              <View style={styles.quickAccessIcon}>
                <MaterialCommunityIcons 
                  name={folder.icon as any} 
                  size={28} 
                  color="#FFFFFF" 
                />
              </View>
              <Text numberOfLines={1} style={styles.quickAccessName}>
                {folder.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Recent Files Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Recent Files
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Browse')}>
            <Text style={styles.seeAllLink}>See All</Text>
          </TouchableOpacity>
        </View>
        <Card style={styles.recentFilesCard}>
          <Card.Content>
            {renderRecentFiles()}
          </Card.Content>
        </Card>
      </View>

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
  loading: {
    marginVertical: 16,
  },
  section: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontWeight: '600',
    color: '#424242',
  },
  seeAllLink: {
    color: '#1A73E8',
    fontSize: 14,
  },
  quickAccessGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickAccessItem: {
    width: '30%',
    alignItems: 'center',
    marginBottom: 16,
  },
  quickAccessIcon: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#1A73E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  quickAccessName: {
    fontSize: 12,
    textAlign: 'center',
    maxWidth: 80,
  },
  recentFilesCard: {
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  recentFileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  recentFileInfo: {
    flex: 1,
    marginLeft: 12,
  },
  recentFileName: {
    fontWeight: '500',
    fontSize: 14,
  },
  recentFileSize: {
    color: '#757575',
    fontSize: 12,
  },
  emptyRecent: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  emptyText: {
    color: '#9E9E9E',
  },
  footer: {
    height: 32,
  },
});
