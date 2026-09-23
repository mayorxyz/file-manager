// File: src/utils/permissions.ts

import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { Platform, Linking, Alert } from 'react-native';

/**
 * Request storage permissions based on platform
 * @returns Promise<boolean> - True if permissions granted
 */
export const requestStoragePermissions = async (): Promise<boolean> => {
  try {
    if (Platform.OS === 'android') {
      // For Android 11+ (API 30+), we need MANAGE_EXTERNAL_STORAGE
      // For older versions, READ/WRITE_EXTERNAL_STORAGE is enough
      const androidVersion = parseInt(Platform.Version.toString(), 10);
      
      if (androidVersion >= 30) {
        // Android 11+ - Check if we have access to external storage
        const hasAccess = await FileSystem.getInfoAsync(FileSystem.documentDirectory);
        if (!hasAccess.exists) {
          // Need to request special permission
          return await requestManageExternalStorage();
        }
      } else {
        // Android 10 and below
        const { status } = await MediaLibrary.requestPermissionsAsync();
        return status === 'granted';
      }
      
      return true;
    }
    
    if (Platform.OS === 'ios') {
      // iOS - Request photo library and documents access
      const { status } = await MediaLibrary.requestPermissionsAsync();
      return status === 'granted';
    }
    
    return true;
  } catch (error) {
    console.error('Error requesting permissions:', error);
    return false;
  }
};

/**
 * Request MANAGE_EXTERNAL_STORAGE permission on Android 11+
 * This opens the system settings for the user to grant permission
 */
const requestManageExternalStorage = async (): Promise<boolean> => {
  return new Promise((resolve) => {
    Alert.alert(
      'Storage Permission Required',
      'FileVault needs access to manage all files on your device. Please grant the "All Files Access" permission in the next screen.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => resolve(false),
        },
        {
          text: 'Open Settings',
          onPress: async () => {
            try {
              await Linking.openSettings();
              // We can't directly check if permission was granted after returning from settings
              // The app should check again when it regains focus
              resolve(true);
            } catch (error) {
              resolve(false);
            }
          },
        },
      ],
      { cancelable: false }
    );
  });
};

/**
 * Check if storage permissions are already granted
 * @returns Promise<boolean> - True if permissions granted
 */
export const checkStoragePermissions = async (): Promise<boolean> => {
  try {
    if (Platform.OS === 'android') {
      const { status } = await MediaLibrary.getPermissionsAsync();
      return status === 'granted';
    }
    
    if (Platform.OS === 'ios') {
      const { status } = await MediaLibrary.getPermissionsAsync();
      return status === 'granted';
    }
    
    return true;
  } catch (error) {
    console.error('Error checking permissions:', error);
    return false;
  }
};

/**
 * Open app settings page
 */
export const openAppSettings = async (): Promise<void> => {
  try {
    await Linking.openSettings();
  } catch (error) {
    console.error('Error opening app settings:', error);
  }
};

/**
 * Show permission denied alert with option to open settings
 */
export const showPermissionDeniedAlert = (): void => {
  Alert.alert(
    'Permission Denied',
    'FileVault needs storage permissions to function. Please enable them in app settings.',
    [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Open Settings',
        onPress: openAppSettings,
      },
    ]
  );
};
