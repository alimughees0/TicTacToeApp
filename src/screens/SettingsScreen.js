import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SIZES } from '../constants/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppFeedback } from '../hooks/useAppFeedback';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { THEMES } from '../constants/theme';
import { ScrollView } from 'react-native-gesture-handler';

const SettingsScreen = ({ navigation }) => {
  const { theme: colors, currentTheme, updateTheme } = useTheme();
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
      <LinearGradient colors={[colors.background, colors.surface]} style={styles.gradient}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <MaterialCommunityIcons name="chevron-left" size={32} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.text }]}>Settings</Text>
          <View style={{ width: 32 }} />
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Preferences</Text>
          <View style={[styles.row, { backgroundColor: colors.surface }]}>
            <View style={styles.rowLeft}>
              <MaterialCommunityIcons name="volume-high" size={24} color={colors.primary} />
              <Text style={[styles.rowLabel, { color: colors.text }]}>Sound Effects</Text>
            </View>
            <Switch
              value={settings.isSoundEnabled}
              onValueChange={() => toggleSwitch('sound')}
              trackColor={{ false: '#334155', true: colors.primary }}
              thumbColor={colors.text}
            />
          </View>
          <View style={[styles.row, { backgroundColor: colors.surface }]}>
            <View style={styles.rowLeft}>
              <MaterialCommunityIcons name="vibrate" size={24} color={colors.primary} />
              <Text style={[styles.rowLabel, { color: colors.text }]}>Haptic Feedback</Text>
            </View>
            <Switch
              value={settings.isHapticEnabled}
              onValueChange={() => toggleSwitch('haptic')}
              trackColor={{ false: '#334155', true: colors.primary }}
              thumbColor={colors.text}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Visual Theme</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.themeContainer}>
            {Object.keys(THEMES).map((themeKey) => (
              <TouchableOpacity
                key={themeKey}
                style={[
                  styles.themeBtn,
                  { backgroundColor: THEMES[themeKey].surface },
                  currentTheme === themeKey && { borderColor: colors.primary }
                ]}
                onPress={() => {
                  triggerHaptic();
                  updateTheme(themeKey);
                }}
              >
                <View style={[styles.themePreview, { backgroundColor: THEMES[themeKey].background }]}>
                  <View style={[styles.themeCircle, { backgroundColor: THEMES[themeKey].primary }]} />
                </View>
                <Text style={[
                  styles.themeText,
                  { color: currentTheme === themeKey ? colors.primary : colors.textSecondary }
                ]}>
                  {THEMES[themeKey].name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>AI Difficulty</Text>
          <View style={styles.difficultyContainer}>
            {['Easy', 'Medium', 'Hard'].map((level) => (
              <TouchableOpacity
                key={level}
                style={[
                  styles.difficultyBtn,
                  { backgroundColor: colors.surface },
                  difficulty === level && [styles.difficultyBtnActive, { borderColor: colors.primary }]
                ]}
                onPress={() => saveDifficulty(level)}
              >
                <Text style={[
                  styles.difficultyText,
                  { color: difficulty === level ? colors.primary : colors.textSecondary }
                ]}>
                  {level}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity style={styles.clearBtn} onPress={clearScores}>
          <MaterialCommunityIcons name="trash-can-outline" size={20} color={colors.accent} />
          <Text style={[styles.clearText, { color: colors.accent }]}>Clear All Scores</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={[styles.version, { color: colors.textSecondary }]}>Version 1.1.0</Text>
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
  difficultyBtnActive: {
    backgroundColor: 'rgba(56, 189, 248, 0.1)'
  },
  difficultyText: { fontWeight: 'bold' },
  themeContainer: { flexDirection: 'row' },
  themeBtn: {
    width: 100,
    padding: 10,
    borderRadius: 12,
    marginRight: 10,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  themePreview: {
    width: 60,
    height: 40,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  themeCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  themeText: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
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
