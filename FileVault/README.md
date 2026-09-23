# FileVault - Mobile File Manager App

A modern, fast, and intuitive cross-platform mobile file manager built with React Native and Expo.

## 🚀 Features

- **File Browsing**: Navigate through device directories with list/grid view toggle
- **File Operations**: Copy, move, rename, delete, and share files
- **File Preview**: Preview images, PDFs, videos, audio, and text files
- **Search**: Real-time fuzzy search across file names with type filtering
- **Storage Analytics**: Visual breakdown of storage usage by category
- **Quick Access**: Fast access to common folders (Downloads, Documents, Pictures, etc.)
- **Recent Files**: Quick access to recently opened files
- **Dark Mode**: Support for light and dark themes
- **Material Design 3**: Beautiful UI following Material Design guidelines

## 📱 Screenshots

The app features:
- Home screen with storage overview and quick access folders
- Browse screen with breadcrumb navigation and file operations
- Search screen with real-time fuzzy search and filters
- Storage analytics with visual charts
- Settings for customization

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | React Native (v0.76+) with Expo SDK 52+ |
| Language | TypeScript (strict mode) |
| Navigation | React Navigation v7 (Stack + Bottom Tabs) |
| State Management | Zustand |
| File System | expo-file-system + expo-media-library |
| UI Components | React Native Paper (Material Design 3) |
| Icons | @expo/vector-icons (MaterialCommunityIcons) |
| Storage | AsyncStorage |
| Search | Fuse.js (fuzzy search) |
| Testing | Jest + React Native Testing Library |
| Linting | ESLint + Prettier |
| Build/Deploy | EAS Build |

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

```bash
# Check Node.js version (v20+ required)
node --version

# Check npm version (v10+ required)
npm --version

# Check Git
git --version
```

## 🚀 Getting Started

### 1. Install Dependencies

```bash
cd FileVault

# Install all dependencies
npm install

# Install Expo CLI and EAS CLI globally
npm install -g expo-cli eas-cli
```

### 2. Configure the Project

Update the following files with your own values:

**app.json**:
- Replace `your-project-id-here` with your actual EAS project ID
- Update bundle identifier/package name if needed

**eas.json**:
- Update `appleId` and `ascAppId` for iOS submission
- Add your Google Service Account key path for Android submission

### 3. Set Up Permissions

The app requires the following permissions which are already configured in `app.json`:

#### Android Permissions:
- `READ_EXTERNAL_STORAGE`
- `WRITE_EXTERNAL_STORAGE`
- `MANAGE_EXTERNAL_STORAGE`

#### iOS Permissions:
- `NSPhotoLibraryUsageDescription`
- `NSDocumentsFolderUsageDescription`
- `NSFileProtectionComplete`

### 4. Run the Development Server

```bash
# Start the development server
npm start

# Or use Expo CLI directly
npx expo start
```

### 5. Run on Device/Emulator

```bash
# Run on Android emulator
npm run android

# Run on iOS simulator (macOS only)
npm run ios

# Run on physical device
# Scan the QR code from the Expo Go app
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test -- FileItem.test.tsx
```

## 🔧 Linting & Formatting

```bash
# Run ESLint
npm run lint

# Format code with Prettier
npm run format
```

## 📦 Building for Production

### Development Build

```bash
# Create a development build
eas build --profile development --platform android
eas build --profile development --platform ios
```

### Preview Build (Internal Distribution)

```bash
# Android APK
eas build --profile preview --platform android

# iOS
eas build --profile preview --platform ios
```

### Production Build

```bash
# Android AAB (for Play Store)
eas build --profile production --platform android

# iOS IPA (for App Store)
eas build --profile production --platform ios
```

### Submit to Stores

```bash
# Submit to Google Play Store
eas submit --platform android

# Submit to Apple App Store
eas submit --platform ios
```

## 📁 Project Structure

