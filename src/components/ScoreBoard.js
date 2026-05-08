import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SIZES } from '../constants/theme';

const ScoreBoard = ({ scores, activePlayer }) => {
  return (
    <View style={styles.container}>
      <View style={[styles.playerCard, activePlayer === 'X' && styles.activeCardX]}>
        <Text style={styles.playerName}>Player X</Text>
        <Text style={styles.scoreText}>{scores.X}</Text>
      </View>
      
      <View style={styles.drawCard}>
        <Text style={styles.playerName}>Draws</Text>
        <Text style={styles.scoreText}>{scores.Draw}</Text>
      </View>

      <View style={[styles.playerCard, activePlayer === 'O' && styles.activeCardO]}>
        <Text style={styles.playerName}>Player O</Text>
        <Text style={styles.scoreText}>{scores.O}</Text>
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
    borderColor: COLORS.x,
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
  },
  activeCardO: {
    borderColor: COLORS.o,
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
