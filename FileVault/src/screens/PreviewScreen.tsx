// File: /workspace/FileVault/src/screens/PreviewScreen.tsx

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Image, Dimensions } from 'react-native';
import { Text, IconButton, ActivityIndicator, Surface } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import { shareAsync } from 'expo-sharing';
import type { FileItem as FileItemType } from '../types';
import { formatFileSize, getFileIcon } from '../utils/fileHelpers';

interface PreviewScreenProps {
  navigation: any;
  route: any;
}

export const PreviewScreen: React.FC<PreviewScreenProps> = ({ navigation }) => {
  const file: FileItemType = route.params?.file;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [textContent, setTextContent] = useState<string>('');
  const [pdfUri, setPdfUri] = useState<string>('');

  useEffect(() => {
    loadFileContent();
  }, [file]);

  const loadFileContent = async () => {
    try {
      setLoading(true);
      
      // For text files, read content
      if (isTextFile(file.name)) {
        const content = await FileSystem.readAsStringAsync(file.uri);
        setTextContent(content);
      }
      
      // For PDFs, use the URI directly
      if (file.extension.toLowerCase() === 'pdf') {
        setPdfUri(file.uri);
      }
      
      setLoading(false);
    } catch (err) {
      setError('Failed to load file content');
      setLoading(false);
    }
  };

  const isTextFile = (filename: string) => {
    return /\.(txt|md|json|xml|csv|js|ts|tsx|jsx|py|java|c|cpp|h|hpp)$/i.test(filename);
  };

  const isImageFile = (filename: string) => {
    return /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(filename);
  };

  const isVideoFile = (filename: string) => {
    return /\.(mp4|avi|mkv|mov|wmv)$/i.test(filename);
  };

  const isAudioFile = (filename: string) => {
    return /\.(mp3|wav|flac|aac|ogg)$/i.test(filename);
  };

  const isPdfFile = (filename: string) => {
    return /\.pdf$/i.test(filename);
  };

  const handleShare = async () => {
    try {
      await shareAsync(file.uri);
    } catch (err) {
      console.error('Share error:', err);
    }
  };

  const renderImagePreview = () => (
    <View style={styles.imageContainer}>
      <Image 
        source={{ uri: file.uri }} 
        style={styles.image}
        resizeMode="contain"
      />
    </View>
  );

  const renderVideoPreview = () => (
    <View style={styles.mediaContainer}>
      <MaterialCommunityIcons name="video" size={80} color="#1A73E8" />
      <Text variant="bodyMedium" style={styles.mediaPlaceholder}>
        Video preview not available
      </Text>
      <Text variant="bodySmall" style={styles.mediaSubtext}>
        Use a media player to watch this video
      </Text>
    </View>
  );

  const renderAudioPreview = () => (
    <View style={styles.mediaContainer}>
      <MaterialCommunityIcons name="music-note" size={80} color="#1A73E8" />
      <Text variant="bodyMedium" style={styles.mediaPlaceholder}>
        Audio preview not available
      </Text>
      <Text variant="bodySmall" style={styles.mediaSubtext}>
        Use a music player to listen to this audio
      </Text>
    </View>
  );

  const renderPdfPreview = () => (
    <View style={styles.pdfContainer}>
      <MaterialCommunityIcons name="file-pdf-box" size={80} color="#EA4335" />
      <Text variant="bodyMedium" style={styles.mediaPlaceholder}>
        PDF Document
      </Text>
      <Text variant="bodySmall" style={styles.mediaSubtext}>
        {formatFileSize(file.size)}
      </Text>
    </View>
  );

  const renderTextPreview = () => (
    <ScrollView style={styles.textContainer}>
      <Text style={styles.textContent}>{textContent}</Text>
    </ScrollView>
  );

  const renderPreview = () => {
    if (isImageFile(file.name)) {
      return renderImagePreview();
    }
    if (isVideoFile(file.name)) {
      return renderVideoPreview();
    }
    if (isAudioFile(file.name)) {
      return renderAudioPreview();
    }
    if (isPdfFile(file.name)) {
      return renderPdfPreview();
    }
    if (isTextFile(file.name)) {
      return renderTextPreview();
    }
    
    // Default preview for unknown file types
    return (
      <View style={styles.mediaContainer}>
        <MaterialCommunityIcons 
          name={getFileIcon(file.name, false) as any} 
          size={80} 
          color="#757575" 
        />
        <Text variant="bodyMedium" style={styles.mediaPlaceholder}>
          Preview not available
        </Text>
        <Text variant="bodySmall" style={styles.mediaSubtext}>
          {file.extension.toUpperCase()} file • {formatFileSize(file.size)}
        </Text>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1A73E8" />
        <Text variant="bodyMedium" style={styles.loadingText}>
          Loading file...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <IconButton 
          icon="arrow-left" 
          size={24} 
          onPress={() => navigation.goBack()}
        />
        <View style={styles.headerTitle}>
          <Text numberOfLines={1} style={styles.fileName}>
            {file.name}
          </Text>
          <Text variant="bodySmall" style={styles.fileInfo}>
            {formatFileSize(file.size)} • {file.extension.toUpperCase()}
          </Text>
        </View>
        <IconButton 
          icon="share-variant" 
          size={24} 
          onPress={handleShare}
        />
      </View>

      {error ? (
        <View style={styles.errorContainer}>
          <MaterialCommunityIcons name="alert-circle" size={48} color="#EA4335" />
          <Text variant="bodyLarge" style={styles.errorText}>
            {error}
          </Text>
        </View>
      ) : (
        renderPreview()
      )}

      <Surface style={styles.infoPanel}>
        <View style={styles.infoRow}>
          <MaterialCommunityIcons name="information" size={20} color="#757575" />
          <View style={styles.infoContent}>
            <Text variant="bodySmall" style={styles.infoLabel}>Path</Text>
            <Text numberOfLines={2} variant="bodySmall" style={styles.infoValue}>
              {file.path}
            </Text>
          </View>
        </View>
        <View style={styles.infoRow}>
          <MaterialCommunityIcons name="calendar" size={20} color="#757575" />
          <View style={styles.infoContent}>
            <Text variant="bodySmall" style={styles.infoLabel}>Modified</Text>
            <Text variant="bodySmall" style={styles.infoValue}>
              {new Date(file.modificationDate).toLocaleDateString()}
            </Text>
          </View>
        </View>
      </Surface>
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
    paddingHorizontal: 8,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  headerTitle: {
    flex: 1,
    marginHorizontal: 8,
  },
  fileName: {
    fontWeight: '600',
    fontSize: 16,
  },
  fileInfo: {
    color: '#757575',
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
  imageContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  image: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height - 200,
  },
  mediaContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  mediaPlaceholder: {
    marginTop: 16,
    fontWeight: '500',
  },
  mediaSubtext: {
    marginTop: 8,
    color: '#757575',
  },
  pdfContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  textContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  textContent: {
    fontFamily: 'monospace',
    fontSize: 14,
    lineHeight: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  errorText: {
    marginTop: 16,
    color: '#EA4335',
    textAlign: 'center',
  },
  infoPanel: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  infoContent: {
    flex: 1,
    marginLeft: 12,
  },
  infoLabel: {
    color: '#757575',
    marginBottom: 2,
  },
  infoValue: {
    color: '#424242',
  },
});