```
FileVault/
├── App.tsx                 # Main app entry point
├── app.json                # Expo configuration
├── app.config.ts           # Dynamic Expo configuration
├── tsconfig.json           # TypeScript configuration
├── package.json            # Dependencies and scripts
├── eas.json                # EAS Build configuration
├── jest.config.js          # Jest testing configuration
├── .eslintrc.js            # ESLint configuration
├── .prettierrc             # Prettier configuration
├── src/
│   ├── navigation/
│   │   ├── AppNavigator.tsx    # Root stack navigator
│   │   ├── TabNavigator.tsx    # Bottom tab navigator
│   │   └── types.ts            # Navigation types
│   ├── screens/
│   │   ├── HomeScreen.tsx      # Home/overview screen
│   │   ├── BrowseScreen.tsx    # File browser screen
│   │   ├── SearchScreen.tsx    # Search screen
│   │   ├── PreviewScreen.tsx   # File preview screen
│   │   ├── SettingsScreen.tsx  # Settings screen
│   │   └── StorageScreen.tsx   # Storage analytics screen
│   ├── components/
│   │   ├── FileItem.tsx        # Single file row component
│   │   ├── FolderItem.tsx      # Folder row component
│   │   ├── FileGrid.tsx        # Grid view component
│   │   ├── BottomSheet.tsx     # Action bottom sheet
│   │   ├── SearchBar.tsx       # Search input component
│   │   ├── StorageBar.tsx      # Storage usage bar
│   │   ├── BreadcrumbNav.tsx   # Path breadcrumb navigation
│   │   └── EmptyState.tsx      # Empty state placeholder
│   ├── store/
│   │   ├── fileStore.ts        # File state management
│   │   └── settingsStore.ts    # Settings state management
│   ├── services/
│   │   ├── fileService.ts      # File system operations
│   │   ├── mediaService.ts     # Media library access
│   │   ├── searchService.ts    # Fuzzy search logic
│   │   └── storageService.ts   # Storage analytics
│   ├── utils/
│   │   ├── fileHelpers.ts      # File utility functions
│   │   ├── constants.ts        # App constants
│   │   └── permissions.ts      # Permission handlers
│   ├── hooks/
│   │   ├── useFiles.ts         # File operations hook
│   │   ├── usePermissions.ts   # Permissions hook
│   │   └── useStorage.ts       # Storage stats hook
│   ├── theme/
│   │   └── theme.ts            # App theming
│   └── types/
│       └── index.ts            # TypeScript interfaces
├── assets/                     # Images and icons
└── __tests__/                  # Test files
    ├── FileItem.test.tsx
    ├── fileHelpers.test.ts
    └── fileStore.test.ts
```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file if you need environment-specific configurations.

### EAS Project Setup

```bash
# Initialize EAS
eas init

# Configure builds
eas build:configure
```

## 🔐 Permissions Handling

The app handles permissions gracefully:

1. On first launch, it requests necessary storage permissions
2. If denied, it shows a friendly explanation screen
3. Provides a button to open device settings for manual permission grant

## 🎨 Theming

The app supports both light and dark themes:

- **Light Theme**: White surface with blue primary color (#1A73E8)
- **Dark Theme**: Dark surface (#1E1E1E) with same primary color
- **System Theme**: Follows device system preference

Change theme in Settings or set to "system" to follow device preferences.

## 📝 Key Implementation Details

### File Service
Uses `expo-file-system` for all file operations:
- `readDirectoryAsync()` - List directory contents
- `getInfoAsync()` - Get file metadata
- `copyAsync()` - Copy files/folders
- `moveAsync()` - Move files/folders
- `deleteAsync()` - Delete files/folders
- `makeDirectoryAsync()` - Create folders
- `writeAsStringAsync()` / `readAsStringAsync()` - Text file operations

### State Management
Zustand stores for:
- **fileStore**: Current path, files, selection, sort options, view mode
- **settingsStore**: Theme, sort preferences, view mode, hidden files setting

### Search
Fuse.js provides fuzzy search capabilities with:
- Real-time search results
- Type filtering (images, videos, audio, documents)
- Recent searches stored in AsyncStorage

## 🐛 Troubleshooting

### Common Issues

**Build fails on Android:**
```bash
# Clean and rebuild
cd android
./gradlew clean
cd ..
eas build --profile production --platform android
```

**iOS build issues:**
```bash
# Clean derived data
rm -rf ~/Library/Developer/Xcode/DerivedData/*
eas build --profile production --platform ios
```

**Permission errors:**
- Ensure permissions are correctly set in `app.json`
- For Android 11+, `MANAGE_EXTERNAL_STORAGE` is required
- For iOS, ensure proper usage descriptions are set

**Metro bundler issues:**
```bash
# Clear cache
npx expo start -c
```

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For issues and questions:
- Create an issue on GitHub
- Check existing documentation
- Review Expo documentation: https://docs.expo.dev

---

**Built with ❤️ using React Native and Expo**
