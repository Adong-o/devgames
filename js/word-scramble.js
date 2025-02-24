// Word Scramble Game Implementation

let score = 0;
let timer;
let seconds = 60;
let currentWord;
let currentScrambled;

// Programming-related word list
const words = [
    { word: 'function', hint: 'A reusable block of code' },
    { word: 'variable', hint: 'Container for storing data' },
    { word: 'array', hint: 'Ordered collection of items' },
    { word: 'object', hint: 'Collection of key-value pairs' },
    { word: 'string', hint: 'Text data type' },
    { word: 'boolean', hint: 'True or false' },
    { word: 'loop', hint: 'Repeats code execution' },
    { word: 'class', hint: 'Blueprint for creating objects' },
    { word: 'method', hint: 'Function inside an object' },
    { word: 'promise', hint: 'Handles asynchronous operations' }
];

// Initialize game instructions
gameInstructions.addStyles();
const instructionsPanel = gameInstructions.createPanel(
    'Word Scramble Instructions',
    [
        'Unscramble the programming-related word',
        'Type your answer in the input field',
        'Use the hint if you need help',
        'Press Enter or click Submit to check your answer'
    ],
    [
        'Look for common programming terms',
        'The hint describes the word\'s meaning',
        'Pay attention to word length'
    ]
);

document.querySelector('.game-header').after(instructionsPanel);

function scrambleWord(word) {
    const arr = word.split('');
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr.join('');
}

let usedWords = [];

function selectNewWord() {
    if (usedWords.length === words.length) {
        usedWords = [];
    }
    
    let availableWords = words.filter(word => !usedWords.includes(word.word));
    const wordObj = availableWords[Math.floor(Math.random() * availableWords.length)];
    usedWords.push(wordObj.word);
    currentWord = wordObj.word;
    do {
        currentScrambled = scrambleWord(currentWord);
    } while (currentScrambled === currentWord);

    document.getElementById('scrambled-word').textContent = currentScrambled;
    document.getElementById('hint').textContent = wordObj.hint;
    document.getElementById('answer').value = '';
    document.getElementById('answer').focus();
}

function checkAnswer() {
    const userAnswer = document.getElementById('answer').value.toLowerCase();
    
    if (userAnswer === currentWord) {
        score += 10;
        document.getElementById('score').textContent = score;
        celebrations.showBeginnerSuccess();
        selectNewWord();
    } else {
        celebrations.showMessage('Try again! 🤔', 1000);
    }
}

function startTimer() {
    if (!timer) {
        timer = setInterval(() => {
            seconds--;
            document.getElementById('time').textContent = seconds;
            
            if (seconds <= 0) {
                endGame();
            }
        }, 1000);
    }
}

function endGame() {
    clearInterval(timer);
    const message = `Game Over! 🎮\nFinal Score: ${score}`;
    if (score >= 50) {
        celebrations.showAdvancedSuccess();
    }
    setTimeout(() => celebrations.showMessage(message, 5000), 1000);
    document.getElementById('answer').disabled = true;
    document.getElementById('submit-btn').disabled = true;
}

function restartGame() {
    score = 0;
    seconds = 60;
    clearInterval(timer);
    timer = null;
    document.getElementById('score').textContent = '0';
    document.getElementById('time').textContent = '60';
    document.getElementById('answer').disabled = false;
    document.getElementById('submit-btn').disabled = false;
    selectNewWord();
    startTimer();
    seconds = 60;
    document.getElementById('score').textContent = '0';
    document.getElementById('time').textContent = '60';
    document.getElementById('answer').disabled = false;
    document.getElementById('submit-btn').disabled = false;
    clearInterval(timer);
    startTimer();
    selectNewWord();
}

// Event listeners
document.getElementById('answer').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        checkAnswer();
    }
});

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    selectNewWord();
    startTimer();
});