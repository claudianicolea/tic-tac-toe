// set up

let userSymbol = 'x', computerSymbol = 'o';
let board = [];
let userScore = 0, computerScore = 0;
let gameInProgress = false;

for (let i = 0; i < 9; i++) board.push('');

// player vs computer game variables

document.getElementById('userScore').innerText = userScore.toString();
document.getElementById('computerScore').innerText = computerScore.toString();

let cells = Array.from(document.getElementsByClassName('cell'));
cells.forEach((cell, index) => {
    cell.addEventListener('click', () => {
        if (board[index] !== '') return;

        gameInProgress = true;
        cell.innerText = userSymbol.toUpperCase();
        board[index] = userSymbol;
        checkGameOver();
        if (gameInProgress) computerMove();
    })
})

// game functionality

function computerMove() {
    let randomPosition;
    do {
        randomPosition = Math.floor(Math.random() * 9); // random number 0-8
    } while (board[randomPosition] !== '')
    cells[randomPosition].innerText = computerSymbol.toUpperCase();
    board[randomPosition] = computerSymbol;
    checkGameOver();
}

function checkGameOver() {
    gameInProgress = false;

    // the 50 milliseconds delay fixes problems with the last computer move and alert display
    if (checkWin(userSymbol)) {
        setTimeout(() => {
            alert("Congrats! You've won.");
            userScore++;
            reset();
        }, 50);
        return;
    }
    if (checkWin(computerSymbol)) {
        setTimeout(() => {
            alert("You've lost, but that's okay. Good game.");
            computerScore++;
            reset();
        }, 50);
        return;
    }
    if (checkDraw()) {
        setTimeout(() => {
            alert("There is a draw. Good game though.");
            reset();
        }, 50);
        return;
    }
    gameInProgress = true;
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
    let boardIsFull = true;
    for (let i = 0; i < 9; i++)
        if (board[i] === '') boardIsFull = false;
    
    return !checkWin(userSymbol) && !checkWin(computerSymbol) && boardIsFull;
}

function reset() {
    document.getElementById('userScore').innerText = userScore.toString();
    document.getElementById('computerScore').innerText = computerScore.toString();
    for (let i = 0; i < 9; i++) {
        board[i] = '';
        cells[i].innerText = '';
    }
}