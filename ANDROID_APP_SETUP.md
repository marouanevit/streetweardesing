# React Native Android App - ONARCHY

This is the Android app version of ONARCHY built with React Native & Expo.

## Quick Start

### 1. Install Expo CLI
```bash
npm install -g expo-cli
```

### 2. Create React Native Project
```bash
npx create-expo-app onarchy-mobile
cd onarchy-mobile
```

### 3. Copy App Files
Copy the files from this folder to your `onarchy-mobile/app/` directory

### 4. Install Dependencies
```bash
npm install expo-router expo-splash-screen expo-status-bar @react-navigation/native @react-navigation/bottom-tabs react-native-screens react-native-safe-area-context react-native-gesture-handler @supabase/supabase-js sonner
```

### 5. Generate APK for Android

#### Option A: Using Expo Go (Easiest - Test First)
```bash
expo start
# Scan QR code with Expo Go app on your Android phone
```

#### Option B: Build Standalone APK (Release to Google Play)
```bash
eas build --platform android --local
```

Or use Expo's cloud build:
```bash
npm install -g eas-cli
eas login
eas build --platform android
# Download APK when ready
```

### 6. Install APK on Android
- Download the APK file
- Transfer to Android phone or use adb
- Tap to install
- Done! 🎉

---

## File Structure
```
onarchy-mobile/
├── app/
│   ├── (tabs)/
│   │   ├── studio.tsx      # Design generation
│   │   ├── library.tsx     # Saved designs
│   │   └── _layout.tsx     # Tab navigation
│   └── index.tsx           # Home screen
├── app.json                # App config
├── eas.json                # Expo build config
└── package.json
```

## Environment Variables

Create `.env.local`:
```
EXPO_PUBLIC_SUPABASE_URL=your-supabase-url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
EXPO_PUBLIC_API_URL=your-vercel-url
```

---

## Next Steps
1. Run `expo start`
2. Test on Android with Expo Go
3. When ready, build APK with `eas build`
4. Share APK with friends or upload to Google Play Store

Questions? Check Expo docs: https://docs.expo.dev
