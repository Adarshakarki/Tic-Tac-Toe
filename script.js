// Ensure the winner modal is hidden on page load
document.addEventListener('DOMContentLoaded', function() {
    const winnerModal = document.getElementById('winnerModal');
    if (winnerModal) {
        winnerModal.style.display = 'none';
    } else {
        console.warn("Winner modal with ID 'winnerModal' not found.");
    }
});

// Game state variables
let currentPlayer = 'X'; // 'X' always starts (human)
let gameBoard = ['', '', '', '', '', '', '', '', '']; // Represents the 9 cells of the board
let gameActive = true; // True while the game is in progress
let isBotOpponent = false; // True if playing against the AI bot

/**
 * Handles a click on a Tic-Tac-Toe cell.
 * @param {number} index The index of the clicked cell (0-8).
 */
function cellClick(index) {
    // Only allow a move if the cell is empty and game is active
    // In bot mode, only allow human moves when it's X's turn
    // In human vs human mode, allow any player's move
    if (gameBoard[index] === '' && gameActive && 
        (!isBotOpponent || currentPlayer === 'X')) {
        
        gameBoard[index] = currentPlayer;
        const cellElement = document.getElementById('board').children[index];
        cellElement.innerText = currentPlayer;
        cellElement.style.color = currentPlayer === 'X' ? 'red' : 'blue';

        // Check for win or tie after current player's move
        if (checkWin()) {
            showWinnerPopup(currentPlayer);
            gameActive = false;
        } else if (gameBoard.every(cell => cell !== '')) {
            showTiePopup();
            gameActive = false;
        } else {
            // Switch players
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            
            if (isBotOpponent) {
                // Bot mode: if it's now O's turn, make bot move
                if (currentPlayer === 'O') {
                    document.getElementById('status').innerText = `Bot is thinking...`;
                    setTimeout(makeBotMove, 150); // Very short delay for aggressive feel
                } else {
                    document.getElementById('status').innerText = `Player ${currentPlayer}'s turn`;
                }
            } else {
                // Human vs human mode: just update status
                document.getElementById('status').innerText = `Player ${currentPlayer}'s turn`;
            }
        }
    }
}

/**
 * Initiates the AI bot's move with aggressive, optimal play.
 */
function makeBotMove() {
    if (currentPlayer === 'O' && gameActive) {
        const bestMove = getBestMove();
        
        if (bestMove.index !== -1) {
            gameBoard[bestMove.index] = 'O';
            const cellElement = document.getElementById('board').children[bestMove.index];
            cellElement.innerText = 'O';
            cellElement.style.color = 'blue';

            // Check for win or tie after bot's move
            if (checkWin()) {
                showWinnerPopup('O');
                gameActive = false;
            } else if (gameBoard.every(cell => cell !== '')) {
                showTiePopup();
                gameActive = false;
            } else {
                // Switch back to human
                currentPlayer = 'X';
                document.getElementById('status').innerText = `Player ${currentPlayer}'s turn`;
            }
        }
    }
}

/**
 * Gets the best move using an aggressive minimax algorithm.
 * The bot will prioritize winning, then blocking, then center/corners.
 */
function getBestMove() {
    // First, check if bot can win immediately
    for (let i = 0; i < 9; i++) {
        if (gameBoard[i] === '') {
            gameBoard[i] = 'O';
            if (checkWinOnBoard(gameBoard) === 'O') {
                gameBoard[i] = '';
                return { index: i, score: 10 };
            }
            gameBoard[i] = '';
        }
    }

    // Second, check if bot needs to block human from winning
    for (let i = 0; i < 9; i++) {
        if (gameBoard[i] === '') {
            gameBoard[i] = 'X';
            if (checkWinOnBoard(gameBoard) === 'X') {
                gameBoard[i] = '';
                return { index: i, score: 5 };
            }
            gameBoard[i] = '';
        }
    }

    // Use minimax for optimal play
    let bestScore = -Infinity;
    let bestMove = -1;

    for (let i = 0; i < 9; i++) {
        if (gameBoard[i] === '') {
            gameBoard[i] = 'O';
            let score = minimax(gameBoard, 0, false, -Infinity, Infinity);
            gameBoard[i] = '';
            
            if (score > bestScore) {
                bestScore = score;
                bestMove = i;
            }
        }
    }

    return { index: bestMove, score: bestScore };
}

/**
 * Aggressive minimax algorithm with alpha-beta pruning.
 * Bot (O) is maximizing player, Human (X) is minimizing player.
 */
function minimax(board, depth, isMaximizing, alpha, beta) {
    const winner = checkWinOnBoard(board);
    
    if (winner === 'O') {
        return 10 - depth; // Bot wins, prefer faster wins
    } else if (winner === 'X') {
        return depth - 10; // Human wins, prefer slower losses
    } else if (board.every(cell => cell !== '')) {
        return 0; // Tie
    }

    if (isMaximizing) {
        // Bot's turn - maximize score
        let maxScore = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === '') {
                board[i] = 'O';
                let score = minimax(board, depth + 1, false, alpha, beta);
                board[i] = '';
                
                maxScore = Math.max(score, maxScore);
                alpha = Math.max(alpha, score);
                
                if (beta <= alpha) {
                    break; // Alpha-beta pruning
                }
            }
        }
        return maxScore;
    } else {
        // Human's turn - minimize score
        let minScore = Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === '') {
                board[i] = 'X';
                let score = minimax(board, depth + 1, true, alpha, beta);
                board[i] = '';
                
                minScore = Math.min(score, minScore);
                beta = Math.min(beta, score);
                
                if (beta <= alpha) {
                    break; // Alpha-beta pruning
                }
            }
        }
        return minScore;
    }
}

