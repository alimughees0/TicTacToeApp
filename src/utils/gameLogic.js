export const checkWinner = (board) => {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Cols
    [0, 4, 8], [2, 4, 6],           // Diagonals
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line: lines[i] };
    }
  }

  if (!board.includes(null)) {
    return { winner: 'Draw', line: null };
  }

  return null;
};

// Minimax Algorithm for AI
const scores = {
  X: -10,
  O: 10,
  Draw: 0,
};

export const getBestMove = (board, difficulty) => {
  if (difficulty === 'Easy') {
    const available = board.map((v, i) => v === null ? i : null).filter(v => v !== null);
    return available[Math.floor(Math.random() * available.length)];
  }

  if (difficulty === 'Medium') {
    // 50% chance to play best move, 50% chance to play random
    if (Math.random() > 0.5) {
      return minimax(board, 0, true).index;
    } else {
      const available = board.map((v, i) => v === null ? i : null).filter(v => v !== null);
      return available[Math.floor(Math.random() * available.length)];
    }
  }

  // Hard mode: Minimax
  return minimax(board, 0, true).index;
};

function minimax(board, depth, isMaximizing) {
  const result = checkWinner(board);
  if (result) {
    return { score: scores[result.winner] };
  }

  if (isMaximizing) {
    let bestScore = -Infinity;
    let move;
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        board[i] = 'O';
        let score = minimax(board, depth + 1, false).score;
        board[i] = null;
        if (score > bestScore) {
          bestScore = score;
          move = i;
        }
      }
    }
    return { score: bestScore, index: move };
  } else {
    let bestScore = Infinity;
    let move;
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        board[i] = 'X';
        let score = minimax(board, depth + 1, true).score;
        board[i] = null;
        if (score < bestScore) {
          bestScore = score;
          move = i;
        }
      }
    }
    return { score: bestScore, index: move };
  }
}
