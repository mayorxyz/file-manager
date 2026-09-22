// File: src/utils/constants.ts

import { QuickAccessFolder } from '@types/index';

/**
 * App-wide constants
 */

// Color palette
export const COLORS = {
  primary: '#1A73E8', // Google Blue
  secondary: '#34A853', // Green
  error: '#EA4335', // Red
  warning: '#FBBC05', // Yellow
  surface: '#FFFFFF',
  surfaceDark: '#1E1E1E',
  background: '#F5F5F5',
  backgroundDark: '#121212',
  text: '#202124',
  textDark: '#E8EAED',
  textSecondary: '#5F6368',
  textSecondaryDark: '#9AA0A6',
  divider: '#DADCE0',
  dividerDark: '#3C4043',
};

// Category colors for storage breakdown
export const CATEGORY_COLORS = {
  images: '#4285F4',
  videos: '#EA4335',
  audio: '#FBBC05',
  documents: '#34A853',
  apps: '#9AA0A6',
  other: '#FF6D01',
};

// File type icons mapping
export const FILE_TYPE_ICONS: Record<string, string> = {
  folder: 'folder',
  image: 'image',
  video: 'video',
  audio: 'music-note',
  document: 'file-document',
  pdf: 'file-pdf-box',
  archive: 'zip-box',
  code: 'code-tags',
  default: 'file-outline',
};

// File extension to MIME type mapping
export const EXTENSION_MIME_MAP: Record<string, string> = {
  // Images
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  gif: 'image/gif',
  bmp: 'image/bmp',
  webp: 'image/webp',
  svg: 'image/svg+xml',
  
  // Videos
  mp4: 'video/mp4',
  avi: 'video/x-msvideo',
  mkv: 'video/x-matroska',
  mov: 'video/quicktime',
  wmv: 'video/x-ms-wmv',
  flv: 'video/x-flv',
  webm: 'video/webm',
  
  // Audio
  mp3: 'audio/mpeg',
  wav: 'audio/wav',
  aac: 'audio/aac',
  ogg: 'audio/ogg',
  flac: 'audio/flac',
  m4a: 'audio/mp4',
  
  // Documents
  pdf: 'application/pdf',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  xls: 'application/vnd.ms-excel',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ppt: 'application/vnd.ms-powerpoint',
  pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  txt: 'text/plain',
  rtf: 'application/rtf',
  md: 'text/markdown',
  
  // Archives
  zip: 'application/zip',
  rar: 'application/vnd.rar',
  '7z': 'application/x-7z-compressed',
  tar: 'application/x-tar',
  gz: 'application/gzip',
  
  // Code
  js: 'application/javascript',
  ts: 'application/typescript',
  jsx: 'text/jsx',
  tsx: 'text/typescript-jsx',
  html: 'text/html',
  css: 'text/css',
  json: 'application/json',
  xml: 'application/xml',
  py: 'text/x-python',
  java: 'text/x-java',
  cpp: 'text/x-c++src',
  c: 'text/x-c',
  swift: 'text/x-swift',
  kt: 'text/x-kotlin',
};

// Quick access folders (platform-specific paths will be resolved at runtime)
export const QUICK_ACCESS_FOLDERS: QuickAccessFolder[] = [
  {
    id: 'downloads',
    name: 'Downloads',
    path: 'downloads',
    icon: 'download',
    color: CATEGORY_COLORS.documents,
  },
  {
    id: 'documents',
    name: 'Documents',
    path: 'documents',
    icon: 'file-document',
    color: CATEGORY_COLORS.documents,
  },
  {
    id: 'pictures',
    name: 'Pictures',
    path: 'pictures',
    icon: 'image',
    color: CATEGORY_COLORS.images,
  },
  {
    id: 'music',
    name: 'Music',
    path: 'music',
    icon: 'music-note',
    color: CATEGORY_COLORS.audio,
  },
  {
    id: 'videos',
    name: 'Videos',
    path: 'videos',
    icon: 'video',
    color: CATEGORY_COLORS.videos,
  },
];

// Storage category labels
export const STORAGE_CATEGORIES = [
  { label: 'Images', key: 'images', color: CATEGORY_COLORS.images, icon: 'image' },
  { label: 'Videos', key: 'videos', color: CATEGORY_COLORS.videos, icon: 'video' },
  { label: 'Audio', key: 'audio', color: CATEGORY_COLORS.audio, icon: 'music-note' },
  { label: 'Documents', key: 'documents', color: CATEGORY_COLORS.documents, icon: 'file-document' },
  { label: 'Apps', key: 'apps', color: CATEGORY_COLORS.apps, icon: 'applications' },
  { label: 'Other', key: 'other', color: CATEGORY_COLORS.other, icon: 'folder-outline' },
];

// Max recent searches to store
export const MAX_RECENT_SEARCHES = 10;

// Max recent files to show
export const MAX_RECENT_FILES = 10;

// Animation durations
export const ANIMATION_DURATION = {
  short: 150,
  medium: 250,
  long: 350,
};

// File size units
export const FILE_SIZE_UNITS = ['B', 'KB', 'MB', 'GB', 'TB'];

// Default sort option
export const DEFAULT_SORT_OPTION = 'name';

// Default view mode
export const DEFAULT_VIEW_MODE = 'list';

// Default theme mode
export const DEFAULT_THEME_MODE = 'system';
