import { getCluePattern, sum2d } from '../client/pattern.js';
import { createSudoku } from '../client/sudoku.js';

function countKeys(obj, key, value = 1) {
    if (key in obj) {
        obj[key] += value;
    }
    else {
        obj[key] = value;
    }
}

function showDistribution(histo, factor) {
    // Count how many values are distributed within groups.
    const distro = {};
    for (const key in histo) {
        const category = Math.ceil(parseInt(key) / factor);
        countKeys(distro, category, histo[key]);
    }

    // Show how many values are distributed within groups.
    const keys = Object.keys(distro).sort((a, b) => a < b);
    const total = Object.values(histo).reduce((acc, n) => acc + n, 0);
    const max = Math.max(...Object.values(distro));
    for (const key of keys) {
        const n = distro[key];
        const percent = (n / total) * 100;
        const pct = `${percent.toFixed(2)}%`.padStart(6);
        const bars = "-".repeat((n / max) * 50);
        console.log(`${pct} <= ${key * factor}`, bars, n);
    }
}

function showProgress(count, units, wrap = 100) {
    process.stdout.write(".");
    if (count % wrap === 0) {
        process.stdout.write(` ${count} ${units}\n`);
    }
}

// Generate a bunch of clue patterns, and chart how many clues there were.
function countClues() {
    const histo = {};
    let count = 0;
    for (let i = 0; i < 1e6; i++) {
        const pattern = getCluePattern();
        const clues = sum2d(pattern);
        if (++count % 1e3 === 0) {
            showProgress(count, "patterns", 1e5);
        }
        countKeys(histo, clues);
    }

    // How are the number of clues distributed?
    console.log("\nHow many clues are there?");
    showDistribution(histo, 5);
}

// Generate a bunch of sudoku boards, and chart how many iterations each took.
function countBoardIterations() {
    const histo = {};
    let count = 0;
    for (let i = 0; i < 1e3; i++) {
        const iterations = createSudoku(true);
        showProgress(++count, "boards");
        countKeys(histo, iterations);
    }

    // How are the number of iterations distributed?
    console.log("\nHow many tries does it take to make a valid puzzle?");
    showDistribution(histo, 1e3);
}

countClues();
console.log("\n================================================================================\n");
countBoardIterations();
