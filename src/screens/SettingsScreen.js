import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SIZES } from '../constants/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppFeedback } from '../hooks/useAppFeedback';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';

const SettingsScreen = ({ navigation }) => {
  const { triggerHaptic, settings } = useAppFeedback();
  const [difficulty, setDifficulty] = useState('Hard');

  useEffect(() => {
    loadDifficulty();
  }, []);

  const loadDifficulty = async () => {
    const saved = await AsyncStorage.getItem('difficulty');
    if (saved) setDifficulty(saved);
  };

  const saveDifficulty = async (level) => {
    triggerHaptic();
    setDifficulty(level);
    await AsyncStorage.setItem('difficulty', level);
  };

  const toggleSwitch = (type) => {
    triggerHaptic();
    if (type === 'sound') settings.setIsSoundEnabled(!settings.isSoundEnabled);
    if (type === 'haptic') settings.setIsHapticEnabled(!settings.isHapticEnabled);

    // Save settings
    const newSettings = {
      sound: type === 'sound' ? !settings.isSoundEnabled : settings.isSoundEnabled,
      haptic: type === 'haptic' ? !settings.isHapticEnabled : settings.isHapticEnabled,
    };
    AsyncStorage.setItem('app_settings', JSON.stringify(newSettings));
  };

  const clearScores = async () => {
    triggerHaptic();
    await AsyncStorage.removeItem('scores');
    // Optionally alert the user
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={[COLORS.background, '#1E293B']} style={styles.gradient}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <MaterialCommunityIcons name="chevron-left" size={32} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.title}>Settings</Text>
          <View style={{ width: 32 }} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <MaterialCommunityIcons name="volume-high" size={24} color={COLORS.primary} />
              <Text style={styles.rowLabel}>Sound Effects</Text>
            </View>
            <Switch
              value={settings.isSoundEnabled}
              onValueChange={() => toggleSwitch('sound')}
              trackColor={{ false: '#334155', true: COLORS.primary }}
              thumbColor={COLORS.white}
            />
          </View>
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <MaterialCommunityIcons name="vibrate" size={24} color={COLORS.primary} />
              <Text style={styles.rowLabel}>Haptic Feedback</Text>
            </View>
            <Switch
              value={settings.isHapticEnabled}
              onValueChange={() => toggleSwitch('haptic')}
              trackColor={{ false: '#334155', true: COLORS.primary }}
              thumbColor={COLORS.white}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>AI Difficulty</Text>
          <View style={styles.difficultyContainer}>
            {['Easy', 'Medium', 'Hard'].map((level) => (
              <TouchableOpacity
                key={level}
                style={[styles.difficultyBtn, difficulty === level && styles.difficultyBtnActive]}
                onPress={() => saveDifficulty(level)}
              >
                <Text style={[styles.difficultyText, difficulty === level && styles.difficultyTextActive]}>
                  {level}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity style={styles.clearBtn} onPress={clearScores}>
          <MaterialCommunityIcons name="trash-can-outline" size={20} color={COLORS.danger} />
          <Text style={styles.clearText}>Clear All Scores</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.version}>Version 1.0.0</Text>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  gradient: { flex: 1, padding: 20 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 40,
  },
  title: { fontSize: 24, fontWeight: 'bold', color: COLORS.white },
  backButton: { padding: 5 },
  section: { marginBottom: 40 },
  sectionTitle: { color: COLORS.textSecondary, fontSize: 14, fontWeight: 'bold', marginBottom: 15, textTransform: 'uppercase' },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  rowLeft: { flexDirection: 'row', alignItems: 'center' },
  rowLabel: { color: COLORS.text, fontSize: 16, marginLeft: 15 },
  difficultyContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  difficultyBtn: {
    flex: 1,
    backgroundColor: COLORS.surface,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  difficultyBtnActive: { borderColor: COLORS.primary, backgroundColor: 'rgba(56, 189, 248, 0.1)' },
  difficultyText: { color: COLORS.textSecondary, fontWeight: 'bold' },
  difficultyTextActive: { color: COLORS.primary },
  clearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    padding: 15,
  },
  clearText: { color: COLORS.danger, marginLeft: 10, fontWeight: 'bold' },
  footer: { position: 'absolute', bottom: 40, left: 0, right: 0, alignItems: 'center' },
  version: { color: COLORS.textSecondary, fontSize: 12 },
});

export default SettingsScreen;
