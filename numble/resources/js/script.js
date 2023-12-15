// Numble Game JavaScript - Enhanced

document.addEventListener('DOMContentLoaded', () => {
    // Initialize game when the DOM is fully loaded
    initializeGame();
});

function initializeGame() {
    let targetNumber, attempts, currentGuess = [], currentRow = 0;
    const maxGuessLength = 6;
    const totalRows = 6;
    const guessGrid = document.getElementById('guessGrid');
    const submitGuess = document.getElementById('submitGuess');
    const restartGame = document.getElementById('restartGame');
    const difficultySelect = document.getElementById('difficulty');
    const scoreDisplay = document.getElementById('scoreDisplay');
    const digitButtons = Array.from(document.querySelectorAll('.digitButton'));

    // Generates a random number based on the difficulty
    function generateRandomNumber(difficulty) {
        let number = '';
        while (number.length < maxGuessLength) {
            let digit = Math.floor(Math.random() * 10).toString();
            if (shouldSkipDigit(digit, difficulty, number)) continue;
            number += digit;
        }
        return number;
    }

    // Determines if a digit should be skipped based on difficulty
    function shouldSkipDigit(digit, difficulty, number) {
        if (difficulty === 'easy' && number.includes(digit)) return true;
        if (difficulty === 'medium' && number.split(digit).length - 1 > 2) return true;
        return false;
    }

    // Starts a new game, resets the game state
    function startNewGame() {
        targetNumber = generateRandomNumber(difficultySelect.value);
        attempts = 0;
        currentRow = 0;
        currentGuess = [];
        scoreDisplay.textContent = "Score: 0";
        resetGuessGrid();
        resetDigitButtons(); 
        showModal('myModal');
    }

    // Resets the guess grid for a new game
    function resetGuessGrid() {
        guessGrid.innerHTML = ''; 
        for (let i = 0; i < totalRows * maxGuessLength; i++) {
            const cell = document.createElement('div');
            cell.classList.add('guessCell');
            guessGrid.appendChild(cell);
        }
    }

    // Resets the digit buttons for a new game
    function resetDigitButtons() {
        digitButtons.forEach(button => {
            button.classList.remove('crossed-out');
            button.disabled = false;
        });
    }

    // Updates the guess grid with the current guess
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

    // Checks if the current guess is correct
    function checkWinCondition() {
        const guess = currentGuess.join('');
        let score = calculateScore(guess);
        animateGuessResults(guess);
        setTimeout(() => updateGameState(guess, score), maxGuessLength * 600);
    }

    // Calculates the current score
    function calculateScore(guess) {
        let score = 100 - (10 * attempts);
        for (let i = 0; i < guess.length; i++) {
            if (guess[i] === targetNumber[i]) score += 5;
        }
        return score;
    }

    // Animates guess results and updates cell classes
    function animateGuessResults(guess) {
        const guessCells = guessGrid.querySelectorAll('.guessCell');
        guess.split('').forEach((digit, index) => {
            const cellIndex = currentRow * maxGuessLength + index;
            const cell = guessCells[cellIndex];
            setTimeout(() => updateCellClass(cell, digit, index), (index + 1) * 500);
        });
    }

    // Updates the class of a cell based on the guess
    function updateCellClass(cell, digit, index) {
        cell.classList.add('flip');
        if (digit === targetNumber[index]) {
            cell.classList.add('correct');
        } else if (targetNumber.includes(digit)) {
            cell.classList.add('present');
        } else {
            cell.classList.add('absent');
        }
    }

    // Updates the game state after a guess
    function updateGameState(guess, score) {
        crossOutAbsentDigits();
        if (guess === targetNumber) {
            endGame(true, score);
        } else if (currentRow === totalRows - 1) {
            endGame(false, score);
        } else {
            prepareNextGuess();
        }
        scoreDisplay.textContent = "Score: " + score;
    }

    // Prepares for the next guess
    function prepareNextGuess() {
        currentRow++;
        currentGuess = [];
        updateGridWithGuess();
    }

    // Crosses out absent digits
    function crossOutAbsentDigits() {
        digitButtons.forEach(button => {
            if (!targetNumber.includes(button.textContent)) {
                button.classList.add('crossed-out');
                button.disabled = true;
            }
        });
    }

    // Ends the game and shows the result
    function endGame(isWin, score) {
        document.getElementById('finalScore').textContent = score;
        showModal(isWin ? 'gameOverModal' : 'myModal');
    }

    // Shows a modal
    function showModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.style.display = "block";
    }

    // Event listeners
    digitButtons.forEach(button => {
        button.addEventListener('click', digitButtonClickHandler);
    });

    submitGuess.addEventListener('click', submitGuessHandler);
    restartGame.addEventListener('click', startNewGame);

    // Handles digit button click events
    function digitButtonClickHandler(event) {
        if (currentGuess.length < maxGuessLength) {
            currentGuess.push(event.target.textContent);
            updateGridWithGuess();
        }
    }

    // Handles submit guess button click events
    function submitGuessHandler() {
        if (currentGuess.length === maxGuessLength) {
            attempts++;
            checkWinCondition();
        } else {
            alert("Please enter all 6 digits before submitting.");
        }
    }

    // Initialization
    startNewGame();
});


