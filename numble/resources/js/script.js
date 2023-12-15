let targetNumber, attempts, currentGuess = [], currentRow = 0;
const maxGuessLength = 6;
const totalRows = 6;
const guessGrid = document.getElementById('guessGrid');
const submitGuess = document.getElementById('submitGuess');
const restartGame = document.getElementById('restartGame');
const difficultySelect = document.getElementById('difficulty');
const scoreDisplay = document.getElementById('scoreDisplay');
const digitButtons = document.querySelectorAll('.digitButton');

function generateRandomNumber(difficulty) {
    let number = '';
    while (number.length < maxGuessLength) {
        let digit = Math.floor(Math.random() * 10).toString();
        if ((difficulty === 'easy' && number.includes(digit)) ||
            (difficulty === 'medium' && number.split(digit).length - 1 > 2)) {
            continue;
        }
        number += digit;
    }
    return number;
}

function startNewGame() {
    targetNumber = generateRandomNumber(difficultySelect.value);
    attempts = 0;
    currentRow = 0;
    currentGuess = [];
    guessGrid.innerHTML = ''; 
    for (let i = 0; i < totalRows * maxGuessLength; i++) {
        let cell = document.createElement('div');
        cell.classList.add('guessCell');
        guessGrid.appendChild(cell);
    }
    scoreDisplay.textContent = "Score: 0";
    resetDigitButtons(); 

    let modal = document.getElementById('myModal');
    modal.style.display = "block";
}

function resetDigitButtons() {
    digitButtons.forEach(button => {
        button.classList.remove('crossed-out');
        button.disabled = false;
    });
}

function updateGridWithGuess() {
    const guessCells = guessGrid.querySelectorAll('.guessCell');
    guessCells.forEach((cell, index) => {
        const rowIndex = Math.floor(index / maxGuessLength);
        const cellIndex = index % maxGuessLength;
        if (rowIndex === currentRow) {
            cell.textContent = currentGuess[cellIndex] || '';
            cell.classList.remove('correct', 'present', 'absent', 'flip');
        }
    });
}

function checkWinCondition(guess) {
    const guessCells = guessGrid.querySelectorAll('.guessCell');
    let score = 100 - (10 * attempts);
    let absentDigits = new Set();

    guess.split('').forEach((digit, index) => {
        const cellIndex = currentRow * maxGuessLength + index;
        const cell = guessCells[cellIndex];
        
        if (!targetNumber.includes(digit)) {
            absentDigits.add(digit);
        }


        // Delay flipping and coloring
        setTimeout(() => {
            cell.classList.add('flip');
            if (digit === targetNumber[index]) {
                cell.classList.add('correct');
                score += 5;
            } else if (targetNumber.includes(digit)) {
                cell.classList.add('present');
            } else {
                cell.classList.add('absent');
            }
        }, (index + 1) * 500);
    });

    setTimeout(() => {
        digitButtons.forEach(button => {
            if (!targetNumber.includes(button.textContent)) {
                button.classList.add('crossed-out');
                button.disabled = true;
            }
        });

        if (guess === targetNumber) {
            endGame(true, score);
        } else if (currentRow === totalRows - 1) {
            endGame(false, score);
        } else {
            currentRow++;
            currentGuess = [];
            updateGridWithGuess();
        }
        scoreDisplay.textContent = "Score: " + score;
    }, maxGuessLength * 600);
}

function crossOutAbsentDigits(absentDigits) {
    digitButtons.forEach(button => {
        if (!absentDigits.has(button.textContent)) {
            button.classList.add('crossed-out');
            button.disabled = true;
        }
    });
}

function endGame(isWin, score) {
    document.getElementById('finalScore').textContent = score;
    
    // Show the game over modal
    let gameOverModal = document.getElementById('gameOverModal');
    gameOverModal.style.display = "block";
}

// Event listener for 'Play Again' button
document.getElementById('playAgainButton').addEventListener('click', () => {
    gameOverModal.style.display = "none";
    startNewGame(); // You will need to define this function or replace it with the relevant code
});

// Event listener for 'Share with a Friend' button
document.getElementById('shareButton').addEventListener('click', () => {
    const gameUrl = "https://numble-game.com";
    navigator.clipboard.writeText(gameUrl).then(() => {
        alert("Link copied to clipboard!");
    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
});

digitButtons.forEach(button => {
    button.addEventListener('click', () => {
        if (currentGuess.length < maxGuessLength) {
            currentGuess.push(button.textContent);
            updateGridWithGuess();
        }
    });
});

document.getElementById('backButton').addEventListener('click', () => {
    if (currentGuess.length > 0) {
        currentGuess.pop();
        updateGridWithGuess();
    }
});

submitGuess.addEventListener('click', () => {
    if (currentGuess.length === maxGuessLength) {
        attempts++;
        checkWinCondition(currentGuess.join(''));
    } else {
        alert("Please enter all 6 digits before submitting.");
    }
});

restartGame.addEventListener('click', startNewGame);

var modal = document.getElementById('myModal');
var span = document.getElementsByClassName("close")[0];
span.onclick = function() {
    modal.style.display = "none";
}

var gameOverModal = document.getElementById('gameOverModal');
var spanCloseGameOver = document.getElementsByClassName("closeGameOver")[0];
spanCloseGameOver.onclick = function() {
    gameOverModal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == modal || event.target == gameOverModal) {
        modal.style.display = "none";
        gameOverModal.style.display = "none";
    }
}

document.getElementById('playAgainButton').addEventListener('click', () => {
    gameOverModal.style.display = "none";
    startNewGame();
});

document.getElementById('closeModalButton').addEventListener('click', () => {
    modal.style.display = "none";
});

startNewGame();
