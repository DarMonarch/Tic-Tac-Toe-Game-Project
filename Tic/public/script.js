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

// Event listeners for game mode and player inputs
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

    // Update the game board and the UI with the current player's move
    gameBoard[index] = currentPlayer;
    square.textContent = currentPlayer;

    // Make the API call to handle the move and get the updated game state
    fetch('/api/play', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            index: index,
            currentPlayer: currentPlayer,
            gameMode: gameMode
        })
    })
    .then(response => response.json())
    .then(data => {
        // Update the game board based on the response
        gameBoard = data.gameBoard;
        currentPlayer = data.nextPlayer;
        updateCurrentTurn();
        
        // Check for winner
        if (data.winnerName) {
            winnerText.textContent = `Winner: ${data.winnerName}`;
        } else if (gameBoard.every(cell => cell !== '')) {
            winnerText.textContent = "It's a draw!";
        }
    });
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

function resetGame() {
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    winnerText.textContent = 'Winner: ';
    currentPlayerText.textContent = 'Current Turn: ';
    squares.forEach(square => square.textContent = '');
}

resetButton.addEventListener('click', resetGame);
