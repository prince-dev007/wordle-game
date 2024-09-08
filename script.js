const possibleWords = ['apple', 'brave', 'crane', 'dough', 'eagle']; // List of possible words
const targetWord = possibleWords[Math.floor(Math.random() * possibleWords.length)]; // Random target word

const gameBoard = document.getElementById('game-board');
const guessInput = document.getElementById('guess-input');
const submitBtn = document.getElementById('submit-btn');
const message = document.getElementById('message');

function createBoard() {
    for (let i = 0; i < 6; i++) { // 6 rows for 6 guesses
        for (let j = 0; j < 5; j++) { // 5 columns for 5 letters
            const cell = document.createElement('div');
            cell.classList.add('cell');
            gameBoard.appendChild(cell);
        }
    }
}

function checkGuess(guess) {
    const cells = gameBoard.querySelectorAll('.cell');
    const targetWordArray = targetWord.split('');
    const guessArray = guess.split('');
    let index = 0;

    for (let i = 0; i < 5; i++) {
        if (guessArray[i] === targetWordArray[i]) {
            cells[index].classList.add('correct');
        } else if (targetWordArray.includes(guessArray[i])) {
            cells[index].classList.add('present');
        } else {
            cells[index].classList.add('absent');
        }
        cells[index].textContent = guessArray[i];
        index++;
    }
}

function handleSubmit() {
    const guess = guessInput.value.toLowerCase();
    if (guess.length !== 5 || !possibleWords.includes(guess)) {
        message.textContent = 'Invalid word. Try again.';
        return;
    }
    checkGuess(guess);
    guessInput.value = '';
    // Additional game logic (e.g., end game if correct guess or number of attempts) can be added here
}

createBoard();
submitBtn.addEventListener('click', handleSubmit);
