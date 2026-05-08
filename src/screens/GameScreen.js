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

const GameScreen = ({ route, navigation }) => {
  const { mode } = route.params;
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const [winningLine, setWinningLine] = useState(null);
  const [scores, setScores] = useState({ X: 0, O: 0, Draw: 0 });
  const [difficulty, setDifficulty] = useState('Hard');
  const confettiRef = useRef(null);
  const { triggerHaptic, triggerSuccessHaptic } = useAppFeedback();

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
        confettiRef.current?.start();
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
    const newScores = { ...scores, [gameWinner]: scores[gameWinner] + 1 };
    setScores(newScores);
    await AsyncStorage.setItem('scores', JSON.stringify(newScores));
  };

  const handlePress = (index) => {
    if (board[index] || winner) return;

    triggerHaptic();
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
      <LinearGradient colors={[COLORS.background, '#1E293B']} style={styles.gradient}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <MaterialCommunityIcons name="chevron-left" size={32} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.title}>{mode === 'Single' ? 'vs AI' : '2 Players'}</Text>
          <TouchableOpacity onPress={resetGame} style={styles.resetButton}>
            <MaterialCommunityIcons name="refresh" size={28} color={COLORS.text} />
          </TouchableOpacity>
        </View>

        <ScoreBoard scores={scores} activePlayer={isXNext ? 'X' : 'O'} />

        <View style={styles.statusContainer}>
          {winner ? (
            <Text style={[styles.statusText, { color: winner === 'Draw' ? COLORS.text : winner === 'X' ? COLORS.x : COLORS.o }]}>
              {winner === 'Draw' ? "It's a Draw!" : `Player ${winner} Wins!`}
            </Text>
          ) : (
            <Text style={styles.turnText}>
              Player <Text style={{ color: isXNext ? COLORS.x : COLORS.o }}>{isXNext ? 'X' : 'O'}</Text>'s Turn
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
            <TouchableOpacity style={styles.playAgainBtn} onPress={resetGame}>
              <Text style={styles.playAgainText}>Play Again</Text>
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
