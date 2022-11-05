let str = `2
5 3 4 6 7 8 9 1 2
6 7 2 1 9 5 3 4 8
1 9 8 3 4 2 5 6 7
8 5 9 7 6 1 4 2 3
4 2 6 8 5 3 7 9 1
7 1 3 9 2 4 8 5 6
9 6 1 5 3 7 2 8 4
2 8 7 4 1 9 6 3 5
3 4 5 2 8 6 1 7 9
2 8 6 9 4 5 1 7 3
7 1 4 6 3 2 9 5 8
9 3 5 7 8 1 4 2 6
4 2 7 3 5 6 8 1 9
6 5 8 1 9 7 3 4 2
1 9 3 4 2 8 7 6 5
3 6 1 5 7 9 2 8 4
5 4 2 8 1 3 6 9 7
8 7 9 2 6 4 5 3 1`;

function makeBoard(str) {
  let arr = str.split(/\n+/g);
  const boardCount = Number(arr.splice(0, 1).join());
  let board = [];
  let temp = [];
  arr.forEach((el, idx) => {
    temp.push(el.split(" "));
    if ((idx + 1) % 9 == 0) {
      board.push(temp);
      temp = [];
    }
  });
  return { boardCount, board };
}

function validatingRow(board, row, col, value) {
  for (let i = 0; i < 8; i++) {
    if (i !== col) {
      if (+board[row][i] === +value) {
        return false;
      }
    }
  }
  return true;
}
function validatingCol(board, row, col, value) {
  for (let i = 0; i < 8; i++) {
    if (i !== row) {
      if (+board[i][col] === +value) {
        return false;
      }
    }
  }
  return true;
}

function validatingSquare(board, row, col, value) {
  const startRow = row - (row % 3);
  const startCol = col - (col % 3);
  for (let i = startRow; i < startRow + 3; i++) {
    for (let j = startCol; j < startCol + 3; j++) {
      if (i !== row && j !== col) {
        if (+board[i][j] === +value) {
          return false;
        }
      }
    }
  }
  return true;
}

function validatingSudoku(input) {
  let converted = makeBoard(input);
  let board = converted.board;
  let boardCount = converted.boardCount;
  let result = [];

  for (let play = 0; play < boardCount; play++) {
    let tempResult = "valid";
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        const value = +board[play][row][col];
        if (
          !validatingRow(board[play], row, col, value) ||
          !validatingCol(board[play], row, col, value) ||
          !validatingSquare(board[play], row, col, value)
        ) {
          tempResult = "invalid";
        }
      }
    }
    result.push(tempResult);
  }
  return result.join(" ");
}
console.log(validatingSudoku(str));
