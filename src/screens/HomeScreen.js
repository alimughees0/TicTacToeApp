import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SIZES } from '../constants/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppFeedback } from '../hooks/useAppFeedback';
import { SafeAreaView } from 'react-native-safe-area-context';

const HomeScreen = ({ navigation }) => {
  const { triggerHaptic } = useAppFeedback();

  const handleStartGame = (mode) => {
    triggerHaptic();
    navigation.navigate('Game', { mode });
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[COLORS.background, '#1E293B']}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <MaterialCommunityIcons name="grid" size={100} color={COLORS.primary} />
          <Text style={styles.title}>TIC TAC TOE</Text>
          <Text style={styles.subtitle}>Premium Edition</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: COLORS.primary }]}
            onPress={() => handleStartGame('Single')}
          >
            <MaterialCommunityIcons name="robot" size={24} color={COLORS.background} />
            <Text style={styles.buttonText}>Single Player</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: COLORS.secondary }]}
            onPress={() => handleStartGame('TwoPlayer')}
          >
            <MaterialCommunityIcons name="account-group" size={24} color={COLORS.white} />
            <Text style={[styles.buttonText, { color: COLORS.white }]}>Two Players</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingsButton}
            onPress={() => {
              triggerHaptic();
              navigation.navigate('Settings');
            }}
          >
            <MaterialCommunityIcons name="cog" size={24} color={COLORS.textSecondary} />
            <Text style={styles.settingsText}>Settings</Text>
          </TouchableOpacity>
        </View>

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
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginTop: 80,
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: COLORS.white,
    letterSpacing: 4,
    marginTop: 20,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.primary,
    letterSpacing: 8,
    textTransform: 'uppercase',
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 20,
  },
  button: {
    flexDirection: 'row',
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.background,
    marginLeft: 10,
  },
  settingsButton: {
    flexDirection: 'row',
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginLeft: 10,
  },
  footer: {
    marginBottom: 20,
  },
  footerText: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },
});

export default HomeScreen;
