import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS, SIZES } from "../constants/theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAppFeedback } from "../hooks/useAppFeedback";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../context/ThemeContext";

const HomeScreen = ({ navigation }) => {
  const { theme: colors } = useTheme();
  const { triggerHaptic } = useAppFeedback();
  const [showDifficultyModal, setShowDifficultyModal] = useState(false);

  const handleStartGame = (mode, difficulty = "Hard") => {
    triggerHaptic();
    setShowDifficultyModal(false);
    navigation.navigate("Game", { mode, difficulty });
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[colors.background, colors.surface]}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <Image
            source={require("../../assets/icon.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={[styles.title, { color: colors.text }]}>TIC TAC TOE</Text>
          <Text style={[styles.subtitle, { color: colors.primary }]}>Premium Edition</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.primary }]}
            onPress={() => setShowDifficultyModal(true)}
          >
            <MaterialCommunityIcons
              name="robot"
              size={24}
              color={colors.background}
            />
            <Text style={[styles.buttonText, { color: colors.background }]}>Single Player</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.secondary }]}
            onPress={() => handleStartGame("TwoPlayer")}
          >
            <MaterialCommunityIcons
              name="account-group"
              size={24}
              color={colors.text}
            />
            <Text style={[styles.buttonText, { color: colors.text }]}>
              Two Players
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingsButton}
            onPress={() => {
              triggerHaptic();
              navigation.navigate("Stats");
            }}
          >
            <MaterialCommunityIcons
              name="chart-bar"
              size={24}
              color={colors.textSecondary}
            />
            <Text style={[styles.settingsText, { color: colors.textSecondary }]}>Stats</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingsButton}
            onPress={() => {
              triggerHaptic();
              navigation.navigate("Settings");
            }}
          >
            <MaterialCommunityIcons
              name="cog"
              size={24}
              color={colors.textSecondary}
            />
            <Text style={[styles.settingsText, { color: colors.textSecondary }]}>Settings</Text>
          </TouchableOpacity>
        </View>

        {/* Difficulty Selection Modal */}
        <Modal
          visible={showDifficultyModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowDifficultyModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Choose Difficulty</Text>
              {["Easy", "Medium", "Hard"].map((level) => (
                <TouchableOpacity
                  key={level}
                  style={styles.difficultyOption}
                  onPress={() => handleStartGame("Single", level)}
                >
                  <Text style={[styles.difficultyOptionText, { color: colors.primary }]}>{level}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowDifficultyModal(false)}
              >
                <Text style={[styles.cancelButtonText, { color: colors.textSecondary }]}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <View style={styles.footer}>
          {/* <Text style={styles.footerText}>Made with ❤️ using Expo</Text> */}
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    padding: 20,
    justifyContent: "space-between",
    alignItems: "center",
  },
  header: {
    alignItems: "center",
    marginTop: 80,
  },
  logo: {
    width: 150,
    height: 150,
  },
  title: {
    fontSize: 42,
    fontWeight: "bold",
    color: COLORS.white,
    letterSpacing: 4,
    marginTop: 20,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.primary,
    letterSpacing: 8,
    textTransform: "uppercase",
  },
  buttonContainer: {
    width: "100%",
    paddingHorizontal: 20,
  },
  button: {
    flexDirection: "row",
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.background,
    marginLeft: 10,
  },
  settingsButton: {
    flexDirection: "row",
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  settingsText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginLeft: 10,
  },
  footer: {
    marginBottom: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.white,
    marginBottom: 20,
  },
  difficultyOption: {
    width: "100%",
    padding: 15,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    marginBottom: 10,
    alignItems: "center",
  },
  difficultyOptionText: {
    fontSize: 18,
    color: COLORS.primary,
    fontWeight: "bold",
  },
  cancelButton: {
    marginTop: 10,
    padding: 10,
  },
  cancelButtonText: {
    color: COLORS.textSecondary,
    fontSize: 16,
  },
  footerText: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },
});

export default HomeScreen;
