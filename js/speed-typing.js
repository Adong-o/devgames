// Speed Typing Game Implementation

let currentLevel = 1;
let score = 0;
let timer;
let seconds = 0;
let startTime;
let errors = 0;
let totalTyped = 0;
let currentTextIndex = 0;
let isPlaying = false;

// Game levels with their respective challenges
const levels = [
    {
        text: 'The quick brown fox jumps over the lazy dog.',
        difficulty: 'Easy',
        wpmRequired: 20
    },
    {
        text: 'Programming is the art of telling another human what one wants the computer to do.',
        difficulty: 'Easy',
        wpmRequired: 30
    },
    {
        text: 'The best error message is the one that never shows up. The second best is the one that contains precise instructions for recovery.',
        difficulty: 'Medium',
        wpmRequired: 40
    },
    {
        text: 'Software and cathedrals are much the same – first we build them, then we pray. Measuring programming progress by lines of code is like measuring aircraft building progress by weight.',
        difficulty: 'Medium',
        wpmRequired: 50
    },
    {
        text: 'Any fool can write code that a computer can understand. Good programmers write code that humans can understand. Programming isn\'t about what you know; it\'s about what you can figure out.',
        difficulty: 'Hard',
        wpmRequired: 60
    }
];

// Initialize game instructions
gameInstructions.addStyles();
const instructionsPanel = gameInstructions.createPanel(
    'Speed Typing Instructions',
    [
        'Type the displayed text as quickly and accurately as possible',
        'Watch your WPM (Words Per Minute) and accuracy',
        'Meet the required WPM to advance to the next level',
        'Progress through increasingly challenging texts'
    ],
    [
        'Focus on accuracy first, speed will follow',
        'Take brief pauses between words',
        'Keep your fingers on the home row keys'
    ]
);

document.querySelector('.game-header').after(instructionsPanel);

function initializeLevel() {
    const level = levels[currentLevel - 1];
    document.getElementById('level').textContent = currentLevel;
    document.getElementById('score').textContent = score;

    const textDisplay = document.getElementById('textDisplay');
    textDisplay.innerHTML = level.text.split('').map(char => 
        `<span>${char}</span>`
    ).join('');

    // Reset metrics
    document.getElementById('wpm').textContent = '0';
    document.getElementById('accuracy').textContent = '100%';
    document.getElementById('progress').textContent = '0%';

    // Reset game state
    currentTextIndex = 0;
    errors = 0;
    totalTyped = 0;
    isPlaying = false;

    const typeInput = document.getElementById('typeInput');
    typeInput.value = '';
    typeInput.disabled = true;

    document.getElementById('startBtn').disabled = false;
    document.querySelector('.next-btn').disabled = true;

    highlightCurrentCharacter();
}

function startGame() {
    isPlaying = true;
    startTime = Date.now();
    document.getElementById('typeInput').disabled = false;
    document.getElementById('typeInput').focus();
    document.getElementById('startBtn').disabled = true;
}

function highlightCurrentCharacter() {
    const spans = document.querySelectorAll('#textDisplay span');
    spans.forEach(span => span.classList.remove('current', 'correct', 'incorrect'));
    
    for (let i = 0; i < currentTextIndex; i++) {
        spans[i].classList.add(spans[i].classList.contains('incorrect') ? 'incorrect' : 'correct');
    }
    
    if (currentTextIndex < spans.length) {
        spans[currentTextIndex].classList.add('current');
    }
}

function handleTyping(e) {
    if (!isPlaying) return;

    const level = levels[currentLevel - 1];
    const spans = document.querySelectorAll('#textDisplay span');
    const typed = e.target.value;
    const current = typed[typed.length - 1];

    if (current === level.text[currentTextIndex]) {
        spans[currentTextIndex].classList.add('correct');
    } else {
        spans[currentTextIndex].classList.add('incorrect');
        errors++;
    }

    currentTextIndex++;
    totalTyped++;

    // Update metrics
    const timeElapsed = (Date.now() - startTime) / 1000 / 60; // in minutes
    const wpm = Math.round((totalTyped / 5) / timeElapsed); // 5 characters = 1 word
    const accuracy = Math.round(((totalTyped - errors) / totalTyped) * 100);
    const progress = Math.round((currentTextIndex / level.text.length) * 100);

    document.getElementById('wpm').textContent = wpm;
    document.getElementById('accuracy').textContent = `${accuracy}%`;
    document.getElementById('progress').textContent = `${progress}%`;

    highlightCurrentCharacter();

    // Check if level is complete
    if (currentTextIndex === level.text.length) {
        levelComplete(wpm, accuracy);
    }
}

function levelComplete(wpm, accuracy) {
    isPlaying = false;
    const level = levels[currentLevel - 1];

    if (wpm >= level.wpmRequired) {
        // Calculate bonuses
        const speedBonus = Math.max(wpm - level.wpmRequired, 0);
        const accuracyBonus = Math.max(accuracy - 90, 0);
        const difficultyMultiplier = level.difficulty === 'Hard' ? 3 : 
                                   level.difficulty === 'Medium' ? 2 : 1;

        const levelScore = (100 * difficultyMultiplier) + 
                         (speedBonus * 5 * difficultyMultiplier) + 
                         (accuracyBonus * 10 * difficultyMultiplier);
        score += levelScore;

        if (currentLevel === levels.length) {
            celebrations.showAdvancedSuccess();
            setTimeout(() => celebrations.showMessage(
                `🏆 Amazing! You've completed all levels!\nWPM: ${wpm}\nAccuracy: ${accuracy}%\nScore: +${levelScore}`, 
                5000
            ), 1500);
        } else {
            celebrations.showBeginnerSuccess();
            document.querySelector('.next-btn').disabled = false;
            celebrations.showMessage(
                `🌟 Level Complete!\nWPM: ${wpm}\nAccuracy: ${accuracy}%\nScore: +${levelScore}`, 
                3000
            );
        }
    } else {
        celebrations.showMessage(
            `Almost there! You need ${level.wpmRequired} WPM to advance.\nTry again! 🤔`, 
            3000
        );
        setTimeout(initializeLevel, 3000);
    }
}

function nextLevel() {
    if (currentLevel < levels.length) {
        currentLevel++;
        document.querySelector('.next-btn').disabled = true;
        initializeLevel();
    }
}

function startTimer() {
    timer = setInterval(() => {
        seconds++;
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        document.getElementById('time').textContent = 
            `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }, 1000);
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    initializeLevel();
    startTimer();
    document.getElementById('startBtn').addEventListener('click', startGame);
    document.getElementById('typeInput').addEventListener('input', handleTyping);
});