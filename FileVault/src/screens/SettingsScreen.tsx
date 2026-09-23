// File: /workspace/FileVault/src/screens/SettingsScreen.tsx

import React from 'react';
import { View, StyleSheet, ScrollView, Switch } from 'react-native';
import { Text, Card, List, Divider, Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSettingsStore } from '../store/settingsStore';
import type { ThemeMode, SortOption, ViewMode } from '../types';

interface SettingsScreenProps {
  navigation: any;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
  const {
    themeMode,
    setThemeMode,
    sortOption,
    setSortOption,
    viewMode,
    setViewMode,
    showHiddenFiles,
    setShowHiddenFiles,
    clearSearchHistory,
  } = useSettingsStore();

  const handleClearHistory = () => {
    clearSearchHistory();
    // Show snackbar or alert
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.title}>
          Settings
        </Text>
      </View>

      {/* Appearance Section */}
      <Card style={styles.sectionCard}>
        <Card.Title title="Appearance" />
        <Divider />
        <Card.Content>
          <List.Item
            title="Dark Mode"
            description="Switch between light and dark theme"
            left={(props) => (
              <List.Icon {...props} icon="theme-light-dark" />
            )}
            right={() => (
              <Switch
                value={themeMode === 'dark'}
                onValueChange={(value) => setThemeMode(value ? 'dark' : 'light')}
                trackColor={{ false: '#767577', true: '#1A73E8' }}
                thumbColor={themeMode === 'dark' ? '#FFFFFF' : '#f4f3f4'}
              />
            )}
          />
        </Card.Content>
      </Card>

      {/* File Browser Section */}
      <Card style={styles.sectionCard}>
        <Card.Title title="File Browser" />
        <Divider />
        <Card.Content>
          <List.Item
            title="Default Sort"
            description={`Currently: ${sortOption.charAt(0).toUpperCase() + sortOption.slice(1)}`}
            left={(props) => <List.Icon {...props} icon="sort" />}
            right={() => (
              <View style={styles.sortButtons}>
                {(['name', 'date', 'size', 'type'] as SortOption[]).map((option) => (
                  <Button
                    key={option}
                    mode={sortOption === option ? 'contained' : 'outlined'}
                    onPress={() => setSortOption(option)}
                    style={[
                      styles.sortButton,
                      sortOption === option && styles.sortButtonActive,
                    ]}
                    compact
                  >
                    {option.charAt(0).toUpperCase()}
                  </Button>
                ))}
              </View>
            )}
          />
          <Divider style={styles.divider} />
          <List.Item
            title="Default View"
            description={`Currently: ${viewMode.charAt(0).toUpperCase() + viewMode.slice(1)}`}
            left={(props) => <List.Icon {...props} icon="view-grid" />}
            right={() => (
              <View style={styles.viewButtons}>
                <Button
                  mode={viewMode === 'list' ? 'contained' : 'outlined'}
                  onPress={() => setViewMode('list')}
                  style={[
                    styles.viewButton,
                    viewMode === 'list' && styles.viewButtonActive,
                  ]}
                  icon="format-list-bulleted"
                  compact
                >
                  List
                </Button>
                <Button
                  mode={viewMode === 'grid' ? 'contained' : 'outlined'}
                  onPress={() => setViewMode('grid')}
                  style={[
                    styles.viewButton,
                    viewMode === 'grid' && styles.viewButtonActive,
                  ]}
                  icon="grid"
                  compact
                >
                  Grid
                </Button>
              </View>
            )}
          />
          <Divider style={styles.divider} />
          <List.Item
            title="Show Hidden Files"
            description="Display files starting with '.'"
            left={(props) => <List.Icon {...props} icon="eye" />}
            right={() => (
              <Switch
                value={showHiddenFiles}
                onValueChange={setShowHiddenFiles}
                trackColor={{ false: '#767577', true: '#1A73E8' }}
                thumbColor={showHiddenFiles ? '#FFFFFF' : '#f4f3f4'}
              />
            )}
          />
        </Card.Content>
      </Card>

      {/* Storage Section */}
      <Card style={styles.sectionCard}>
        <Card.Title title="Storage" />
        <Divider />
        <Card.Content>
          <List.Item
            title="Clear Search History"
            description="Remove all recent searches"
            left={(props) => <List.Icon {...props} icon="history" />}
            right={() => (
              <Button 
                mode="outlined" 
                onPress={handleClearHistory}
                textColor="#EA4335"
              >
                Clear
              </Button>
            )}
          />
        </Card.Content>
      </Card>

      {/* About Section */}
      <Card style={styles.sectionCard}>
        <Card.Title title="About" />
        <Divider />
        <Card.Content>
          <List.Item
            title="App Version"
            description="1.0.0"
            left={(props) => <List.Icon {...props} icon="information" />}
          />
          <List.Item
            title="Built with"
            description="React Native + Expo"
            left={(props) => <List.Icon {...props} icon="code-tags" />}
          />
          <View style={styles.creditsContainer}>
            <MaterialCommunityIcons name="heart" size={24} color="#EA4335" />
            <Text variant="bodyMedium" style={styles.creditsText}>
              Made with ❤️ for efficient file management
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
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontWeight: '700',
    color: '#1A73E8',
  },
  sectionCard: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  divider: {
    marginVertical: 8,
  },
  sortButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    maxWidth: 200,
  },
  sortButton: {
    marginRight: 4,
    marginBottom: 4,
    borderColor: '#1A73E8',
  },
  sortButtonActive: {
    backgroundColor: '#1A73E8',
  },
  viewButtons: {
    flexDirection: 'row',
  },
  viewButton: {
    marginRight: 8,
    borderColor: '#1A73E8',
  },
  viewButtonActive: {
    backgroundColor: '#1A73E8',
  },
  creditsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  creditsText: {
    marginLeft: 8,
    color: '#757575',
  },
  footer: {
    height: 32,
  },
});
