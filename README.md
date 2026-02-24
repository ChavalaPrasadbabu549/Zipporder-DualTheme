# Zipporder-DualTheme

A modern React Native application built with a dual-theme system, using TypeScript and Yarn.

## 🛠 Tech Stack

- **Framework**: [React Native](https://reactnative.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Package Manager**: [Yarn](https://yarnpkg.com/)
- **Navigation**: [React Navigation](https://reactnavigation.org/)
  - Stack Navigator
  - Bottom Tab Navigator

## 📂 Project Structure

```text
src/
├── components/          # Reusable UI components (Button, Card, Loading)
├── navigation/          # Navigation configuration & types
├── screens/             # Application screens (Login, Home, Orders, etc.)
└── utils/               # Utility functions (Formatters, Validators, Storage)
```

## 🚀 Getting Started

### Prerequisites

- Node.js >= 22.11.0
- Yarn
- React Native Environment Setup (Android/iOS)

### Installation

1. Clone the repository
2. Install dependencies:
   ```sh
   yarn install
   ```

### Running the App

#### 1. Start Metro Bundler
```sh
# Using npm
npm start

# Using Yarn
yarn start
```

#### 2. Android
```sh
# Using npm
npm run android

# Using Yarn
yarn android
```

#### 3. iOS
```sh
# Using npm
npm run ios

# Using Yarn
yarn ios
```

## 📦 Installed Packages

### Main Dependencies
- `@react-navigation/native`: Core navigation
- `@react-navigation/stack`: Stack-based navigation
- `@react-navigation/bottom-tabs`: Tab-based navigation
- `react-native-gesture-handler`: Gesture management
- `react-native-safe-area-context`: Safe area handling
- `react-native-screens`: Native screen primitives

### Dev Dependencies
- `typescript`: For static typing
- `eslint`: For code linting
- `prettier`: For code formatting
- `jest`: For testing

## 📜 Setup Reference

The following commands were used to initialize the project and install key dependencies:

### 1. Project Initialization
```sh
npx @react-native-community/cli init ZipporderDualTheme --pm yarn
```

### 2. Navigation Setup
```sh
yarn add @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs react-native-safe-area-context react-native-screens react-native-gesture-handler
```

### 3. Modernizing Dev Tools (Fixing Deprecations)
```sh
yarn add -D eslint@latest prettier@latest @react-native/eslint-config@latest @react-native/babel-preset@latest @react-native/metro-config@latest @react-native/typescript-config@latest typescript@latest
```

## 🛠 Troubleshooting

- If you see deprecation warnings during installation, these are often related to sub-dependencies of the core tools. The project is using the latest compatible versions.
- For Android, ensures `adb devices` shows your device/emulator.
- For iOS, run `bundle exec pod install` in the `ios` directory before building.
