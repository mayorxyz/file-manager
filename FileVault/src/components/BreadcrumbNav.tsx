// File: /workspace/FileVault/src/components/BreadcrumbNav.tsx

import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface BreadcrumbProps {
  path: string;
  onNavigate: (path: string) => void;
}

export const BreadcrumbNav: React.FC<BreadcrumbProps> = ({ path, onNavigate }) => {
  const segments = path.split('/').filter((s) => s !== '');
  
  const handleSegmentPress = (index: number) => {
    const newPath = '/' + segments.slice(0, index + 1).join('/');
    onNavigate(newPath);
  };

  const handleHomePress = () => {
    onNavigate('/');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleHomePress} style={styles.segment}>
        <MaterialCommunityIcons name="home" size={18} color="#1A73E8" />
      </TouchableOpacity>
      
      {segments.length > 0 && (
        <MaterialCommunityIcons name="chevron-right" size={18} color="#666" />
      )}
      
      {segments.map((segment, index) => (
        <React.Fragment key={`${segment}-${index}`}>
          <TouchableOpacity 
            onPress={() => handleSegmentPress(index)} 
            style={styles.segment}
          >
            <Text 
              numberOfLines={1} 
              style={[
                styles.segmentText,
                index === segments.length - 1 && styles.activeSegment
              ]}
            >
              {segment.length > 15 ? segment.substring(0, 15) + '...' : segment}
            </Text>
          </TouchableOpacity>
          
          {index < segments.length - 1 && (
            <MaterialCommunityIcons name="chevron-right" size={18} color="#666" />
          )}
        </React.Fragment>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F5F5F5',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  segment: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  segmentText: {
    fontSize: 14,
    color: '#666',
    maxWidth: 120,
  },
  activeSegment: {
    color: '#1A73E8',
    fontWeight: '600',
  },
});
