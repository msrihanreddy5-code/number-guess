// ================================
// GAME VARIABLES
// ================================
let secretNumber, min, max, attempts, maxAttempts, hintUsed;
let bestScores = { easy: null, medium: null, hard: null };

// ================================
// DOM ELEMENTS
// ================================
const message = document.getElementById('message');
const hint = document.getElementById('hint');
const guessInput = document.getElementById('guess');
const submitBtn = document.getElementById('submit');
const restartBtn = document.getElementById('restart');
const attemptsDisplay = document.getElementById('attempts');
const bestScoreDisplay = document.getElementById('bestScore');
const difficultySelect = document.getElementById('difficulty');
const hintBtn = document.getElementById('hintBtn');

// ================================
// INITIALIZE GAME
// ================================
function initGame() {
    const difficulty = difficultySelect.value;

    if (difficulty === 'easy') {
        min = 1; max = 50; maxAttempts = 10;
    } else if (difficulty === 'medium') {
        min = 1; max = 100; maxAttempts = 7;
    } else {
        min = 1; max = 200; maxAttempts = 5;
    }

    secretNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    attempts = 0;
    hintUsed = false;

    guessInput.value = "";
    guessInput.disabled = false;
    submitBtn.disabled = false;

    message.textContent = "";
    hint.textContent = "";
    attemptsDisplay.textContent = "";
    bestScoreDisplay.textContent = bestScores[difficulty]
        ? `Best Score: ${bestScores[difficulty]} attempts`
        : "";

    guessInput.focus();
}

// ================================
// HANDLE GUESSES
// ================================
submitBtn.onclick = handleGuess;

function handleGuess() {
    const inputVal = guessInput.value.trim().toLowerCase();

    // typed hint functionality
    if (["hint", "help", "give hint", "clue"].includes(inputVal)) {
        giveHint();
        guessInput.value = "";
        return;
    }

    let guess = Number(guessInput.value);

    if (!guess || guess < min || guess > max) {
        message.textContent = `Enter a number between ${min} and ${max}.`;
        message.style.color = "red";
        return;
    }

    attempts++;

    if (guess === secretNumber) {
        message.textContent = `🎉 You Win! You guessed it in ${attempts} attempts.`;
        message.style.color = "green";

        const difficulty = difficultySelect.value;
        if (!bestScores[difficulty] || attempts < bestScores[difficulty]) {
            bestScores[difficulty] = attempts;
        }

        bestScoreDisplay.textContent = `Best Score: ${bestScores[difficulty]} attempts`;

        guessInput.disabled = true;
        submitBtn.disabled = true;
        hint.textContent = "";
    }

    else if (attempts >= maxAttempts) {
        message.textContent = `❌ You Lose! Number was ${secretNumber}.`;
        message.style.color = "red";

        guessInput.disabled = true;
        submitBtn.disabled = true;
        hint.textContent = "";
    }

    else {
        if (guess < secretNumber) {
            min = guess + 1;
            message.textContent = "Too low! Try again.";
        } else {
            max = guess - 1;
            message.textContent = "Too high! Try again.";
        }

        message.style.color = "orange";
        hint.textContent = `Range Hint: Between ${min}–${max}`;
    }

    attemptsDisplay.textContent = `Attempts: ${attempts} / ${maxAttempts}`;
    guessInput.value = "";
    guessInput.focus();
}

// ================================
// HINT SYSTEM
// ================================
function giveHint() {
    if (hintUsed) {
        alert("Hint already used!");
        return;
    }

    const guess = Number(guessInput.value);
    if (!guess) {
        alert("Enter a number first!");
        return;
    }

    const diff = Math.abs(secretNumber - guess);
    hint.textContent = diff <= 5 ? "🔥 Very close!" : "❄️ Not close!";
    hintUsed = true;
}

hintBtn.onclick = giveHint;

// ================================
// RESTART + DIFFICULTY CHANGE
// ================================
restartBtn.onclick = initGame;
difficultySelect.onchange = initGame;

// Start game
initGame();
