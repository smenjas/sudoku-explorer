// Return a 9x9 array filled with any value.
function fillSudoku(value) {
    const board = [];
    for (let i = 0; i < 9; i++) {
        board.push(Array(9).fill(value));
    }
    return board;
}

// Return a 9x9 array, with some digits filled in.
function createSudoku() {
    // Generate an empty 2D array.
    const board = fillSudoku(0);
    // Find the domain (possible values) for each square.
    const domains = findDomains(board);
    return board;
}

// Return all the row/column indices in a block, given a row/column.
function findBlock(i) {
    if (i < 3) {
        return new Set([0, 1, 2]);
    }
    else if (i < 6) {
        return new Set([3, 4, 5]);
    }
    else {
        return new Set([6, 7, 8]);
    }
}

// Return the set of possible digits for this square.
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

// Return a 9x9 array of sets of domains (possible values).
function findDomains(board) {
    const domains = fillSudoku([]);
    for (const r in board) {
        for (const c in board[r]) {
            domains[r][c] = findDomain(board, r, c);
        }
    }
    return domains;
}

// Render a 9x9 array of sudoku digits as an HTML table.
function renderSudoku(board) {
    let html = '<table id="sudoku">';
    // Loop through each row index.
    for (const r in board) {
        html += '<tr>';
        // Loop through each column index.
        for (const c in board[r]) {
            html += `<td class="row-${r} column-${c}">${board[r][c] || ''}</td>`;
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
