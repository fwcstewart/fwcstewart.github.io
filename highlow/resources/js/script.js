document.addEventListener('DOMContentLoaded', () => {
    // DOM elements
    const currentNumberDisplay = document.getElementById("currentNumber");
    const nextNumberDisplay = document.getElementById("nextNumber");
    const higherBtn = document.getElementById("higherBtn");
    const lowerBtn = document.getElementById("lowerBtn");
    const scoreDisplay = document.getElementById("score");
    const streakDisplay = document.getElementById("streak");
    const levelDisplay = document.getElementById("level");
    const timeLeftDisplay = document.getElementById("timeLeft");
    const gameModeButtons = document.querySelectorAll(".mode-btn");
    const doublePointsBtn = document.getElementById("doublePointsBtn");
    const feedbackElement = document.getElementById('feedback');
    const tutorialModal = document.getElementById('tutorialModal');
    const tutorialText = document.getElementById('tutorialText');

    // Game variables
    let currentNumber, nextNumber, score = 0, streak = 0, level = 1, gameTime = 60, timer;
    let gameMode = "classic"; // default game mode
    let doublePoints = false;
    let doublePointsRemaining = 1; // Start with one double point power-up
    let skipsRemaining = 1; // Number of skips available to the player
    let multiplier = 1;
    let currentTutorialStep = 0;

    // Update tutorial
    function updateTutorial(step) {
        tutorialModal.style.display = 'block';

        switch (step) {
            case 0:
                tutorialText.innerText = "This is the game area. Here you'll see the current number and make your guesses.";
                // Position the modal near the game area
                break;
            case 1:
                tutorialText.innerText = "Click 'Higher' or 'Lower' to make your guess based on whether you think the next number will be higher or lower.";
                // Position the modal near the buttons
                break;
            case 2:
                tutorialText.innerText = "Your score and level are shown here. Your score increases with each correct guess.";
                // Position the modal near the score display
                break;
            case 3:
                tutorialText.innerText = "Use power-ups like 'Skip' or 'Double Points' to help you advance in the game.";
                // Position the modal near the power-ups
                break;
            default:
                tutorialModal.style.display = 'none';
                return;
        }
    }

    // Event listeners for tutorial
    document.getElementById('nextTutorialStep').addEventListener('click', function() {
        currentTutorialStep++;
        updateTutorial(currentTutorialStep);
    });

    document.getElementById('startTutorialBtn').addEventListener('click', function() {
        tutorialModal.style.display = 'none';
        currentTutorialStep = 0;
        updateTutorial(currentTutorialStep);
    });

    document.getElementById('skipTutorialBtn').addEventListener('click', function() {
        tutorialModal.style.display = 'none';
    });

    // Double Points Button
    if (doublePointsBtn) {
        doublePointsBtn.addEventListener("click", useDoublePoints);
    } else {
        console.error('Double Points button not found!');
    }

    // Use Skip Power-Up
    function useSkip() {
        if (skipsRemaining > 0) {
            skipsRemaining--;
            document.getElementById('skipsRemaining').textContent = skipsRemaining;
            updateGame();
        }
    }

    // Update Scoreboard
    function updateScoreboard() {
        scoreDisplay.textContent = score;
        streakDisplay.textContent = streak;
        levelDisplay.textContent = level;
    }

    // Use Double Points Power-Up
    function useDoublePoints() {
        if (doublePointsRemaining > 0) {
            doublePoints = true;
            doublePointsRemaining--;
            doublePointsBtn.textContent = `Double Points (Remaining: ${doublePointsRemaining})`;
        }
    }

    // Update Multiplier
    function updateMultiplier(isCorrect) {
        multiplier = isCorrect ? multiplier + 1 : 1;
    }

    // Update Score
    function updateScore(isCorrect) {
        if (isCorrect) {
            score += 1 * multiplier * (doublePoints ? 2 : 1);
            doublePoints = false; // Reset double points after use
            if (doublePoints) {
                showFeedback(true, 'Double Points Applied!');
            }
            updateScoreboard();
        }
    }

    // Update Leaderboard
    function updateLeaderboard(entry) {
        const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
        leaderboard.push(entry);
        leaderboard.sort((a, b) => b.score - a.score);
        localStorage.setItem('leaderboard', JSON.stringify(leaderboard.slice(0, 3)));
    }

    // Show Leaderboard
function showLeaderboard() {
    const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
    const leaderboardList = document.getElementById('leaderboard-list');
    leaderboardList.innerHTML = '';
    leaderboard.forEach(entry => {
        const listItem = document.createElement('li');
        listItem.textContent = `${entry.name}: ${entry.score}`;
        leaderboardList.appendChild(listItem);
    });
    document.getElementById('leaderboard-section').style.display = 'block';
    // Hide game interface and mode selection
    document.getElementById('game-interface').style.display = 'none';
    document.getElementById('game-mode-selection').style.display = 'none';
}

// Close Leaderboard and Return to Start Screen
document.getElementById('closeLeaderboardBtn').addEventListener('click', function() {
    document.getElementById('leaderboard-section').style.display = 'none';
    // Show the game mode selection screen when closing the leaderboard
    document.getElementById('game-mode-selection').style.display = 'block';
}

    // Generate Random Number
    function generateNumber() {
        return Math.floor(Math.random() * (10 * level)) + 1;
    }

    // Update Game
    function updateGame() {
        currentNumber = generateNumber();
        nextNumber = generateNumber();
        currentNumberDisplay.textContent = currentNumber;
        nextNumberDisplay.textContent = "?";
        scoreDisplay.textContent = score;
        streakDisplay.textContent = streak;
        levelDisplay.textContent = level;
        timeLeftDisplay.textContent = gameTime;
        document.getElementById('skipsRemaining').textContent = skipsRemaining;
    }

    // Handle Guess
    function handleGuess(isHigher) {
        const isCorrect = (isHigher && nextNumber > currentNumber) || (!isHigher && nextNumber < currentNumber);
        showFeedback(isCorrect);
        nextNumberDisplay.textContent = nextNumber;
        updateMultiplier(isCorrect);
        updateScore(isCorrect);
        if (isCorrect) {
            streak++;
            level = Math.floor(score / 10) + 1;
        } else {
            if (gameMode === "suddenDeath") {
                alert("Wrong guess. Game over!");
                gameOver();
                return;
            }
            streak = 0;
        }
        setTimeout(updateGame, 2000);
    }

    // Start Timer
    function startTimer() {
        timer = setInterval(() => {
            gameTime--;
            timeLeftDisplay.textContent = gameTime;
            if (gameTime <= 0) {
                clearInterval(timer);
                gameOver();
            }
        }, 1000);
    }

    // Start Game
    function startGame(selectedMode) {
        gameMode = selectedMode;
        score = 0;
        streak = 0;
        level = 1;
        gameTime = (selectedMode === "timeTrial") ? 60 : null;

        updateGame();
        if (selectedMode === "timeTrial") {
            startTimer();
        }
    }

    // Reset Game
    function resetGame() {
        clearInterval(timer);
        document.querySelectorAll(".game-section").forEach(el => el.style.display = "none");
        document.getElementById("game-mode-selection").style.display = "block";
    }

    // Game Over
    function gameOver() {
        let playerName = prompt("Game over! Enter your name for the leaderboard:", "Player");
        if (playerName) {
            const entry = { name: playerName, score: score };
            updateLeaderboard(entry);
        }
        resetGame();
    }

    // Event Listeners
    higherBtn.addEventListener("click", () => handleGuess(true));
    lowerBtn.addEventListener("click", () => handleGuess(false));
    gameModeButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const mode = btn.getAttribute("data-mode");
            document.querySelectorAll(".game-section").forEach(el => el.style.display = "block");
            document.getElementById("game-mode-selection").style.display = "none";
            startGame(mode);
        });
    });

    document.getElementById("backBtn").addEventListener("click", () => {
        document.getElementById("game-interface").style.display = "none";
        document.getElementById("game-mode-selection").style.display = "block";
    });

    document.getElementById('showLeaderboardBtn').addEventListener('click', showLeaderboard);
    document.getElementById('closeLeaderboardBtn').addEventListener('click', () => {
        document.getElementById('leaderboard-section').style.display = 'none';
    });

    // Initialize the game
    resetGame();
});
