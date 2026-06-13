import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { Sparkles, Download } from "lucide-react-native";
import { supabase } from "../lib/supabase";

export default function StudioScreen() {
  const [prompt, setPrompt] = useState("");
  const [variations, setVariations] = useState(4);
  const [generating, setGenerating] = useState(false);
  const [results, setResults] = useState<string[]>([]);

  const generate = async () => {
    if (!prompt.trim()) {
      Alert.alert("Error", "Please enter a prompt");
      return;
    }

    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-design", {
        body: { 
          prompt, 
          variations, 
          transparent: true
        },
      });

      if (error) throw error;
      
      const images = data.images as string[];
      setResults(images);
      Alert.alert("Success", `Generated ${images.length} designs!`);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Generation failed";
      Alert.alert("Error", msg);
    } finally {
      setGenerating(false);
    }
  };

  const download = async (dataUrl: string, index: number) => {
    try {
      // For React Native, we'd use expo-file-system and expo-sharing
      Alert.alert("Download", `Design ${index + 1} ready to download`);
    } catch (e) {
      Alert.alert("Error", "Download failed");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Sparkles color="#fff" size={24} />
        <Text style={styles.title}>Design Studio</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Your Prompt</Text>
        <TextInput
          style={styles.input}
          placeholder="Chrome skull, cyberpunk samurai, graffiti..."
          placeholderTextColor="#666"
          value={prompt}
          onChangeText={setPrompt}
          multiline
          numberOfLines={4}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Variations: {variations}</Text>
        <View style={styles.slider}>
          {[1, 2, 4, 6, 8].map((v) => (
            <TouchableOpacity
              key={v}
              style={[styles.varBtn, variations === v && styles.varBtnActive]}
              onPress={() => setVariations(v)}
            >
              <Text style={variations === v ? styles.varBtnTextActive : styles.varBtnText}>{v}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity
        style={[styles.generateBtn, generating && styles.generateBtnDisabled]}
        onPress={generate}
        disabled={generating}
      >
        {generating ? (
          <ActivityIndicator color="#000" />
        ) : (
          <>
            <Sparkles color="#000" size={20} />
            <Text style={styles.generateBtnText}>Generate Designs</Text>
          </>
        )}
      </TouchableOpacity>

      {results.length > 0 && (
        <View style={styles.resultsSection}>
          <Text style={styles.resultsTitle}>Generated Designs</Text>
          {results.map((img, i) => (
            <View key={i} style={styles.resultCard}>
              <Image source={{ uri: img }} style={styles.resultImage} />
              <TouchableOpacity 
                style={styles.downloadBtn}
                onPress={() => download(img, i)}
              >
                <Download color="#fff" size={20} />
                <Text style={styles.downloadBtnText}>Download #{i + 1}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    gap: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: "#999",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 8,
    padding: 12,
    color: "#fff",
    fontSize: 14,
    minHeight: 100,
  },
  slider: {
    flexDirection: "row",
    gap: 8,
  },
  varBtn: {
    flex: 1,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 6,
    alignItems: "center",
  },
  varBtnActive: {
    backgroundColor: "#fff",
    borderColor: "#fff",
  },
  varBtnText: {
    color: "#999",
    fontWeight: "600",
  },
  varBtnTextActive: {
    color: "#000",
    fontWeight: "600",
  },
  generateBtn: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginBottom: 24,
  },
  generateBtnDisabled: {
    opacity: 0.6,
  },
  generateBtnText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  resultsSection: {
    marginTop: 20,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 12,
  },
  resultCard: {
    backgroundColor: "#1a1a1a",
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 12,
  },
  resultImage: {
    width: "100%",
    height: 300,
    backgroundColor: "#0a0a0a",
  },
  downloadBtn: {
    flexDirection: "row",
    backgroundColor: "#ff6b6b",
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  downloadBtnText: {
    color: "#fff",
    fontWeight: "600",
  },
});
