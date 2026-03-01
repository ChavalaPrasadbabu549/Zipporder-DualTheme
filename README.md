# Zipporder-DualTheme

A modern React Native application built with a dual-theme system, using TypeScript, Redux Toolkit, and sophisticated navigation patterns.

## 🛠 Tech Stack

- **Framework**: [React Native](https://reactnative.dev/)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/) with Persistence
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Package Manager**: [npm](https://www.npmjs.com/)
- **Networking**: [Axios](https://axios-http.com/) with Interceptors
- **Navigation**: [React Navigation](https://reactnavigation.org/)
  - Native Stack Navigator
  - Bottom Tab Navigator
- **Styling**: React Native StyleSheet & Dynamic Theming
- **Icons**: [React Native Vector Icons](https://github.com/oblador/react-native-vector-icons)

## 📂 Project Structure

```text
src/
├── components/          # UI Components (Button, Input, ThemeText, ThemedSafeAreaView)
├── context/             # React Context (ThemeContext for Dual Theme)
├── hooks/               # Custom Typed Hooks (useAppDispatch, useAppSelector, useTheme)
├── navigation/          # Navigation Config (Root, Auth, Tab) and Nav Types
├── screens/             # Application Screens (Login, Register, Home, Profile)
├── store/               # Redux Store Configuration & Slices (Auth)
└── utils/               # Utilities (API, Colors, Validators, Types)
```

## ✨ Features

- 🌓 **Dual Theme System**: Support for Light and Dark modes with automatic Status Bar adjustment.
- 🔐 **Persistent Authentication**: Redux Toolkit with `AsyncStorage` to keep users logged in.
- 📸 **Profile Image Upload**: Integrated `react-native-image-picker` with smart `FormData` handling.
- 🎤 **Voice Search**: Real-time voice searching using `@react-native-voice/voice`.
- 🛍️ **Product Catalog**: Dynamic categories and products with price formatting.
- ✨ **Premium Design**: Modern, glassmorphism-inspired UI with smooth transitions.
- ✅ **Form Validation**: Robust client-side validation logic for reliable user data.

## 🚀 Getting Started

### Prerequisites

- Node.js >= 22.11.0
- npm
- React Native Environment Setup (Android/iOS)

### Installation

1. Clone the repository
2. Install dependencies:
   ```sh
   npm install
   ```

### Running the App

#### 1. Start Metro Bundler
```sh
npm start
```

#### 2. Android
```sh
npm run android
```

## 📦 Key Packages

### Main Dependencies
- `@react-navigation/native-stack`: High-performance native stack navigation.
- `@reduxjs/toolkit`: Modern state management for auth, products, and cart.
- `react-native-image-picker`: Handles camera and gallery for profile pictures.
- `@react-native-voice/voice`: Powers the voice-to-text search feature.
- `react-native-config`: Manages environment variables securely.
- `axios`: Centralized networking with smart interceptors.
- `react-native-vector-icons`: Ionicons for high-quality UI elements.

## 🏗 Build Release (Android APK)

To generate a production-ready Release APK:

1. **Clean**: `cd android && gradlew clean && cd ..`
2. **Build**: `cd android && gradlew assembleRelease && cd ..`
3. **Location**: `android/app/build/outputs/apk/release/app-release.apk`


## 📜 Technical Setup & Fixes

### 1. AsyncStorage Build Fix
A known issue in `async-storage` 3.x causes Android build failures (`Could not find org.asyncstorage.shared_storage`). 
**Solution**: This project uses version `2.1.1` to ensure stable Android builds.

### 2. Environment Variables
The `.env` file must contain `BASE_API_URL`.
Setup in `android/app/build.gradle`:
```gradle
apply from: project(':react-native-config').projectDir.getPath() + "/dotenv.gradle"
```

### 3. Redux Persistence
Unlike standard Redux, we use `initializeAuth` thunk in `RootNavigator.tsx` to restore session state from `AsyncStorage` before the initial render, preventing unwanted redirects to the login screen.

## 🛠 Troubleshooting

- **404 Errors**: Ensure your `BASE_API_URL` in `.env` does not include trailing slashes unless explicitly required by your endpoints.
- **Gradle Sync / Dependencies**: If encountering native module errors, run:
  ```sh
  cd android && gradlew clean && cd ..
  npm run android
  ```
- **Flickering Login Screen**: Fixed by setting `initialState.loading = true` in the auth slice, ensuring the Loading screen shows until the session check is complete.