/**
 * Checks for a win condition on a given board state.
 */
function checkWinOnBoard(boardState) {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    for (const pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (boardState[a] !== '' && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
            return boardState[a];
        }
    }
    return null;
}

/**
 * Checks for a win condition on the current global gameBoard.
 */
function checkWin() {
    return checkWinOnBoard(gameBoard) !== null;
}

/**
 * Displays the winner popup with a countdown to reset.
 */
function showWinnerPopup(player) {
    const popupMessage = player === 'O' && isBotOpponent ? 
        `🤖 Bot wins! Better luck next time! 🎯` : 
        `🎉 Player ${player} wins! 🏆`;
    
    const winnerMessage = document.getElementById('winnerMessage');
    const winnerModal = document.getElementById('winnerModal');

    winnerMessage.innerHTML = `<p>${popupMessage}</p><p>Resetting in 5 seconds...</p>`;
    winnerModal.style.display = 'flex';

    if (player === 'X' || !isBotOpponent) {
        throwConfetti(); // Celebrate human wins or any win in human vs human mode
    }

    let countdown = 5;
    const countdownInterval = setInterval(() => {
        countdown--;
        winnerMessage.innerHTML = `<p>${popupMessage}</p><p>Resetting in ${countdown} seconds...</p>`;
        if (countdown <= 0) {
            clearInterval(countdownInterval);
            closeWinnerModal();
            resetGame();
        }
    }, 1000);
}

/**
 * Displays the tie popup with a countdown to reset.
 */
function showTiePopup() {
    const popupMessage = isBotOpponent ? 
        "🤝 It's a tie! The bot couldn't be beaten!" :
        "🤝 It's a tie! Great game!";
    const winnerMessage = document.getElementById('winnerMessage');
    const winnerModal = document.getElementById('winnerModal');

    winnerMessage.innerHTML = `<p>${popupMessage}</p><p>Resetting in 5 seconds...</p>`;
    winnerModal.style.display = 'flex';

    let countdown = 5;
    const countdownInterval = setInterval(() => {
        countdown--;
        winnerMessage.innerHTML = `<p>${popupMessage}</p><p>Resetting in ${countdown} seconds...</p>`;
        if (countdown <= 0) {
            clearInterval(countdownInterval);
            closeWinnerModal();
            resetGame();
        }
    }, 1000);
}

/**
 * Triggers a confetti animation.
 */
function throwConfetti() {
    if (typeof confetti === 'function') {
        const options = {
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#DCBFFF', '#F1EAFF', '#FF0000', '#0000FF'],
        };
        confetti(options);
    } else {
        console.warn("Confetti library not loaded.");
    }
}

/**
 * Hides the winner/tie modal and resets the confetti.
 */
function closeWinnerModal() {
    const winnerModal = document.getElementById('winnerModal');
    winnerModal.style.display = 'none';

    if (typeof confetti === 'function' && confetti.reset) {
        confetti.reset();
    }
}

/**
 * Resets the game to its initial state.
 */
function resetGame() {
    currentPlayer = 'X';
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;

    document.getElementById('status').innerText = `Player ${currentPlayer}'s turn`;

    const cells = document.getElementById('board').children;
    for (let i = 0; i < cells.length; i++) {
        cells[i].innerText = '';
        cells[i].style.color = '';
    }

    const resetButton = document.getElementById('resetButton');
    if (resetButton) {
        resetButton.disabled = false;
    }
}

// Dynamically create the Tic-Tac-Toe board cells
const board = document.getElementById('board');
if (board) {
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.addEventListener('click', () => cellClick(i));
        board.appendChild(cell);
    }
} else {
    console.error("Board element with ID 'board' not found. Cannot create game cells.");
}

// Set initial status text
const statusElement = document.getElementById('status');
if (statusElement) {
    statusElement.innerText = `Player ${currentPlayer}'s turn`;
} else {
    console.warn("Status element with ID 'status' not found.");
}

/**
 * Toggles the visual state of the opponent switch.
 */
function toggleSwitch() {
    const opponentSwitch = document.getElementById('opponentSwitch');
    const friendIcon = document.querySelector('.friend-icon');
    const robotIcon = document.querySelector('.robot-icon');

    if (opponentSwitch && friendIcon && robotIcon) {
        if (opponentSwitch.checked) {
            friendIcon.style.opacity = '0.5';
            robotIcon.style.opacity = '1';
            isBotOpponent = true;
        } else {
            friendIcon.style.opacity = '1';
            robotIcon.style.opacity = '0.5';
            isBotOpponent = false;
        }
    } else {
        console.warn("Opponent switch or icon elements not found.");
    }
}

/**
 * Toggles the opponent type and resets the game.
 */
function toggleOpponent() {
    toggleSwitch();
    resetGame();
}

// Add event listeners
const opponentSwitchInput = document.getElementById('opponentSwitch');
if (opponentSwitchInput) {
    opponentSwitchInput.addEventListener('change', toggleOpponent);
}

const resetButton = document.getElementById('resetButton');
if (resetButton) {
    resetButton.addEventListener('click', resetGame);
}