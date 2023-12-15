const gameChoices = ['rock', 'paper', 'scissors'];
const gameImages = document.querySelectorAll('.choice');
const resultDiv = document.getElementById('result');
const userScoreSpan = document.getElementById('user-score');
const computerScoreSpan = document.getElementById('computer-score');
const countdownDiv = document.getElementById('countdown');
const gameModeButtons = document.querySelectorAll('.game-mode');
const historyList = document.getElementById('history-list');
let userScore = 0;
let computerScore = 0;
let gameHistory = [];
let currentGameMode = 'continuous'; // Default game mode
let gameTimer;
let countdown = 60; // 60 seconds for the timed game


const choiceToImageSrc = {
    rock: 'resources/rock.png',
    paper: 'resources/paper.png',
    scissors: 'resources/scissor.png'
};

function getImageSrcForChoice(choice) {
    return choiceToImageSrc[choice];
}

function updateScoreboard() {
    userScoreSpan.textContent = userScore;
    computerScoreSpan.textContent = computerScore;
}

function addGameResultToHistory(result) {
    const historyEntry = document.createElement('li');
    historyEntry.textContent = result;
    historyList.appendChild(historyEntry);
}

function clearGameHistory() {
    gameHistory = [];
    historyList.innerHTML = '';
}

function showModal(message) {
    document.getElementById("modal-message").textContent = message;
    document.getElementById("modal").style.display = "block";
}

function closeModal() {
    document.getElementById("modal").style.display = "none";
}

function updateCountdown() {
    const minutes = Math.floor(countdown / 60);
    const seconds = countdown % 60;
    countdownDiv.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    countdown--;
    if (countdown < 0) {
        endTimedGame();
    }
}

function startTimedGame() {
    countdown = 60; // Reset countdown for timed game
    updateCountdown();
    gameTimer = setInterval(updateCountdown, 1000);
    countdownDiv.style.display = 'block'; // Make sure to display the countdown
}

function endTimedGame() {
    clearInterval(gameTimer);
    let finalResult = `Time's up! User Score: ${userScore}, Computer Score: ${computerScore}`;
    showModal(finalResult);
    resetScores();
    countdownDiv.style.display = 'none'; // Hide the countdown after the game ends
}

function endBestOfThree() {
    let finalResult = userScore === 2 ? 'You win the best of three!' : 'Computer wins the best of three!';
    showModal(finalResult);
    resetScores();
}

function resetScores() {
    userScore = 0;
    computerScore = 0;
    updateScoreboard();
}

function determineWinner(userChoice, computerChoice) {
    if (userChoice === computerChoice) {
        return 'It\'s a tie! 🤝';
    }
    const rules = {
        rock: 'scissors',
        paper: 'rock',
        scissors: 'paper'
    };
    if (rules[userChoice] === computerChoice) {
        userScore++;
        return 'You win! 👏';
    } else {
        computerScore++;
        return 'You lose 😔';
    }
}

function playRound(userChoice, computerChoice) {
    const winner = determineWinner(userChoice, computerChoice);
    updateScoreboard();
    resultDiv.textContent = winner;
    addGameResultToHistory(winner);

    if (currentGameMode === 'best-of-three' && (userScore === 2 || computerScore === 2)) {
        endBestOfThree();
    }
}

gameModeButtons.forEach(button => {
    button.addEventListener('click', function() {
        selectGameMode(this.id);
    });
});

function selectGameMode(mode) {
    currentGameMode = mode;
    resetScores();
    clearGameHistory();
    document.getElementById("current-game-mode").textContent = mode.replace(/-/g, ' '); // Replaces hyphens with spaces
  
    // Update the game mode display
    const gameModeIndicator = document.getElementById("game-mode-indicator");
    gameModeIndicator.classList.remove('active'); // Reset any previous active states
    if (mode !== 'continuous') {
      gameModeIndicator.classList.add('active');
    }
  
    if (mode === 'timed') {
      startTimedGame();
      countdownDiv.style.display = 'block';
    } else {
      countdownDiv.style.display = 'none';
    }
  }

gameImages.forEach(image => {
    image.addEventListener('click', function() {
        if (currentGameMode !== 'timed' || countdown > 0) {
            playRound(this.id, gameChoices[Math.floor(Math.random() * gameChoices.length)]);
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    document.querySelector(".close-button").addEventListener("click", closeModal);
});
