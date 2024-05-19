import { hideCells } from './pattern.js';
import { checkSolution, createSudoku } from './sudoku.js';

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
