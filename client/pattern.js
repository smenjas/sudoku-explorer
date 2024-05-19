import { fillSudoku, getRandomCandidate } from './sudoku.js';

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
            // Restrict clues to 2 per pentet (4 per row).
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
    // Restrict clues to 4 per column.
    for (let c = 0; c < 5; c++) {
        let sum = 0;
        for (let r = 0; r < 5; r++) {
            sum += pentets[r][c];
        }
        while (sum > 2) {
            const rows = new Set([...Array(5).keys()]);
            const r = getRandomCandidate(rows);
            if (pentets[r][c] === 0) {
                continue;
            }
            pentets[r][c] = 0;
            sum--;
            rows.delete(r);
        }
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

export { getCluePattern, sum2d, hideCells };
