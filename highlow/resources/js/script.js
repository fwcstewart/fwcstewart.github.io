document.addEventListener('DOMContentLoaded', () => {
    const elements = {
        currentNumberDisplay: document.getElementById("currentNumber"),
        nextNumberDisplay: document.getElementById("nextNumber"),
        higherBtn: document.getElementById("higherBtn"),
        lowerBtn: document.getElementById("lowerBtn"),
        scoreDisplay: document.getElementById("score"),
        streakDisplay: document.getElementById("streak"),
        levelDisplay: document.getElementById("level"),
        timeLeftDisplay: document.getElementById("timeLeft"),
        gameModeButtons: document.querySelectorAll(".mode-btn"),
        skipsRemaining: document.getElementById("skipsRemaining"),
        skipBtn: document.getElementById("skipBtn"),
        doublePointsBtn: document.getElementById("doublePointsBtn"),
        feedbackElement: document.getElementById('feedback'),
        tutorialModal: document.getElementById('tutorialModal'),
        tutorialText: document.getElementById('tutorialText'),
        nextTutorialStepBtn: document.getElementById('nextTutorialStep'),
        leaderboardSection: document.getElementById('leaderboard-section'),
        leaderboardList: document.getElementById('leaderboard-list'),
        closeLeaderboardBtn: document.getElementById('closeLeaderboardBtn'),
        gameModeSelection: document.getElementById("game-mode-selection"),
        gameInterface: document.getElementById("game-interface"),
        backBtn: document.getElementById("backBtn")
    };

    let gameState = {
        currentNumber: 0,
        nextNumber: 0,
        score: 0,
        streak: 0,
        level: 1,
        gameTime: 60,
        timer: null,
        gameMode: "classic",
        doublePoints: false,
        doublePointsRemaining: 1,
        skips: false,
        skipsRemaining: 1,
        multiplier: 1,
        currentTutorialStep: 0,
        tutorialSteps: [
            "This is the game area. Here you'll see the current number and make your guesses.",
            "Click 'Higher' or 'Lower' to make your guess based on whether you think the next number will be higher or lower.",
            "Your score and level are shown here. Your score increases with each correct guess.",
            "Use power-ups like 'Skip' or 'Double Points' to help you advance in the game."
        ]
    };

    function updateTutorial(step) {
        if (step < gameState.tutorialSteps.length) {
            elements.tutorialText.innerText = gameState.tutorialSteps[step];
            elements.tutorialModal.style.display = 'block';
        } else {
            elements.tutorialModal.style.display = 'none';
        }
    }

    function updateScoreboard() {
        elements.scoreDisplay.textContent = gameState.score;
        elements.streakDisplay.textContent = gameState.streak;
        elements.levelDisplay.textContent = gameState.level;
    }

    // Update Game
function updateGame() {
    gameState.currentNumber = generateNumber();
    gameState.nextNumber = generateNumber();
    elements.currentNumberDisplay.textContent = gameState.currentNumber;
    elements.nextNumberDisplay.textContent = "?";
    updateScoreboard();
    elements.timeLeftDisplay.textContent = gameState.gameTime;
    elements.skipsRemaining.textContent = gameState.skipsRemaining; // Using elements.skipsRemaining
}    


    // Handle Guess
function handleGuess(isHigher) {
    const isCorrect = (isHigher && gameState.nextNumber > gameState.currentNumber) || (!isHigher && gameState.nextNumber < gameState.currentNumber);
    showFeedback(isCorrect);
    elements.nextNumberDisplay.textContent = gameState.nextNumber;
    updateMultiplier(isCorrect);
    updateScore(isCorrect);
    if (isCorrect) {
        gameState.streak++;
        gameState.level = Math.floor(gameState.score / 10) + 1;
    } else {
        gameState.streak = 0;
        if (gameState.gameMode === "suddenDeath") {
            alert("Wrong guess. Game over!");
            gameOver();
            return;
        }
    }
    setTimeout(updateGame, 2000);
}

// Start Timer
function startTimer() {
    gameState.timer = setInterval(() => {
        gameState.gameTime--;
        elements.timeLeftDisplay.textContent = gameState.gameTime;
        if (gameState.gameTime <= 0) {
            clearInterval(gameState.timer);
            gameOver();
        }
    }, 1000);
}

        function startGame(selectedMode) {
        gameState.gameMode = selectedMode;
        gameState.score = 0;
        gameState.streak = 0;
        gameState.level = 1;
        gameState.gameTime = (selectedMode === "timeTrial") ? 60 : null;

        // Fixed reference to gameState.currentTutorialStep
        gameState.currentTutorialStep = 0;
        updateTutorial(gameState.currentTutorialStep);

        updateGame();
        if (selectedMode === "timeTrial") {
            startTimer();
        }
    }

    // Reset Game
    function resetGame() {
    clearInterval(gameState.timer);
        document.querySelectorAll(".game-section").forEach(el => el.style.display = "none");
        document.getElementById("game-mode-selection").style.display = "block";
    }

    // Placeholder for updateLeaderboard function
function updateLeaderboard(entry) {
    // Implementation for updating leaderboard
    console.log("Leaderboard updated", entry);
}
    
    // Game Over
function gameOver() {
    let playerName = prompt("Game over! Enter your name for the leaderboard:", "Player");
    if (playerName) {
        const entry = { name: playerName, score: gameState.score };
        updateLeaderboard(entry);
    }
    resetGame();
}


    // Show Feedback
function showFeedback(isCorrect, message = '') {
    elements.feedbackElement.textContent = message || (isCorrect ? 'Correct!' : 'Wrong!');
    elements.feedbackElement.style.color = isCorrect ? 'green' : 'red';
    setTimeout(() => {
        elements.feedbackElement.textContent = '';
    }, 2000);
}

   // Attaching all event listeners
        function attachEventListeners() {
        elements.gameModeButtons.forEach(btn => {
            // Correctly pass the game mode to the selectGameMode function
            btn.addEventListener("click", () => {
                const mode = btn.getAttribute("data-mode");
                selectGameMode(mode);
            });
        });
        
        elements.higherBtn.addEventListener("click", () => handleGuess(true));
        elements.lowerBtn.addEventListener("click", () => handleGuess(false));

        // Check if elements exist before adding event listeners
        if(elements.nextTutorialStepBtn) {
            elements.nextTutorialStepBtn.addEventListener('click', () => {
                gameState.currentTutorialStep++;
                updateTutorial(gameState.currentTutorialStep);
            });
        }

        if(elements.doublePointsBtn) {
            elements.doublePointsBtn.addEventListener("click", useDoublePoints);
        }

        if(elements.skipBtn) {
            elements.skipBtn.addEventListener("click", useSkips);
        }

        if(elements.closeLeaderboardBtn) {
            elements.closeLeaderboardBtn.addEventListener('click', closeLeaderboard);
        }

        // This might be the problematic button, ensure it exists in your HTML
        if(elements.backBtn) {
            elements.backBtn.addEventListener("click", backToMenu);
        }
    }

    // Ensure this element exists in your HTML
    if(elements.gameModeSelection) {
        attachEventListeners();
    } else {
        console.error('Game mode selection element not found!');
    }

// Call attachEventListeners outside its definition
attachEventListeners();

    function selectGameMode(mode) {
    document.querySelectorAll(".game-section").forEach(el => el.style.display = "block");
    elements.gameModeSelection.style.display = "none";
    startGame(mode);
}

    function closeLeaderboard() {
        elements.leaderboardSection.style.display = 'none';
        elements.gameModeSelection.style.display = 'block';
    }

    function backToMenu() {
        elements.gameInterface.style.display = "none";
        elements.gameModeSelection.style.display = "block";
    }

  // Utility function to generate a random number based on the current level
  function generateNumber() {
        return Math.floor(Math.random() * (10 * gameState.level)) + 1;
    }

// Utility function to handle the double points power-up
function useDoublePoints() {
    if (gameState.doublePointsRemaining > 0) {
        gameState.doublePoints = true;
        gameState.doublePointsRemaining--;
        elements.doublePointsBtn.textContent = `Double Points (Remaining: ${gameState.doublePointsRemaining})`;
    }
}

function useSkips() {
 if (gameState.skipsRemaining > 0) {
            gameState.skips = true;
            gameState.skips--;
            gameState.skipsRemaining.textContent = gameState.skipsRemaining;
            elements.skipBtn.textContent = `Skips (Remaining: ${gameState.skipsRemaining})`;
        }
}
    
// Utility function to update the score multiplier
function updateMultiplier(isCorrect) {
    gameState.multiplier = isCorrect ? gameState.multiplier + 1 : 1;
}

// Utility function to update the score
function updateScore(isCorrect) {
    if (isCorrect) {
        gameState.score += 1 * gameState.multiplier * (gameState.doublePoints ? 2 : 1);
        gameState.doublePoints = false; // Reset double points after use
        updateScoreboard();
    }
}
  
    // Initialise the tutorial
    updateTutorial(gameState.currentTutorialStep);

    // Initial reset of the game
    resetGame();
    });
