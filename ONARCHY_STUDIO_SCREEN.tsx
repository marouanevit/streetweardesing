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
import { supabase } from "../ONARCHY_SUPABASE_CONFIG";

export default function StudioScreen() {
  const [prompt, setPrompt] = useState("");
  const [variations, setVariations] = useState(4);
  const [transparent, setTransparent] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [results, setResults] = useState<string[]>([]);

  const generate = async () => {
    if (!prompt.trim()) {
      Alert.alert("Oops", "Enter a design prompt");
      return;
    }

    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-design", {
        body: {
          prompt,
          variations,
          transparent,
        },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      const images = data.images as string[];
      setResults(images);
      Alert.alert("Success!", `Generated ${images.length} designs`);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Generation failed";
      Alert.alert("Error", msg);
    } finally {
      setGenerating(false);
    }
  };

  const downloadDesign = async (index: number) => {
    Alert.alert("Download", `Design #${index + 1} is ready!\n\nLong press image to save`);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>✨ Design Studio</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>PROMPT</Text>
        <TextInput
          style={styles.input}
          placeholder="Chrome skull, cyberpunk samurai, graffiti king..."
          placeholderTextColor="#666"
          value={prompt}
          onChangeText={setPrompt}
          multiline
          numberOfLines={5}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>VARIATIONS: {variations}</Text>
        <View style={styles.variationGrid}>
          {[1, 2, 4, 6, 8].map((v) => (
            <TouchableOpacity
              key={v}
              style={[
                styles.variationBtn,
                variations === v && styles.variationBtnActive,
              ]}
              onPress={() => setVariations(v)}
            >
              <Text
                style={
                  variations === v
                    ? styles.variationBtnTextActive
                    : styles.variationBtnText
                }
              >
                {v}
              </Text>
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
          <ActivityIndicator color="#000" size="large" />
        ) : (
          <Text style={styles.generateBtnText}>🎨 GENERATE</Text>
        )}
      </TouchableOpacity>

      {results.length > 0 && (
        <View style={styles.resultsSection}>
          <Text style={styles.resultsTitle}>GENERATED DESIGNS</Text>
          {results.map((img, i) => (
            <View key={i} style={styles.designCard}>
              <Image
                source={{ uri: img }}
                style={styles.designImage}
                resizeMode="contain"
              />
              <TouchableOpacity
                style={styles.downloadBtn}
                onPress={() => downloadDesign(i)}
              >
                <Text style={styles.downloadBtnText}>📥 Download #{i + 1}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      {results.length === 0 && !generating && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>✍️ Write a prompt and start creating</Text>
        </View>
      )}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
    paddingHorizontal: 16,
  },
  header: {
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#222",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#fff",
  },
  section: {
    marginTop: 24,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "600",
    color: "#888",
    marginBottom: 8,
    letterSpacing: 1,
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
  variationGrid: {
    flexDirection: "row",
    gap: 8,
  },
  variationBtn: {
    flex: 1,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 6,
    alignItems: "center",
  },
  variationBtnActive: {
    backgroundColor: "#fff",
    borderColor: "#fff",
  },
  variationBtnText: {
    color: "#999",
    fontWeight: "600",
  },
  variationBtnTextActive: {
    color: "#000",
    fontWeight: "600",
  },
  generateBtn: {
    marginTop: 24,
    marginBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  generateBtnDisabled: {
    opacity: 0.6,
  },
  generateBtnText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
  },
  resultsSection: {
    marginTop: 20,
  },
  resultsTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  designCard: {
    backgroundColor: "#1a1a1a",
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 12,
  },
  designImage: {
    width: "100%",
    height: 350,
    backgroundColor: "#0a0a0a",
  },
  downloadBtn: {
    backgroundColor: "#ff6b6b",
    paddingVertical: 12,
    alignItems: "center",
  },
  downloadBtnText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  emptyState: {
    marginTop: 60,
    alignItems: "center",
  },
  emptyStateText: {
    color: "#666",
    fontSize: 16,
  },
});
