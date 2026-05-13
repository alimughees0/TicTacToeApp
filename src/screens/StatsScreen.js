import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../constants/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';

const StatsScreen = ({ navigation }) => {
  const { theme: colors } = useTheme();
  const [stats, setStats] = useState({
    totalGames: 0,
    winsX: 0,
    winsO: 0,
    draws: 0,
    easyWins: 0,
    mediumWins: 0,
    hardWins: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const savedStats = await AsyncStorage.getItem('game_stats');
      if (savedStats) {
        setStats(JSON.parse(savedStats));
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const resetStats = async () => {
    const defaultStats = {
      totalGames: 0,
      winsX: 0,
      winsO: 0,
      draws: 0,
      easyWins: 0,
      mediumWins: 0,
      hardWins: 0,
    };
    try {
      await AsyncStorage.setItem('game_stats', JSON.stringify(defaultStats));
      setStats(defaultStats);
    } catch (error) {
      console.error('Error resetting stats:', error);
    }
  };

  const StatCard = ({ title, value, icon, color }) => (
    <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
      <MaterialCommunityIcons name={icon} size={32} color={color} />
      <View style={styles.statInfo}>
        <Text style={[styles.statValue, { color: colors.text }]}>{value}</Text>
        <Text style={[styles.statTitle, { color: colors.textSecondary }]}>{title}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={[colors.background, colors.surface]} style={styles.gradient}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <MaterialCommunityIcons name="chevron-left" size={32} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Statistics</Text>
          <View style={{ width: 32 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={styles.grid}>
            <StatCard title="Total Games" value={stats.totalGames} icon="trophy" color={colors.primary} />
            <StatCard title="X Wins" value={stats.winsX} icon="close" color={colors.x} />
            <StatCard title="O Wins" value={stats.winsO} icon="circle-outline" color={colors.o} />
            <StatCard title="Draws" value={stats.draws} icon="minus" color={colors.textSecondary} />
          </View>

          <View style={[styles.section, { backgroundColor: colors.surface }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Difficulty Wins (AI)</Text>
            <View style={styles.row}>
              <View style={styles.difficultyItem}>
                <Text style={[styles.difficultyLabel, { color: colors.textSecondary }]}>Easy</Text>
                <Text style={[styles.difficultyValue, { color: colors.primary }]}>{stats.easyWins}</Text>
              </View>
              <View style={styles.difficultyItem}>
                <Text style={[styles.difficultyLabel, { color: colors.textSecondary }]}>Medium</Text>
                <Text style={[styles.difficultyValue, { color: colors.primary }]}>{stats.mediumWins}</Text>
              </View>
              <View style={styles.difficultyItem}>
                <Text style={[styles.difficultyLabel, { color: colors.textSecondary }]}>Hard</Text>
                <Text style={[styles.difficultyValue, { color: colors.primary }]}>{stats.hardWins}</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity style={styles.resetBtn} onPress={resetStats}>
            <MaterialCommunityIcons name="trash-can-outline" size={20} color={COLORS.danger} />
            <Text style={styles.resetText}>Reset All Stats</Text>
          </TouchableOpacity>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  gradient: { flex: 1, padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 },
  backButton: { padding: 5 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: COLORS.white },
  scrollContent: { paddingBottom: 40 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  statCard: {
    width: '48%',
    backgroundColor: COLORS.surface,
    padding: 20,
    borderRadius: 20,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statInfo: { marginLeft: 15 },
  statValue: { color: COLORS.white, fontSize: 24, fontWeight: 'bold' },
  statTitle: { color: COLORS.textSecondary, fontSize: 12, textTransform: 'uppercase' },
  section: { marginTop: 30, backgroundColor: COLORS.surface, padding: 20, borderRadius: 20 },
  sectionTitle: { color: COLORS.white, fontSize: 18, fontWeight: 'bold', marginBottom: 20 },
  row: { flexDirection: 'row', justifyContent: 'space-around' },
  difficultyItem: { alignItems: 'center' },
  difficultyLabel: { color: COLORS.textSecondary, marginBottom: 5 },
  difficultyValue: { color: COLORS.primary, fontSize: 22, fontWeight: 'bold' },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    padding: 15,
  },
  resetText: { color: COLORS.danger, marginLeft: 10, fontWeight: 'bold' },
});

export default StatsScreen;
