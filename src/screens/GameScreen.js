import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import ConfettiCannon from 'react-native-confetti-cannon';
import { COLORS, SIZES } from '../constants/theme';
import Board from '../components/Board';
import ScoreBoard from '../components/ScoreBoard';
import { checkWinner, getBestMove } from '../utils/gameLogic';
import { useAppFeedback } from '../hooks/useAppFeedback';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';

const GameScreen = ({ route, navigation }) => {
  const { theme: colors } = useTheme();
  const { mode, difficulty: initialDifficulty } = route.params;
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const [winningLine, setWinningLine] = useState(null);
  const [scores, setScores] = useState({ X: 0, O: 0, Draw: 0 });
  const [difficulty, setDifficulty] = useState(initialDifficulty || 'Hard');
  const confettiRef = useRef(null);
  const { triggerHaptic, triggerSuccessHaptic, playSound } = useAppFeedback();

  useEffect(() => {
    loadScores();
    loadDifficulty();
  }, []);

  useEffect(() => {
    const result = checkWinner(board);
    if (result) {
      setWinner(result.winner);
      setWinningLine(result.line);
      updateScores(result.winner);
      if (result.winner !== 'Draw') {
        triggerSuccessHaptic();
        playSound('win');
        confettiRef.current?.start();
      } else {
        playSound('draw');
      }
    } else if (!isXNext && mode === 'Single' && !winner) {
      // AI Turn
      const timer = setTimeout(() => {
        const aiMove = getBestMove(board, difficulty);
        handlePress(aiMove);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [board, isXNext]);

  const loadScores = async () => {
    const savedScores = await AsyncStorage.getItem('scores');
    if (savedScores) setScores(JSON.parse(savedScores));
  };

  const loadDifficulty = async () => {
    const savedDifficulty = await AsyncStorage.getItem('difficulty');
    if (savedDifficulty) setDifficulty(savedDifficulty);
  };

  const updateScores = async (gameWinner) => {
    // Session scores
    const newScores = { ...scores, [gameWinner]: scores[gameWinner] + 1 };
    setScores(newScores);
    await AsyncStorage.setItem('scores', JSON.stringify(newScores));

    // Historical stats
    try {
      const savedStats = await AsyncStorage.getItem('game_stats');
      let stats = savedStats ? JSON.parse(savedStats) : {
        totalGames: 0,
        winsX: 0,
        winsO: 0,
        draws: 0,
        easyWins: 0,
        mediumWins: 0,
        hardWins: 0,
      };

      stats.totalGames += 1;
      if (gameWinner === 'X') stats.winsX += 1;
      if (gameWinner === 'O') stats.winsO += 1;
      if (gameWinner === 'Draw') stats.draws += 1;

      // Track difficulty wins for Player X (Human)
      if (gameWinner === 'X' && mode === 'Single') {
        if (difficulty === 'Easy') stats.easyWins += 1;
        else if (difficulty === 'Medium') stats.mediumWins += 1;
        else if (difficulty === 'Hard') stats.hardWins += 1;
      }

      await AsyncStorage.setItem('game_stats', JSON.stringify(stats));
    } catch (error) {
      console.error('Error updating historical stats:', error);
    }
  };

  const handlePress = (index) => {
    if (board[index] || winner) return;

    triggerHaptic();
    playSound('tap');
    const newBoard = [...board];
    newBoard[index] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    setIsXNext(!isXNext);
  };

  const resetGame = () => {
    triggerHaptic();
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
    setWinningLine(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={[colors.background, colors.surface]} style={styles.gradient}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <MaterialCommunityIcons name="chevron-left" size={32} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.text }]}>{mode === 'Single' ? 'vs AI' : '2 Players'}</Text>
          <TouchableOpacity onPress={resetGame} style={styles.resetButton}>
            <MaterialCommunityIcons name="refresh" size={28} color={colors.text} />
          </TouchableOpacity>
        </View>

        <ScoreBoard scores={scores} activePlayer={isXNext ? 'X' : 'O'} />

        <View style={styles.statusContainer}>
          {winner ? (
            <Text style={[styles.statusText, { color: winner === 'Draw' ? colors.text : winner === 'X' ? colors.x : colors.o }]}>
              {winner === 'Draw' ? "It's a Draw!" : `Player ${winner} Wins!`}
            </Text>
          ) : (
            <Text style={[styles.turnText, { color: colors.textSecondary }]}>
              Player <Text style={{ color: isXNext ? colors.x : colors.o }}>{isXNext ? 'X' : 'O'}</Text>'s Turn
            </Text>
          )}
        </View>

        <Board
          board={board}
          onCellPress={handlePress}
          winningLine={winningLine}
          disabled={!isXNext && mode === 'Single'}
        />

        <View style={styles.footer}>
          {winner && (
            <TouchableOpacity style={[styles.playAgainBtn, { backgroundColor: colors.primary, shadowColor: colors.primary }]} onPress={resetGame}>
              <Text style={[styles.playAgainText, { color: colors.background }]}>Play Again</Text>
            </TouchableOpacity>
          )}
        </View>

        <ConfettiCannon
          ref={confettiRef}
          count={200}
          origin={{ x: -10, y: 0 }}
          autoStart={false}
          fadeOut={true}
        />
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  gradient: { flex: 1, padding: 20, alignItems: 'center' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 40,
  },
  title: { fontSize: 24, fontWeight: 'bold', color: COLORS.white },
  backButton: { padding: 5 },
  resetButton: { padding: 5 },
  statusContainer: { marginBottom: 30, height: 40, justifyContent: 'center' },
  statusText: { fontSize: 28, fontWeight: 'bold', textAlign: 'center' },
  turnText: { fontSize: 20, color: COLORS.textSecondary, textAlign: 'center' },
  footer: { marginTop: 40, width: '100%', alignItems: 'center' },
  playAgainBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 30,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  playAgainText: { color: COLORS.background, fontSize: 18, fontWeight: 'bold' },
});

export default GameScreen;
