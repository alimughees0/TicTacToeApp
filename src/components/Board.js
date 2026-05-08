import React from 'react';
import { View, StyleSheet } from 'react-native';
import Cell from './Cell';

const Board = ({ board, onCellPress, winningLine, disabled }) => {
  return (
    <View style={styles.container}>
      {board.map((cell, index) => (
        <Cell
          key={index}
          value={cell}
          onPress={() => onCellPress(index)}
          disabled={disabled}
          isWinningCell={winningLine?.includes(index)}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    width: 320, // (90 + 5 + 5) * 3 approx
  },
});

export default Board;
