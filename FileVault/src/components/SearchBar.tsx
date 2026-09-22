// File: src/components/SearchBar.tsx

import React, { useState, useCallback } from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import { IconButton, ActivityIndicator } from 'react-native-paper';
import { COLORS } from '@utils/constants';

interface SearchBarProps {
  value: string;
  onChange: (text: string) => void;
  onSubmit?: (text: string) => void;
  onClear?: () => void;
  placeholder?: string;
  isLoading?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  onSubmit,
  onClear,
  placeholder = 'Search files...',
  isLoading = false,
}) => {
  const handleSubmit = useCallback(() => {
    onSubmit?.(value);
  }, [onSubmit, value]);

  const handleClear = useCallback(() => {
    onChange('');
    onClear?.();
  }, [onChange, onClear]);

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <IconButton
          icon="magnify"
          size={24}
          iconColor={COLORS.textSecondary}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChange}
          onSubmitEditing={handleSubmit}
          placeholder={placeholder}
          placeholderTextColor={COLORS.textSecondary}
          returnKeyType="search"
          autoCapitalize="none"
          autoCorrect={false}
        />
        {isLoading && (
          <ActivityIndicator
            size="small"
            color={COLORS.primary}
            style={styles.loader}
          />
        )}
        {value.length > 0 && !isLoading && (
          <IconButton
            icon="close-circle"
            size={24}
            iconColor={COLORS.textSecondary}
            onPress={handleClear}
            style={styles.clearIcon}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: COLORS.divider,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  searchIcon: {
    margin: 0,
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: COLORS.text,
    paddingVertical: 0,
  },
  loader: {
    marginRight: 8,
  },
  clearIcon: {
    margin: 0,
  },
});
