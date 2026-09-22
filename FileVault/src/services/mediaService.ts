// File: src/services/mediaService.ts

import * as MediaLibrary from 'expo-media-library';
import { Platform } from 'react-native';
import { FileItem } from '@types/index';
import { generateId, getFileExtension } from '@utils/fileHelpers';

/**
 * Get photos from device media library
 * @param album - Optional album name to filter
 * @param limit - Max number of photos to return
 * @returns Promise<FileItem[]>
 */
export const getPhotos = async (album?: string, limit: number = 50): Promise<FileItem[]> => {
  try {
    const options: MediaLibrary.MediaQueryOptions = {
      first: limit,
      mediaType: MediaLibrary.MediaType.photo,
    };
    
    if (album) {
      options.album = album;
    }
    
    const media = await MediaLibrary.getAssetsAsync(options);
    
    return media.assets.map(asset => ({
      id: asset.id,
      name: asset.filename || `IMG_${asset.id}.jpg`,
      path: asset.uri,
      uri: asset.uri,
      size: 0, // Media assets don't expose size directly
      isDirectory: false,
      mimeType: 'image/jpeg',
      modificationDate: asset.modificationTime,
      extension: getFileExtension(asset.filename || ''),
    }));
  } catch (error) {
    console.error('Error getting photos:', error);
    return [];
  }
};

/**
 * Get videos from device media library
 * @param limit - Max number of videos to return
 * @returns Promise<FileItem[]>
 */
export const getVideos = async (limit: number = 50): Promise<FileItem[]> => {
  try {
    const media = await MediaLibrary.getAssetsAsync({
      first: limit,
      mediaType: MediaLibrary.MediaType.video,
    });
    
    return media.assets.map(asset => ({
      id: asset.id,
      name: asset.filename || `VID_${asset.id}.mp4`,
      path: asset.uri,
      uri: asset.uri,
      size: 0,
      isDirectory: false,
      mimeType: 'video/mp4',
      modificationDate: asset.modificationTime,
      extension: getFileExtension(asset.filename || ''),
    }));
  } catch (error) {
    console.error('Error getting videos:', error);
    return [];
  }
};

/**
 * Get audio files from device media library
 * Note: This may require additional permissions on some devices
 * @param limit - Max number of audio files to return
 * @returns Promise<FileItem[]>
 */
export const getAudio = async (limit: number = 50): Promise<FileItem[]> => {
  try {
    const media = await MediaLibrary.getAssetsAsync({
      first: limit,
      mediaType: Platform.OS === 'ios' ? MediaLibrary.MediaType.audio : MediaLibrary.MediaType.photo,
    });
    
    // On Android, audio requires different API
    // This is a simplified implementation
    return media.assets
      .filter(asset => {
        const ext = getFileExtension(asset.filename || '').toLowerCase();
        return ['mp3', 'wav', 'aac', 'ogg', 'flac', 'm4a'].includes(ext);
      })
      .map(asset => ({
        id: asset.id,
        name: asset.filename || `AUDIO_${asset.id}.mp3`,
        path: asset.uri,
        uri: asset.uri,
        size: 0,
        isDirectory: false,
        mimeType: 'audio/mpeg',
        modificationDate: asset.modificationTime,
        extension: getFileExtension(asset.filename || ''),
      }));
  } catch (error) {
    console.error('Error getting audio files:', error);
    return [];
  }
};

/**
 * Save photo to device gallery
 * @param uri - URI of the image to save
 * @returns Promise<boolean> - Success status
 */
export const savePhoto = async (uri: string): Promise<boolean> => {
  try {
    const asset = await MediaLibrary.createAssetAsync(uri);
    return !!asset;
  } catch (error) {
    console.error('Error saving photo:', error);
    return false;
  }
};

/**
 * Delete media asset
 * @param assetId - ID of the asset to delete
 * @returns Promise<boolean> - Success status
 */
export const deleteMediaAsset = async (assetId: string): Promise<boolean> => {
  try {
    await MediaLibrary.deleteAssetsAsync([assetId]);
    return true;
  } catch (error) {
    console.error('Error deleting media asset:', error);
    return false;
  }
};

/**
 * Get albums from media library
 * @returns Promise<string[]>
 */
export const getAlbums = async (): Promise<string[]> => {
  try {
    const albums = await MediaLibrary.getAlbumsAsync();
    return albums.map(album => album.title);
  } catch (error) {
    console.error('Error getting albums:', error);
    return [];
  }
};
