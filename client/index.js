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
function createSudoku() {
    // If a cell has an empty domain, regenerate the whole board.
    console.time('createSudoku');
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
    else {
        console.log("It took", iterations, "iterations to generate a valid board.");
    }
    console.timeEnd('createSudoku');
    return board;
}

// Generate an array of 5 bits (binary digits).
// There must be 1 or 2 ones, and thus 3 or 4 zeros.
// A one means "show this clue," and a zero means "hide this clue."
function getPentet() {
    let shown = 0;
    const pentet = Array(5).fill(0);
    while (shown < 1) {
        for (let i = 0; i < 5; i++) {
            const show = Math.round(Math.random());
            pentet[i] = show;
            shown += show;
            if (shown > 1) {
                break;
            }
        }
    }
    return pentet;
}

// Generate a 9x9 array of bits (binary digits), to show or hide each clue.
// A one means "show this clue," and a zero means "hide this clue."
function getCluePattern() {
    const pentets = [];
    for (let i = 0; i < 5; i++) {
        pentets.push(getPentet());
    }
    const pattern = fillSudoku(0);
    for (let r = 0; r < 5; r++) {
        for (let c = 0; c < 5; c++) {
            pattern[r][c] = pentets[r][c];
        }
        for (let c = 8; c > 4; c--) {
            pattern[r][c] = pentets[r][8 - c];
        }
    }
    for (let r = 8; r > 4; r--) {
        for (let c = 0; c < 5; c++) {
            pattern[r][c] = pentets[8 - r][c];
        }
        for (let c = 8; c > 4; c--) {
            pattern[r][c] = pentets[8 - r][8 - c];
        }
    }
    return pattern;
}

function sum2d(matrix) {
    const f = (acc, n) => acc + n;
    return matrix.map(a => a.reduce(f)).reduce(f);
}

function hideCells() {
    let pattern = [];
    let clues = 0;
    // A minimal sudoku cannot have less than 17 clues.
    while (clues < 17) {
        pattern = getCluePattern();
        clues = sum2d(pattern);
        console.log("There are", clues, "clues.");
    }
    return pattern;
}

// Render a 9x9 array of sudoku digits as an HTML table.
function renderSudoku(board) {
    const valid = checkSolution(board);
    const pattern = hideCells();
    let html = `<table id="sudoku" class="${valid}">`;
    for (const r in board) {
        html += '<tr>';
        for (const c in board[r]) {
            const vis = pattern[r][c] ? "clue" : "empty";
            const content = pattern[r][c] ? (board[r][c] || '?') : '';
            html += `<td class="row-${r} column-${c} ${vis}">${content}</td>`;
        }
        html += '</tr>';
    }
    html += '</table>';
    return html;
}

// Render a web page with a Sudoku board.
function renderPage(board) {
    document.title = 'Sudoku Explorer';
    return renderSudoku(board);
}

const board = createSudoku();
const html = renderPage(board);
document.body.insertAdjacentHTML('beforeend', html);
