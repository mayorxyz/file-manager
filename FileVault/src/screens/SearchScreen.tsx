// File: /workspace/FileVault/src/screens/SearchScreen.tsx

import React, { useState, useCallback } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Text, ActivityIndicator, Chip } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFileStore } from '../store/fileStore';
import { searchService } from '../services/searchService';
import { SearchBar } from '../components/SearchBar';
import { FileItem } from '../components/FileItem';
import { FolderItem } from '../components/FolderItem';
import { EmptyState } from '../components/EmptyState';
import type { FileItem as FileItemType } from '../types';
import { getFileIcon } from '../utils/fileHelpers';

type FileTypeFilter = 'all' | 'image' | 'video' | 'audio' | 'document' | 'folder';

interface SearchScreenProps {
  navigation: any;
}

export const SearchScreen: React.FC<SearchScreenProps> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<FileItemType[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FileTypeFilter>('all');
  
  const { files, loadFiles, currentPath } = useFileStore();

  const FILTERS: { key: FileTypeFilter; label: string; icon: string }[] = [
    { key: 'all', label: 'All', icon: 'apps' },
    { key: 'folder', label: 'Folders', icon: 'folder' },
    { key: 'image', label: 'Images', icon: 'image' },
    { key: 'video', label: 'Videos', icon: 'video' },
    { key: 'audio', label: 'Audio', icon: 'music-note' },
    { key: 'document', label: 'Docs', icon: 'file-document' },
  ];

  const handleSearch = useCallback(async (query: string) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      // Ensure files are loaded
      if (files.length === 0) {
        await loadFiles(currentPath || '/');
      }
      
      // Perform fuzzy search
      const results = await searchService.search(files, query);
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [files, currentPath]);

  const handleFilterChange = (filter: FileTypeFilter) => {
    setActiveFilter(filter);
    
    if (filter === 'all') {
      setSearchResults(searchResults);
      return;
    }

    // Filter results by type
    const filtered = searchResults.filter((item) => {
      if (filter === 'folder') return item.isDirectory;
      if (item.isDirectory) return false;
      
      switch (filter) {
        case 'image':
          return /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(item.name);
        case 'video':
          return /\.(mp4|avi|mkv|mov|wmv)$/i.test(item.name);
        case 'audio':
          return /\.(mp3|wav|flac|aac|ogg)$/i.test(item.name);
        case 'document':
          return /\.(pdf|doc|docx|xls|xlsx|ppt|pptx|txt|md)$/i.test(item.name);
        default:
          return true;
      }
    });
    
    setSearchResults(filtered);
  };

  const handleFilePress = (file: FileItemType) => {
    if (file.isDirectory) {
      navigation.navigate('Browse', { initialPath: file.path });
    } else {
      navigation.navigate('Preview', { file });
    }
  };

  const renderResult = ({ item }: { item: FileItemType }) => {
    if (item.isDirectory) {
      return (
        <FolderItem
          folder={item}
          onPress={() => handleFilePress(item)}
          isSelected={false}
        />
      );
    }
    
    return (
      <FileItem
        file={item}
        onPress={() => handleFilePress(item)}
        isSelected={false}
      />
    );
  };

  const renderFilters = () => (
    <View style={styles.filtersContainer}>
      <FlatList
        data={FILTERS}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => (
          <Chip
            selected={activeFilter === item.key}
            onPress={() => handleFilterChange(item.key)}
            style={styles.filterChip}
            selectedColor="#1A73E8"
            icon={item.icon as any}
          >
            {item.label}
          </Chip>
        )}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="titleLarge" style={styles.title}>
          Search Files
        </Text>
      </View>

      <SearchBar 
        value={searchQuery}
        onChange={handleSearch}
        placeholder="Search files and folders..."
      />

      {renderFilters()}

      {isSearching ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1A73E8" />
          <Text variant="bodyMedium" style={styles.loadingText}>
            Searching...
          </Text>
        </View>
      ) : searchQuery && searchResults.length === 0 ? (
        <EmptyState
          icon="magnify-remove-outline"
          title="No results found"
          subtitle={`No files match "${searchQuery}"`}
        />
      ) : searchResults.length > 0 ? (
        <FlatList
          data={searchResults}
          renderItem={renderResult}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.resultsList}
        />
      ) : (
        <EmptyState
          icon="magnify"
          title="Search for files"
          subtitle="Enter a search term to find files and folders on your device"
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontWeight: '600',
    color: '#424242',
  },
  filtersContainer: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  filterChip: {
    marginRight: 8,
    height: 36,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    color: '#757575',
  },
  resultsList: {
    padding: 16,
    paddingBottom: 32,
  },
});
