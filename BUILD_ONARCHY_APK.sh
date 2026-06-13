#!/bin/bash

# ONARCHY Mobile App - Complete Android APK Builder
# This script builds the APK ready to install on Android phones

echo "🎨 ONARCHY Mobile - Android APK Builder"
echo "========================================"
echo ""

# Check requirements
if ! command -v node &> /dev/null; then
    echo "❌ Node.js required. Install from nodejs.org"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "❌ npm required."
    exit 1
fi

echo "✅ Requirements met. Starting build..."
echo ""

# Step 1: Install Expo CLI
echo "📦 Step 1: Installing Expo CLI..."
npm install -g expo-cli eas-cli

# Step 2: Create project
echo ""
echo "📱 Step 2: Creating React Native project..."
npx create-expo-app onarchy-mobile
cd onarchy-mobile

# Step 3: Install dependencies
echo ""
echo "📚 Step 3: Installing dependencies..."
npm install expo-router @react-navigation/native @react-navigation/bottom-tabs react-native-screens react-native-safe-area-context react-native-gesture-handler @supabase/supabase-js lucide-react-native expo-image-picker expo-file-system expo-sharing

# Step 4: Create directory structure
echo ""
echo "📁 Step 4: Creating app structure..."
mkdir -p app app/tabs lib

# Step 5: Copy files
echo ""
echo "📋 Step 5: Creating app files..."

# Create app.json with config
cat > app.json << 'EOF'
{
  "expo": {
    "name": "ONARCHY",
    "slug": "onarchy-design",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "dark",
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#000000"
      },
      "package": "com.onarchy.design",
      "permissions": ["INTERNET", "READ_EXTERNAL_STORAGE", "WRITE_EXTERNAL_STORAGE"],
      "versionCode": 1
    },
    "extra": {
      "eas": {
        "projectId": "onarchy-design"
      }
    }
  }
}
EOF

# Create Supabase config
mkdir -p lib
cat > lib/supabase.ts << 'EOF'
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://vzmfxuogwqjqepzhxqzn.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_WuWUAJIUvsMJcR9PPuK2UA_GMr7iZDs";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
EOF

# Create Studio screen
cat > app/tabs/studio.tsx << 'EOF'
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { supabase } from "../../lib/supabase";

export default function StudioScreen() {
  const [prompt, setPrompt] = useState("");
  const [variations, setVariations] = useState(4);
  const [generating, setGenerating] = useState(false);
  const [results, setResults] = useState<string[]>([]);

  const generate = async () => {
    if (!prompt.trim()) {
      Alert.alert("Oops", "Enter a prompt");
      return;
    }

    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-design", {
        body: { prompt, variations, transparent: true },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      setResults(data.images);
      Alert.alert("Success", `Generated ${data.images.length} designs!`);
    } catch (e) {
      Alert.alert("Error", e instanceof Error ? e.message : "Failed");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>✨ Design Studio</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>PROMPT</Text>
        <TextInput
          style={styles.input}
          placeholder="Chrome skull, cyberpunk..."
          placeholderTextColor="#666"
          value={prompt}
          onChangeText={setPrompt}
          multiline
          numberOfLines={5}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>VARIATIONS: {variations}</Text>
        <View style={styles.varGrid}>
          {[1, 2, 4, 6, 8].map((v) => (
            <TouchableOpacity
              key={v}
              style={[styles.varBtn, variations === v && styles.varBtnActive]}
              onPress={() => setVariations(v)}
            >
              <Text style={variations === v ? styles.varBtnTextActive : styles.varBtnText}>
                {v}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity style={[styles.btn, generating && styles.btnDisabled]} onPress={generate} disabled={generating}>
        {generating ? <ActivityIndicator color="#000" /> : <Text style={styles.btnText}>🎨 GENERATE</Text>}
      </TouchableOpacity>

      {results.map((img, i) => (
        <View key={i} style={styles.card}>
          <Image source={{ uri: img }} style={styles.img} resizeMode="contain" />
          <TouchableOpacity style={styles.dlBtn}>
            <Text style={styles.dlBtnText}>📥 #{i + 1}</Text>
          </TouchableOpacity>
        </View>
      ))}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0a0a0a", paddingHorizontal: 16 },
  header: { paddingVertical: 20 },
  title: { fontSize: 28, fontWeight: "700", color: "#fff" },
  section: { marginTop: 20 },
  label: { fontSize: 11, fontWeight: "600", color: "#888", marginBottom: 8, letterSpacing: 1 },
  input: { backgroundColor: "#1a1a1a", borderWidth: 1, borderColor: "#333", borderRadius: 8, padding: 12, color: "#fff", minHeight: 100 },
  varGrid: { flexDirection: "row", gap: 8 },
  varBtn: { flex: 1, paddingVertical: 10, borderWidth: 1, borderColor: "#333", borderRadius: 6, alignItems: "center" },
  varBtnActive: { backgroundColor: "#fff", borderColor: "#fff" },
  varBtnText: { color: "#999", fontWeight: "600" },
  varBtnTextActive: { color: "#000", fontWeight: "600" },
  btn: { marginVertical: 20, backgroundColor: "#fff", borderRadius: 8, paddingVertical: 16, alignItems: "center" },
  btnDisabled: { opacity: 0.6 },
  btnText: { fontSize: 16, fontWeight: "700", color: "#000" },
  card: { backgroundColor: "#1a1a1a", borderRadius: 8, marginBottom: 12, overflow: "hidden" },
  img: { width: "100%", height: 350, backgroundColor: "#0a0a0a" },
  dlBtn: { backgroundColor: "#ff6b6b", paddingVertical: 12, alignItems: "center" },
  dlBtnText: { color: "#fff", fontWeight: "600" },
});
EOF

# Create main app file
cat > app/index.tsx << 'EOF'
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎨 ONARCHY</Text>
      <Text style={styles.subtitle}>AI Streetwear Design</Text>

      <TouchableOpacity style={styles.btn} onPress={() => router.push("/(tabs)/studio")}>
        <Text style={styles.btnText}>Enter Studio →</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0a0a0a", justifyContent: "center", alignItems: "center" },
  title: { fontSize: 48, fontWeight: "700", color: "#fff", marginBottom: 8 },
  subtitle: { fontSize: 18, color: "#999", marginBottom: 40 },
  btn: { backgroundColor: "#fff", paddingVertical: 14, paddingHorizontal: 30, borderRadius: 8 },
  btnText: { fontSize: 16, fontWeight: "700", color: "#000" },
});
EOF

echo ""
echo "✅ App created successfully!"
echo ""
echo "═════════════════════════════════════════"
echo "NEXT: BUILD THE APK"
echo "═════════════════════════════════════════"
echo ""
echo "Option 1: Test First (Quick)"
echo "  expo start"
echo "  (Scan QR code with Expo Go app)"
echo ""
echo "Option 2: Build APK (For Distribution)"
echo "  eas login"
echo "  eas build --platform android"
echo ""
echo "The APK will be ready to install on Android!"
echo ""
