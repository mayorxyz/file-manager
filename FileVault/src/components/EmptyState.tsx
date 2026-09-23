// File: /workspace/FileVault/src/components/EmptyState.tsx

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface EmptyStateProps {
  icon?: string;
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = 'folder-open',
  title,
  subtitle,
  actionLabel,
  onAction,
}) => {
  return (
    <View style={styles.container}>
      <MaterialCommunityIcons 
        name={icon as any} 
        size={80} 
        color="#BDBDBD" 
        style={styles.icon}
      />
      <Text variant="titleLarge" style={styles.title}>
        {title}
      </Text>
      {subtitle && (
        <Text variant="bodyMedium" style={styles.subtitle}>
          {subtitle}
        </Text>
      )}
      {actionLabel && onAction && (
        <Button 
          mode="contained" 
          onPress={onAction}
          style={styles.button}
          icon="plus"
        >
          {actionLabel}
        </Button>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  icon: {
    marginBottom: 24,
  },
  title: {
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
    color: '#424242',
  },
  subtitle: {
    textAlign: 'center',
    color: '#757575',
    marginBottom: 24,
    maxWidth: 280,
  },
  button: {
    paddingHorizontal: 24,
  },
});
