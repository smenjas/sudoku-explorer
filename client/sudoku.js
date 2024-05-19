// Return a 9x9 array filled with any value.
function fillSudoku(value) {
    const board = [];
    for (let i = 0; i < 9; i++) {
        board.push(Array(9).fill(value));
    }
    return board;
}

// Return all the row/column indices in a block, given a row/column.
function findBlock(i) {
    if (i < 3) {
        return new Set([0, 1, 2]);
    }
    if (i < 6) {
        return new Set([3, 4, 5]);
    }
    return new Set([6, 7, 8]);
}

// Return the set of possible digits for this cell.
function findDomain(board, r, c) {
    if (board[r][c] > 0) {
        return new Set(board[r][c]);
    }
    // Set the domain to all non-zero digits.
    const domain = new Set([...Array(9).keys()].map(i => i + 1));
    // Remove digits already in the row.
    for (const ri in board) {
        if (board[ri][c] > 0) {
            domain.delete(board[ri][c]);
        }
    }
    // Remove digits already in the column.
    for (const ci in board[r]) {
        if (board[r][ci] > 0) {
            domain.delete(board[r][ci]);
        }
    }
    // Remove digits already in the block.
    const blockRows = findBlock(r);
    blockRows.delete(r);
    const blockColumns = findBlock(c);
    blockColumns.delete(c);
    for (const ri of blockRows) {
        for (const ci of blockColumns) {
            if (board[ri][ci] > 0) {
                domain.delete(board[ri][ci]);
            }
        }
    }
    return domain;
}

// Return a random candidate from a cell's domain (possible digits).
function getRandomCandidate(domain) {
    const candidates = Array.from(domain);
    const index = Math.floor(Math.random() * candidates.length);
    return candidates[index];
}

// Return a 9x9 array of random digits, or an empty array if a domain is empty.
function getRandomSudoku() {
    const board = fillSudoku(0);
    for (const r in board) {
        for (const c in board[r]) {
            const domain = findDomain(board, r, c);
            if (domain.size === 0) {
                return [];
            }
            board[r][c] = getRandomCandidate(domain);
        }
    }
    return board;
}

// Return a 9x9 array, with a valid sudoku solution.
function createSudoku(returnIterations = false) {
    // If a cell has an empty domain, regenerate the whole board.
    if (returnIterations === false) {
        console.time('createSudoku');
    }
    // 90+% of the time, a valid board will occur within 1000 iterations.
    // 99+% of the time, a valid board will occur within 2000 iterations.
    // I have not seen a valid board take more than 4000 iterations.
    const max_iterations = 5e3;
    let iterations = 0;
    let board = [];
    while (++iterations < max_iterations) {
        board = getRandomSudoku();
        if (board.length > 0) {
            break;
        }
    }
    if (iterations >= max_iterations) {
        console.log("Failed to produce a valid board after", iterations, "iterations.");
    }
    else if (returnIterations === false) {
        console.log("It took", iterations, "iterations to generate a valid board.");
    }
    if (returnIterations === false) {
        console.timeEnd('createSudoku');
        return board;
    }
    else {
        return iterations;
    }
}

export { fillSudoku, findBlock, getRandomCandidate, createSudoku };
