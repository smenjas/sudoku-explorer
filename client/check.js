import { findBlock } from './sudoku.js';

function checkValue(set, value) {
    if (value < 1 || value > 9) {
        return false;
    }
    if (set.has(value)) {
        return false;
    }
    set.add(value);
    return true;
}

function checkRow(board, r) {
    const set = new Set();
    for (const c in board[r]) {
        if (checkValue(set, board[r][c]) === false) {
            return false;
        }
    }
    return true;
}

function checkColumn(board, c) {
    const set = new Set();
    for (const r in board) {
        if (checkValue(set, board[r][c]) === false) {
            return false;
        }
    }
    return true;
}

function checkBlock(board, r, c) {
    const blockRows = findBlock(r);
    const blockColumns = findBlock(c);
    const set = new Set();
    for (const ri in blockRows) {
        for (const ci in blockColumns) {
            if (checkValue(set, board[ri][ci]) === false) {
                return false;
            }
        }
    }
    return true;
}

// Check that every number follows the rules.
function checkSolution(board) {
    for (const r in board) {
        for (const c in board[r]) {
            if (checkRow(board, r) === false
                || checkColumn(board, c) === false
                || checkBlock(board, r, c) === false) {
                return false;
            }
        }
    }
    return true;
}

export { checkSolution };
