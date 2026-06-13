#!/bin/bash

# ONARCHY Android APK Builder Script
# This script will build and generate an Android APK

echo "🚀 ONARCHY Android APK Builder"
echo "================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm not found. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm found"
echo ""

# Install Expo CLI globally
echo "📦 Installing Expo CLI..."
npm install -g expo-cli eas-cli

# Create new Expo app
echo "📱 Creating new React Native project..."
npx create-expo-app onarchy-mobile
cd onarchy-mobile

# Install dependencies
echo "📚 Installing dependencies..."
npm install expo-router @react-navigation/native @react-navigation/bottom-tabs react-native-screens react-native-safe-area-context react-native-gesture-handler @supabase/supabase-js

# Create .env.local file
echo "⚙️  Creating environment config..."
cat > .env.local << EOF
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
EXPO_PUBLIC_API_URL=https://your-vercel-domain.vercel.app
EOF

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo ""
echo "1. Update .env.local with your Supabase credentials"
echo ""
echo "2. Test on Android (install Expo Go app first):"
echo "   expo start"
echo ""
echo "3. Build APK:"
echo "   eas build --platform android"
echo ""
echo "4. Download and install on Android phone"
echo ""
echo "Happy coding! 🎨"
