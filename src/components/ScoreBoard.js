import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SIZES } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';

const ScoreBoard = ({ scores, activePlayer }) => {
  const { theme: colors } = useTheme();
  return (
    <View style={styles.container}>
      <View style={[
        styles.playerCard,
        { backgroundColor: colors.surface },
        activePlayer === 'X' && [styles.activeCardX, { borderColor: colors.x }]
      ]}>
        <Text style={[styles.playerName, { color: colors.textSecondary }]}>Player X</Text>
        <Text style={[styles.scoreText, { color: colors.text }]}>{scores.X}</Text>
      </View>

      <View style={[styles.drawCard, { backgroundColor: colors.surface }]}>
        <Text style={[styles.playerName, { color: colors.textSecondary }]}>Draws</Text>
        <Text style={[styles.scoreText, { color: colors.text }]}>{scores.Draw}</Text>
      </View>

      <View style={[
        styles.playerCard,
        { backgroundColor: colors.surface },
        activePlayer === 'O' && [styles.activeCardO, { borderColor: colors.o }]
      ]}>
        <Text style={[styles.playerName, { color: colors.textSecondary }]}>Player O</Text>
        <Text style={[styles.scoreText, { color: colors.text }]}>{scores.O}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  playerCard: {
    backgroundColor: COLORS.surface,
    padding: 15,
    borderRadius: SIZES.borderRadius,
    alignItems: 'center',
    width: '30%',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  drawCard: {
    backgroundColor: COLORS.surface,
    padding: 15,
    borderRadius: SIZES.borderRadius,
    alignItems: 'center',
    width: '30%',
  },
  activeCardX: {
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
  },
  activeCardO: {
    backgroundColor: 'rgba(244, 114, 182, 0.1)',
  },
  playerName: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 5,
  },
  scoreText: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default ScoreBoard;
