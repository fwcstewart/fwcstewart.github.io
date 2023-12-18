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
let skipsRemaining = 1; // Number of skips available to the player
let multiplier = 1;

function useSkip() {
    if (skipsRemaining > 0) {
        skipsRemaining--;
        updateGame();
    }
}

function useDoublePoints() {
    doublePoints = true;
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
        doublePoints = false; // Reset double points after use
    }
}

function updateLeaderboard(newScore) {
    const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
    leaderboard.push(newScore);
    leaderboard.sort((a, b) => b - a); // Sort in descending order
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard.slice(0, 10))); // Keep top 10 scores
}

function showLeaderboard() {
    const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
    alert("Leaderboard:\n" + leaderboard.join("\n"));
}

function showFeedback(isCorrect) {
    const feedbackElement = document.getElementById('feedback');
    feedbackElement.textContent = isCorrect ? 'Correct!' : 'Wrong!';
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
}

function handleGuess(isHigher) {
    const isCorrect = (isHigher && nextNumber > currentNumber) || (!isHigher && nextNumber < currentNumber);
    nextNumberDisplay.textContent = nextNumber;

    if (isCorrect) {
        score++;
        streak++;
        level = Math.floor(score / 10) + 1;
    } else {
        if (gameMode === "suddenDeath") {
            alert("Wrong guess. Game over!");
            resetGame();
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
            alert("Time's up! Your score: " + score);
            resetGame();
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

gameModeButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        const mode = btn.getAttribute("data-mode");
        document.querySelectorAll(".game-section").forEach(el => el.style.display = "block");
        document.getElementById("game-mode-selection").style.display = "none";
        startGame(mode);
    });
});

higherBtn.addEventListener("click", () => handleGuess(true));
lowerBtn.addEventListener("click", () => handleGuess(false));

document.getElementById("backBtn").addEventListener("click", function() {
    document.getElementById("game-interface").style.display = "none";
    document.getElementById("game-mode-selection").style.display = "block";
});

document.getElementById("startGameBtn").addEventListener("click", function() {
    document.getElementById("instructions").style.display = "none";
    document.getElementById("game-interface").style.display = "block";
    startGame("classic"); // Start in classic mode by default
});

// Improved transition for numbers
function revealNextNumber() {
    nextNumberDisplay.style.opacity = 0;
    setTimeout(() => {
        nextNumberDisplay.textContent = nextNumber;
        nextNumberDisplay.style.opacity = 1;
    }, 500);
}

function updateScoreboard() {
    // Animate scoreboard
    const scoreboard = document.getElementById('scoreboard');
    scoreboard.classList.remove('show');
    setTimeout(() => {
        // Update scores...
        scoreboard.classList.add('show');
    }, 300);
}

function flipCard() {
    const card = document.getElementById('current-card');
    card.classList.add('flipped');
    setTimeout(() => {
        // Update the number...
        card.classList.remove('flipped');
    }, 500);
}

// Initialize the game mode selection screen
resetGame();

// Initialize to instructions screen
document.getElementById("instructions").style.display = "block";
document.getElementById("game-interface").style.display = "none";
document.getElementById("game-mode-selection").style.display = "none";
