// At the beginning of your script
document.addEventListener('DOMContentLoaded', function() {
    const winnerModal = document.getElementById('winnerModal');
    winnerModal.style.display = 'none';
});

// Initialize variables
let currentPlayer = 'X';
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;
let againstBot = false; // Variable to track if playing against a bot

// Function to toggle between playing against a friend or a bot
function toggleOpponent() {
    againstBot = !againstBot;

    // Optional: Add logic to display the current opponent mode to the user
    const opponentMode = againstBot ? 'against the bot' : 'against a friend';
    alert(`You are now playing ${opponentMode}.`);

    resetGame(); // Reset the game when switching opponents
}

// Function to handle cell click
function cellClick(index) {
    if (gameBoard[index] === '' && gameActive) {
        gameBoard[index] = currentPlayer;
        document.getElementById('board').children[index].innerText = currentPlayer;

        if (checkWin()) {
            showWinnerPopup(currentPlayer);
            gameActive = false;
        } else if (gameBoard.every(cell => cell !== '')) {
            showTiePopup();
            gameActive = false;
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            document.getElementById('status').innerText = `Player ${currentPlayer}'s turn`;

            if (againstBot && currentPlayer === 'O') {
                // If playing against bot, let the bot make a move
                makeBotMove();
            }
        }
    }
}

// Function to show a winner popup
function showWinnerPopup(player) {
    const popupMessage = `Player ${player} wins! 🎉`;

    // Show the winner message in the modal
    const winnerMessage = document.getElementById('winnerMessage');
    winnerMessage.innerText = `${popupMessage}\nResetting in 5 seconds...`;

    // Show the modal
    const winnerModal = document.getElementById('winnerModal');
    winnerModal.style.display = 'flex'; // Assuming your modal is set to flex

    // Throw confetti
    throwConfetti();

    // Countdown and auto-reset the game
    let countdown = 5;
    const countdownInterval = setInterval(() => {
        countdown--;
        winnerMessage.innerText = `${popupMessage}\nResetting in ${countdown} seconds...`;
        if (countdown <= 0) {
            clearInterval(countdownInterval);
            closeWinnerModal(); // Close the modal
            resetGame(); // Reset the game
        }
    }, 1000); // 1000 milliseconds = 1 second
}

// Function to show a tie popup
function showTiePopup() {
    const popupMessage = 'It\'s a tie!';

    // Show a simple alert as a popup
    alert(popupMessage);

    // Optionally, you can use a custom modal or any other popup UI library here
}

// Function to throw confetti
function throwConfetti() {
    const duration = 5000; // in milliseconds
    const options = {
        particleCount: 100,
        spread: 70,
        colors: ['#DCBFFF', '#F1EAFF', '#FF0000'],
    };

    confetti(options);
}

// Function to close the winner modal
function closeWinnerModal() {
    const winnerModal = document.getElementById('winnerModal');
    winnerModal.style.display = 'none';

    // Reset the confetti when the modal is closed
    confetti.reset();
}

// Function to check for a win
function checkWin() {
    const winPatterns = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8], // Rows
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8], // Columns
        [0, 4, 8],
        [2, 4, 6] // Diagonals
    ];

    return winPatterns.some(pattern => {
        const [a, b, c] = pattern;
        return gameBoard[a] !== '' && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c];
    });
}

// Function to reset the game
function resetGame() {
    currentPlayer = 'X';
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;

    document.getElementById('status').innerText = `Player ${currentPlayer}'s turn`;

    const cells = document.getElementById('board').children;
    for (let i = 0; i < cells.length; i++) {
        cells[i].innerText = ''; // Reset the cell content
        cells[i].style.pointerEvents = 'auto'; // Enable cell clicks
    }

    // Re-enable the reset button
    const resetButton = document.getElementById('resetButton');
    resetButton.disabled = false;
}

// Function to make a move for the bot
function makeBotMove() {
    // Implement your bot logic here
    // For simplicity, let's randomly choose an available cell
    const emptyCells = gameBoard.reduce((acc, value, index) => {
        if (value === '') {
            acc.push(index);
        }
        return acc;
    }, []);

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const botMove = emptyCells[randomIndex];

    // Simulate bot click after a delay
    setTimeout(() => {
        cellClick(botMove);
    }, 500); // Adjust the delay as needed
}

// Dynamically create the board
const board = document.getElementById('board');
for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.addEventListener('click', () => cellClick(i));
    board.appendChild(cell);
}

// Display initial status
document.getElementById('status').innerText = `Player ${currentPlayer}'s turn`;