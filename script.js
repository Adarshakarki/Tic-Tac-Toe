document.addEventListener('DOMContentLoaded', function() {
    const winnerModal = document.getElementById('winnerModal');
    winnerModal.style.display = 'none';
});

let currentPlayer = 'X';
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;

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
        }
    }
}

function showWinnerPopup(player) {
    const popupMessage = `Player ${player} wins! 🎉`;

    const winnerMessage = document.getElementById('winnerMessage');
    winnerMessage.innerText = `${popupMessage}\nResetting in 5 seconds...`;

    const winnerModal = document.getElementById('winnerModal');
    winnerModal.style.display = 'flex';

    throwConfetti();

    let countdown = 5;
    const countdownInterval = setInterval(() => {
        countdown--;
        winnerMessage.innerText = `${popupMessage}\nResetting in ${countdown} seconds...`;
        if (countdown <= 0) {
            clearInterval(countdownInterval);
            closeWinnerModal();
            resetGame();
        }
    }, 1000);
}

function showTiePopup() {
    const popupMessage = 'It\'s a tie!';

    const winnerMessage = document.getElementById('winnerMessage');
    winnerMessage.innerText = `${popupMessage}\nResetting in 5 seconds...`;

    const winnerModal = document.getElementById('winnerModal');
    winnerModal.style.display = 'flex';

    let countdown = 5;
    const countdownInterval = setInterval(() => {
        countdown--;
        winnerMessage.innerText = `${popupMessage}\nResetting in ${countdown} seconds...`;
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

function showTiePopup() {
    const popupMessage = 'It\'s a tie!';

    const winnerMessage = document.getElementById('winnerMessage');
    winnerMessage.innerText = `${popupMessage}\nResetting in 5 seconds...`;

    const winnerModal = document.getElementById('winnerModal');
    winnerModal.style.display = 'flex';

    let countdown = 5;
    const countdownInterval = setInterval(() => {
        countdown--;
        winnerMessage.innerText = `${popupMessage}\nResetting in ${countdown} seconds...`;
        if (countdown <= 0) {
            clearInterval(countdownInterval);
            closeWinnerModal();
            resetGame();
        }
    }, 1000);

    disableResetButton();
}