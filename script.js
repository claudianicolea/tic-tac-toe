// set up

let userSymbol = 'x', computerSymbol = 'o';
let board = [];
let userScore = 0, computerScore = 0;

for (let i = 0; i < 9; i++) board.push('');

// player vs computer game variables

document.getElementById('userScore').innerText = userScore.toString();
document.getElementById('computerScore').innerText = computerScore.toString();

let cells = Array.from(document.getElementsByClassName('cell'));
cells.forEach((cell, index) => {
    cell.addEventListener('click', () => {
        if (board[index] !== '') return;

        cell.innerText = userSymbol.toUpperCase();
        board[index] = userSymbol;
        if (!checkGameOver()) computerMove();
    })
})

// game functionality

function computerMove() {
    let bestScore = -Infinity;
    let bestMove = null;

    for (let i = 0; i < 9; i++) {
        if (board[i] === '') {
            // simulate move
            board[i] = computerSymbol;
            let score = minimax(0, false);
            board[i] = '';
            if (score > bestScore) {
                bestScore = score;
                bestMove = i;
            }
        }
    }

    if (!bestMove) return;

    board[bestMove] = computerSymbol;
    cells[bestMove].innerText = computerSymbol.toUpperCase();
    checkGameOver();
}

function minimax(depth, isMaximizing) {
    if (checkWin(computerSymbol)) return 10 - depth;
    if (checkWin(userSymbol)) return depth - 10;
    if (checkDraw()) return 0;

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === '') {
                board[i] = computerSymbol;
                let score = minimax(depth + 1, false);
                board[i] = '';
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    }
    else {
        let bestScore = Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === '') {
                board[i] = userSymbol;
                let score = minimax(depth + 1, true);
                board[i] = '';
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

function checkGameOver() {
    // the 50 milliseconds delay fixes problems with the last computer move and alert display
    if (checkWin(userSymbol)) {
        setTimeout(() => {
            alert("Congrats! You've won.");
            userScore++;
            reset();
        }, 50);
        return true;
    }
    if (checkWin(computerSymbol)) {
        setTimeout(() => {
            alert("You've lost, but that's okay. Good game.");
            computerScore++;
            reset();
        }, 50);
        return true;
    }
    if (checkDraw()) {
        setTimeout(() => {
            alert("There is a draw. Good game though.");
            reset();
        }, 50);
        return true;
    }
    return false;
}

function checkWin(playerSymbol) {
    return ((board[0] === playerSymbol && board[1] === playerSymbol && board[2] === playerSymbol) ||
        (board[3] === playerSymbol && board[4] === playerSymbol && board[5] === playerSymbol) ||
        (board[6] === playerSymbol && board[7] === playerSymbol && board[8] === playerSymbol) ||
        (board[0] === playerSymbol && board[3] === playerSymbol && board[6] === playerSymbol) ||
        (board[1] === playerSymbol && board[4] === playerSymbol && board[7] === playerSymbol) ||
        (board[2] === playerSymbol && board[5] === playerSymbol && board[8] === playerSymbol) ||
        (board[0] === playerSymbol && board[4] === playerSymbol && board[8] === playerSymbol) ||
        (board[2] === playerSymbol && board[4] === playerSymbol && board[6] === playerSymbol)
    );
}

function checkDraw() {
    for (let i = 0; i < 9; i++)
        if (board[i] === '') return false;
    
    return !checkWin(userSymbol) && !checkWin(computerSymbol);
}

function reset() {
    document.getElementById('userScore').innerText = userScore.toString();
    document.getElementById('computerScore').innerText = computerScore.toString();
    for (let i = 0; i < 9; i++) {
        board[i] = '';
        cells[i].innerText = '';
    }
}