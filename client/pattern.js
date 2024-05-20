import { fillSudoku, getRandomCandidate } from './sudoku.js';

// Generate an array of random bits (binary digits).
// A one means "show this clue," and a zero means "hide this clue."
function getRandomBits(size, max = size, min = 0) {
    let shown = 0;
    const bitfield = Array(size).fill(0);
    while (shown < min) {
        for (let i = 0; i < size; i++) {
            const show = Math.round(Math.random());
            bitfield[i] = show;
            shown += show;
            if (shown === max) {
                break;
            }
        }
    }
    return bitfield;
}

// Generate an array of 5 bits (binary digits).
// There must be 1 or 2 ones, and thus 3 or 4 zeros.
function getPentet() {
    return getRandomBits(5, 2, 1);
}

// Restrict the number of ones in a 2D array of bitfields.
function restrictCluesPerColumn(pattern, max) {
    const columns = pattern[0].length;
    for (let c = 0; c < columns; c++) {
        let sum = 0;
        for (let r = 0; r < pattern.length; r++) {
            sum += pattern[r][c];
        }
        while (sum > max) {
            const rows = new Set([...Array(pattern.length).keys()]);
            const r = getRandomCandidate(rows);
            if (pattern[r][c] === 0) {
                continue;
            }
            pattern[r][c] = 0;
            sum--;
            rows.delete(r);
        }
    }
}

// Generate a clue pattern that has dual orthogonal reflection symmetry.
function getReflectionPattern() {
    const pentets = [];
    for (let i = 0; i < 5; i++) {
        pentets.push(getPentet());
    }
    restrictCluesPerColumn(pentets, 2);
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

// Generate an array of 9 bits (binary digits).
// There must be 1 to 4 ones, and thus 5 to 8 zeros.
function getNontet() {
    return getRandomBits(9, 4, 1);
}

// Generate a clue pattern that has symmetry across two orthogonal axes.
function getRandomPattern() {
    const nontets = [];
    for (let i = 0; i < 9; i++) {
        nontets.push(getNontet());
    }
    restrictCluesPerColumn(nontets, 4);
    return nontets;
}

// Generate a 9x9 array of bits (binary digits), to show or hide each clue.
// A one means "show this clue," and a zero means "hide this clue."
function getCluePattern() {
    const styles = new Set([
        getReflectionPattern,
        getRandomPattern,
    ]);
    const style = getRandomCandidate(styles);
    return style();
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

export { getReflectionPattern, getRandomPattern, getCluePattern, sum2d, hideCells };
