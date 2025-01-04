let currentPlayer = 'X'; // Player 1 is X
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let player1Name = '';
let player2Name = '';
let gameMode = 'friend';  // Default to play with friend

const squares = document.querySelectorAll('.square');
const winnerText = document.getElementById('winner-name');
const currentPlayerText = document.getElementById('current-player');
const resetButton = document.getElementById('reset');
const player1Input = document.getElementById('player1');
const player2Input = document.getElementById('player2');
const gameModeSelect = document.getElementById('gameMode');
const playersSection = document.getElementById('players-section');
const player2Section = document.getElementById('player2-section');

// Event listeners for game mode and player inputs
gameModeSelect.addEventListener('change', () => {
    gameMode = gameModeSelect.value;
    if (gameMode === 'friend') {
        playersSection.style.display = 'block';
        player2Section.style.display = 'block';  // Show Player 2 input
    } else {
        playersSection.style.display = 'block';
        player2Section.style.display = 'none';  // Hide Player 2 input
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

    // Update the game board and the UI with the current player's move
    gameBoard[index] = currentPlayer;
    square.textContent = currentPlayer;

    // Update the current turn display
    updateCurrentTurn();

    // Check for winner after the move
    if (checkWinner()) {
        updateWinnerText();
        return;
    }

    // Check if the board is full (draw scenario)
    if (gameBoard.every(cell => cell !== '')) {
        winnerText.textContent = "It's a draw!";
        return;
    }

    // Switch to the other player
    if (gameMode === 'friend') {
        // In friend mode, switch between Player 1 and Player 2
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    } else if (gameMode === 'computer' && currentPlayer === 'X') {
        // In computer mode, switch to Player 2 (computer) after Player 1 (X) plays
        currentPlayer = 'O';
        setTimeout(() => {
            computerMove();
        }, 500);  // Delay to simulate computer thinking
    }
}

function computerMove() {
    // Get a random empty square for the computer
    const availableSquares = gameBoard
        .map((value, index) => value === '' ? index : null)
        .filter(value => value !== null);
    
    if (availableSquares.length === 0) return; // No moves left
    
    const randomIndex = availableSquares[Math.floor(Math.random() * availableSquares.length)];
    gameBoard[randomIndex] = 'O';  // Computer is 'O'
    squares[randomIndex].textContent = 'O';

    // Update the current turn display
    updateCurrentTurn();

    // Check for winner after computer's move
    if (checkWinner()) {
        updateWinnerText();
        return;
    }

    // Check if the board is full (draw scenario)
    if (gameBoard.every(cell => cell !== '')) {
        winnerText.textContent = "It's a draw!";
        return;
    }

    // Switch back to Player 1's turn (X)
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
        winnerName = 'Computer'; // When computer wins, display 'Computer'
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
