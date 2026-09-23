// File: /workspace/FileVault/src/screens/BrowseScreen.tsx

import React, { useEffect, useCallback, useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Text, IconButton, Menu, FAB, ActivityIndicator, Snackbar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFileStore } from '../store/fileStore';
import { usePermissions } from '../hooks/usePermissions';
import { FileItem } from '../components/FileItem';
import { FolderItem } from '../components/FolderItem';
import { FileGrid } from '../components/FileGrid';
import { BreadcrumbNav } from '../components/BreadcrumbNav';
import { EmptyState } from '../components/EmptyState';
import { BottomSheet } from '../components/BottomSheet';
import type { FileItem as FileItemType, ViewMode } from '../types';
import { getFileIcon } from '../utils/fileHelpers';

interface BrowseScreenProps {
  navigation: any;
  route: any;
}

export const BrowseScreen: React.FC<BrowseScreenProps> = ({ navigation, route }) => {
  const { initialPath } = route.params || {};
  
  const { 
    currentPath, 
    files, 
    selectedFiles, 
    isLoading, 
    error,
    viewMode,
    loadFiles, 
    navigateToFolder, 
    goBack,
    selectFile, 
    clearSelection,
    deleteSelected,
    setViewMode,
  } = useFileStore();
  
  const { hasPermission, requestPermission, renderPermissionDenied } = usePermissions();
  const [showMenu, setShowMenu] = useState(false);
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    if (hasPermission) {
      const pathToLoad = initialPath || currentPath || '/';
      loadFiles(pathToLoad);
    }
  }, [initialPath, hasPermission]);

  const handleNavigateToFolder = useCallback((path: string) => {
    navigateToFolder(path);
    loadFiles(path);
  }, [navigateToFolder, loadFiles]);

  const handleGoBack = useCallback(() => {
    goBack();
    loadFiles(currentPath);
  }, [goBack, currentPath]);

  const handleFilePress = (file: FileItemType) => {
    if (selectedFiles.length > 0) {
      selectFile(file);
    } else {
      if (file.isDirectory) {
        handleNavigateToFolder(file.path);
      } else {
        navigation.navigate('Preview', { file });
      }
    }
  };

  const handleFileLongPress = (file: FileItemType) => {
    selectFile(file);
    setShowBottomSheet(true);
  };

  const handleBreadcrumbNavigate = (path: string) => {
    handleNavigateToFolder(path);
  };

  const handleSortChange = (option: 'name' | 'date' | 'size' | 'type') => {
    // Implement sorting logic
    setShowMenu(false);
  };

  const handleViewModeToggle = () => {
    setViewMode(viewMode === 'list' ? 'grid' : 'list');
  };

  const handleDelete = async () => {
    try {
      await deleteSelected();
      setSnackbarMessage(`${selectedFiles.length} item(s) deleted`);
      setShowSnackbar(true);
      setShowBottomSheet(false);
      clearSelection();
    } catch (err) {
      setSnackbarMessage('Failed to delete items');
      setShowSnackbar(true);
    }
  };

  const handleShare = async () => {
    // Implement share logic
    setShowBottomSheet(false);
  };

  const handleRename = () => {
    // Implement rename logic
    setShowBottomSheet(false);
  };

  const handleCopy = () => {
    // Implement copy logic
    setShowBottomSheet(false);
  };

  const handleMove = () => {
    // Implement move logic
    setShowBottomSheet(false);
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
        <MaterialCommunityIcons name="arrow-left" size={24} color="#1A73E8" />
      </TouchableOpacity>
      <View style={styles.headerTitleContainer}>
        <Text variant="titleLarge" style={styles.headerTitle}>
          Browse
        </Text>
        <Text variant="bodySmall" numberOfLines={1} style={styles.currentPath}>
          {currentPath}
        </Text>
      </View>
      <View style={styles.headerActions}>
        <Menu
          visible={showMenu}
          onDismiss={() => setShowMenu(false)}
          anchor={
            <IconButton
              icon="dots-vertical"
              size={24}
              onPress={() => setShowMenu(true)}
            />
          }
        >
          <Menu.Item onPress={() => handleSortChange('name')} title="Sort by Name" />
          <Menu.Item onPress={() => handleSortChange('date')} title="Sort by Date" />
          <Menu.Item onPress={() => handleSortChange('size')} title="Sort by Size" />
          <Menu.Item onPress={() => handleSortChange('type')} title="Sort by Type" />
          <Menu.Item onPress={handleViewModeToggle} title={`Switch to ${viewMode === 'list' ? 'Grid' : 'List'} View`} />
        </Menu>
      </View>
    </View>
  );

  const renderItem = ({ item }: { item: FileItemType }) => {
    const isSelected = selectedFiles.some(f => f.id === item.id);
    
    if (item.isDirectory) {
      return (
        <FolderItem
          folder={item}
          onPress={() => handleFilePress(item)}
          onLongPress={() => handleFileLongPress(item)}
          isSelected={isSelected}
        />
      );
    }
    
    return (
      <FileItem
        file={item}
        onPress={() => handleFilePress(item)}
        onLongPress={() => handleFileLongPress(item)}
        isSelected={isSelected}
      />
    );
  };

  if (!hasPermission) {
    return renderPermissionDenied();
  }

  return (
    <View style={styles.container}>
      {renderHeader()}
      
      <BreadcrumbNav path={currentPath} onNavigate={handleBreadcrumbNavigate} />
      
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1A73E8" />
        </View>
      ) : files.length === 0 ? (
        <EmptyState
          title="This folder is empty"
          subtitle="No files or folders here yet"
        />
      ) : viewMode === 'list' ? (
        <FlatList
          data={files}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshing={isLoading}
          onRefresh={() => loadFiles(currentPath)}
        />
      ) : (
        <FileGrid
          files={files}
          selectedFiles={selectedFiles}
          onFilePress={handleFilePress}
          onFileLongPress={handleFileLongPress}
        />
      )}

      {selectedFiles.length > 0 && (
        <FAB
          icon="delete"
          label={`Delete (${selectedFiles.length})`}
          style={styles.deleteFab}
          onPress={handleDelete}
          color="#FFFFFF"
        />
      )}

      <BottomSheet
        visible={showBottomSheet}
        onClose={() => setShowBottomSheet(false)}
        selectedFiles={selectedFiles}
        onDelete={handleDelete}
        onShare={handleShare}
        onRename={handleRename}
        onCopy={handleCopy}
        onMove={handleMove}
      />

      <Snackbar
        visible={showSnackbar}
        onDismiss={() => setShowSnackbar(false)}
        duration={3000}
        action={{
          label: 'Undo',
          onPress: () => {
            // Implement undo logic
          },
        }}
      >
        {snackbarMessage}
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  backButton: {
    marginRight: 8,
  },
  headerTitleContainer: {
    flex: 1,
  },
  headerTitle: {
    fontWeight: '600',
  },
  currentPath: {
    color: '#757575',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingBottom: 80,
  },
  deleteFab: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: '#EA4335',
  },
});
