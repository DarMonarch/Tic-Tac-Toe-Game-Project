let currentPlayer = 'X';
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let player1Name = '';
let player2Name = '';
let gameMode = 'friend';

const squares = document.querySelectorAll('.square');
const winnerText = document.getElementById('winner-name');
const currentPlayerText = document.getElementById('current-player');
const resetButton = document.getElementById('reset');
const player1Input = document.getElementById('player1');
const player2Input = document.getElementById('player2');
const gameModeSelect = document.getElementById('gameMode');
const playersSection = document.getElementById('players-section');
const player2Section = document.getElementById('player2-section');

gameModeSelect.addEventListener('change', () => {
    gameMode = gameModeSelect.value;
    if (gameMode === 'friend') {
        playersSection.style.display = 'block';
        player2Section.style.display = 'block';
    } else {
        playersSection.style.display = 'block';
        player2Section.style.display = 'none';
    }
});

squares.forEach(square => {
    square.addEventListener('click', () => handleSquareClick(square));
});

player1Input.addEventListener('input', () => player1Name = player1Input.value);
player2Input.addEventListener('input', () => player2Name = player2Input.value);

function handleSquareClick(square) {
    const index = square.getAttribute('data-index');
    if (gameBoard[index] !== '' || checkWinner()) return;

    gameBoard[index] = currentPlayer;
    square.textContent = currentPlayer;

    updateCurrentTurn();

    if (checkWinner()) {
        updateWinnerText();
        return;
    }

    if (gameBoard.every(cell => cell !== '')) {
        winnerText.textContent = "It's a draw!";
        return;
    }

    if (gameMode === 'friend') {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    } else if (gameMode === 'computer' && currentPlayer === 'X') {
        currentPlayer = 'O';
        setTimeout(() => {
            computerMove();
        }, 500);
    }
}

function computerMove() {
    const availableSquares = gameBoard
        .map((value, index) => value === '' ? index : null)
        .filter(value => value !== null);
    
    if (availableSquares.length === 0) return;
    
    const randomIndex = availableSquares[Math.floor(Math.random() * availableSquares.length)];
    gameBoard[randomIndex] = 'O';
    squares[randomIndex].textContent = 'O';

    updateCurrentTurn();

    if (checkWinner()) {
        updateWinnerText();
        return;
    }

    if (gameBoard.every(cell => cell !== '')) {
        winnerText.textContent = "It's a draw!";
        return;
    }

    currentPlayer = 'X';
}

function updateCurrentTurn() {
    let currentTurnMessage = '';
    
    if (gameMode === 'computer' && currentPlayer === 'X') {
        currentTurnMessage = `Current Turn: Computer`;
    } else {
        const currentPlayerName = currentPlayer === 'O' ? player1Name : player2Name;
        currentTurnMessage = `Current Turn: ${currentPlayerName}`;
    }

    currentPlayerText.textContent = currentTurnMessage;
}

function checkWinner() {
    const winPatterns = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    for (const [a, b, c] of winPatterns) {
        if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
            return true;
        }
    }
    return false;
}

function updateWinnerText() {
    let winnerName = '';
    
    if (gameMode === 'computer' && currentPlayer === 'O') {
        winnerName = 'Computer';
    } else {
        winnerName = currentPlayer === 'X' ? player1Name : player2Name;
    }
    
    winnerText.textContent = `Winner: ${winnerName}`;
}


function resetGame() {
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    winnerText.textContent = 'Winner: ';
    currentPlayerText.textContent = 'Current Turn: ';
    squares.forEach(square => square.textContent = '');
}
