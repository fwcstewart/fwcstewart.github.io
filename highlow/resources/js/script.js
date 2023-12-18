document.addEventListener('DOMContentLoaded', () => {
    const currentNumberDisplay = document.getElementById("currentNumber");
    const nextNumberDisplay = document.getElementById("nextNumber");
    const higherBtn = document.getElementById("higherBtn");
    const lowerBtn = document.getElementById("lowerBtn");
    const scoreDisplay = document.getElementById("score");
    const streakDisplay = document.getElementById("streak");
    const levelDisplay = document.getElementById("level");
    const timeLeftDisplay = document.getElementById("timeLeft");
    const gameModeButtons = document.querySelectorAll(".mode-btn");

    let currentNumber, nextNumber, score = 0, streak = 0, level = 1, gameTime = 60, timer;
    let gameMode = "classic"; // default game mode
    let doublePoints = false;
    let doublePointsRemaining = 1; // Start with one double point power-up
    let skipsRemaining = 1; // Number of skips available to the player
    let multiplier = 1;

    // Attaching event listener for doublePointsBtn within JavaScript instead of HTML
    const doublePointsBtn = document.getElementById("doublePointsBtn");
    if (doublePointsBtn) {
    doublePointsBtn.addEventListener("click", useDoublePoints);
    } else {
    console.error('Double Points button not found!');
    }

      function useSkip() {
        if (skipsRemaining > 0) {
            skipsRemaining--;
            document.getElementById('skipsRemaining').textContent = skipsRemaining; // Update skips remaining in the UI
            updateGame();
        }
    }

    function updateScoreboard() {
    // Updating the scoreboard with the current game values
    scoreDisplay.textContent = score;
    streakDisplay.textContent = streak;
    levelDisplay.textContent = level;

    // Example of adding an animation or visual feedback
    const scoreboard = document.getElementById('scoreboard');
    if (scoreboard) {
        scoreboard.classList.add('highlight-score');
        setTimeout(() => {
            scoreboard.classList.remove('highlight-score');
        }, 500);
    }
    }

    function useDoublePoints() {
        if (doublePointsRemaining > 0) {
            doublePoints = true;
            doublePointsRemaining--; // Consume the power-up
            document.getElementById('doublePointsBtn').textContent = `Double Points (Remaining: ${doublePointsRemaining})`;
        }
    }

    function updateMultiplier(isCorrect) {
        if (isCorrect) {
            multiplier++;
        } else {
            multiplier = 1; // Reset on incorrect guess
        }
    }

    function updateScore(isCorrect) {
        if (isCorrect) {
            score += 1 * multiplier * (doublePoints ? 2 : 1);
            if (doublePoints) {
                doublePoints = false; // Reset double points after use
                showFeedback(true, 'Double Points Applied!'); // Show feedback with double points message
            }
            updateScoreboard(); // Update scoreboard display
        }
    }

    function updateLeaderboard(entry) {
        const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
        leaderboard.push(entry);
        leaderboard.sort((a, b) => b.score - a.score); // Ensure you sort by the score property
        localStorage.setItem('leaderboard', JSON.stringify(leaderboard.slice(0, 10))); // Keep top 10 entries
    }

     function showLeaderboard() {
        const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
        const leaderboardList = document.getElementById('leaderboard-list');
        leaderboardList.innerHTML = ''; // Clear existing leaderboard entries
        leaderboard.forEach((entry) => {
            const listItem = document.createElement('li');
            listItem.textContent = `${entry.name}: ${entry.score}`; // Display the name and score
            leaderboardList.appendChild(listItem);
        });
        document.getElementById('leaderboard-section').style.display = 'block';
        document.getElementById('game-interface').style.display = 'none';
        document.getElementById('game-mode-selection').style.display = 'none';
    }

    function showFeedback(isCorrect, message = '') {
        const feedbackElement = document.getElementById('feedback');
        feedbackElement.textContent = message || (isCorrect ? 'Correct!' : 'Wrong!');
        feedbackElement.style.color = isCorrect ? 'green' : 'red';
        setTimeout(() => {
            feedbackElement.textContent = '';
        }, 2000);
    }

    function generateNumber() {
        return Math.floor(Math.random() * (10 * level)) + 1;
    }

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

    function handleGuess(isHigher) {
        const isCorrect = (isHigher && nextNumber > currentNumber) || (!isHigher && nextNumber < currentNumber);
        showFeedback(isCorrect); // Show feedback
        nextNumberDisplay.textContent = nextNumber;
        updateMultiplier(isCorrect); // Update multiplier
        updateScore(isCorrect); // Update score with multiplier and double points
        if (isCorrect) {
            streak++;
            level = Math.floor(score / 10) + 1;
        } else {
            if (gameMode === "suddenDeath") {
                alert("Wrong guess. Game over!");
                gameOver();
                return;
            }
            streak = 0; // Reset streak in Classic and Time Trial mode
        }
        setTimeout(updateGame, 2000); // Delay for the next round
    }

      function startTimer() {
        timer = setInterval(() => {
            gameTime--;
            timeLeftDisplay.textContent = gameTime;
            if (gameTime <= 0) {
                clearInterval(timer);
                gameOver(); // Game over when the time is up
            }
        }, 1000);
    }

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

    function resetGame() {
        clearInterval(timer);
        document.querySelectorAll(".game-section").forEach(el => el.style.display = "none");
        document.getElementById("game-mode-selection").style.display = "block";
    }

    function gameOver() {
        let playerName = prompt("Game over! Enter your name for the leaderboard:", "Player");
        if (playerName) {
            const entry = { name: playerName, score: score };
            updateLeaderboard(entry); // Pass the entry object to updateLeaderboard
        }
        resetGame();
    }

    // Setup event listeners for higherBtn and lowerBtn
    higherBtn.addEventListener("click", () => handleGuess(true));
    lowerBtn.addEventListener("click", () => handleGuess(false));

    // Setup event listeners for game mode selection buttons
    gameModeButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const mode = btn.getAttribute("data-mode");
            document.querySelectorAll(".game-section").forEach(el => el.style.display = "block");
            document.getElementById("game-mode-selection").style.display = "none";
            startGame(mode);
        });
    });

    // Back button event listener
    
    document.getElementById("backBtn").addEventListener("click", () => {
        document.getElementById("game-interface").style.display = "none";
        document.getElementById("game-mode-selection").style.display = "block";
    });

    // Assuming 'showLeaderboardBtn' is the ID of your 'Show Leaderboard' button
    document.getElementById('showLeaderboardBtn').addEventListener('click', showLeaderboard);
    document.getElementById('closeLeaderboardBtn').addEventListener('click', function() {
    document.getElementById('leaderboard-section').style.display = 'none';
    // Show any sections you hid when opening the leaderboard
    }

    // Initialize the game
    resetGame();
});
