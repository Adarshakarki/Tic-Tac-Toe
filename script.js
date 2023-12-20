document.addEventListener('DOMContentLoaded', function() {
    const winnerModal = document.getElementById('winnerModal');
    winnerModal.style.display = 'none';
});

let currentPlayer = 'X';
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;
let isBotOpponent = false;

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

            if (currentPlayer === 'O' && isBotOpponent) {
                setTimeout(makeBotMove, 1000);
            }
        }
    }
}

function makeBotMove() {
    if (currentPlayer === 'O') {
        const delay = Math.floor(Math.random() * 500) + 500;
        setTimeout(() => {
            const bestMove = getBestMove();
            const botMove = bestMove.index;

            gameBoard[botMove] = currentPlayer;
            document.getElementById('board').children[botMove].innerText = currentPlayer;

            if (checkWin()) {
                showWinnerPopup(currentPlayer);
                gameActive = false;
            } else if (gameBoard.every(cell => cell !== '')) {
                showTiePopup();
                gameActive = false;
            } else {
                currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
                document.getElementById('status').innerText = `Player ${currentPlayer}'s turn`;
            }
        }, delay);
    }
}

function getBestMove() {
    let bestMove = {
        score: -Infinity,
        index: -1,
    };

    for (let i = 0; i < 9; i++) {
        if (gameBoard[i] === '') {
            gameBoard[i] = currentPlayer;
            const score = minimax(gameBoard, 0, -Infinity, Infinity, false);
            gameBoard[i] = '';

            if (score > bestMove.score) {
                bestMove.score = score;
                bestMove.index = i;
            }
        }
    }

    return bestMove;
}

function minimax(board, depth, alpha, beta, isMaximizing) {
    const scores = {
        X: -1,
        O: 1,
        tie: 0,
    };

    if (checkWin()) {
        const winner = currentPlayer === 'X' ? 'O' : 'X';
        return scores[winner];
    }

    if (gameBoard.every(cell => cell !== '')) {
        return scores.tie;
    }

    if (isMaximizing) {
        let maxScore = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === '') {
                board[i] = 'O';
                const score = minimax(board, depth + 1, alpha, beta, false);
                board[i] = '';
                maxScore = Math.max(score, maxScore);
                alpha = Math.max(alpha, score);
                if (beta <= alpha) {
                    break;
                }
            }
        }
        return maxScore;
    } else {
        let minScore = Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === '') {
                board[i] = 'X';
                const score = minimax(board, depth + 1, alpha, beta, true);
                board[i] = '';
                minScore = Math.min(score, minScore);
                beta = Math.min(beta, score);
                if (beta <= alpha) {
                    break;
                }
            }
        }
        return minScore;
    }
}

function showWinnerPopup(player) {
    const popupMessage = `Player ${player} wins! 🎉`;

    const winnerMessage = document.getElementById('winnerMessage');
    winnerMessage.innerHTML = `<p>${popupMessage}</p><p>Resetting in 5 seconds...</p>`;

    const winnerModal = document.getElementById('winnerModal');
    winnerModal.style.display = 'flex';

    throwConfetti();

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

function showTiePopup() {
    const popupMessage = "It's a tie!";

    const winnerMessage = document.getElementById('winnerMessage');
    winnerMessage.innerHTML = `<p>${popupMessage}</p><p>Resetting in 5 seconds...</p>`;

    const winnerModal = document.getElementById('winnerModal');
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

    disableResetButton();
}

function throwConfetti() {
    const duration = 5000;
    const options = {
        particleCount: 100,
        spread: 70,
        colors: ['#DCBFFF', '#F1EAFF', '#FF0000'],
    };

    confetti(options);
}

function closeWinnerModal() {
    const winnerModal = document.getElementById('winnerModal');
    winnerModal.style.display = 'none';

    confetti.reset();
}

function checkWin() {
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

    return winPatterns.some(pattern => {
        const [a, b, c] = pattern;
        return gameBoard[a] !== '' && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c];
    });
}

function resetGame() {
    currentPlayer = 'X';
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;

    document.getElementById('status').innerText = `Player ${currentPlayer}'s turn`;

    const cells = document.getElementById('board').children;
    for (let i = 0; i < cells.length; i++) {
        cells[i].innerText = '';
    }

    const resetButton = document.getElementById('resetButton');
    resetButton.disabled = false;
}

const board = document.getElementById('board');
for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.addEventListener('click', () => cellClick(i));
    board.appendChild(cell);
}

document.getElementById('status').innerText = `Player ${currentPlayer}'s turn`;

function disableResetButton() {
    const resetButton = document.getElementById('resetButton');
    resetButton.disabled = true;
}

function toggleSwitch() {
    const opponentSwitch = document.getElementById('opponentSwitch');
    const friendEmoji = document.querySelector('.friend-emoji');
    const robotEmoji = document.querySelector('.robot-emoji');

    if (opponentSwitch.checked) {
        friendEmoji.style.opacity = '0.5';
        robotEmoji.style.opacity = '1';
        isBotOpponent = true;
    } else {
        friendEmoji.style.opacity = '1';
        robotEmoji.style.opacity = '0.5';
        isBotOpponent = false;
    }
}

function toggleOpponent() {
    toggleSwitch();
    resetGame();

    if (isBotOpponent && currentPlayer === 'O') {
        makeBotMove();
    }
}