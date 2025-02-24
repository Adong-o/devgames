// Pattern Sequence Game Implementation

let currentLevel = 1;
let score = 0;
let timer;
let seconds = 0;
let sequence = [];
let playerSequence = [];
let isPlaying = false;
let isShowingPattern = false;

// Game levels with their respective challenges
const levels = [
    {
        sequenceLength: 3,
        speed: 1000,
        difficulty: 'Easy'
    },
    {
        sequenceLength: 4,
        speed: 800,
        difficulty: 'Easy'
    },
    {
        sequenceLength: 5,
        speed: 700,
        difficulty: 'Medium'
    },
    {
        sequenceLength: 6,
        speed: 600,
        difficulty: 'Medium'
    },
    {
        sequenceLength: 7,
        speed: 500,
        difficulty: 'Hard'
    }
];

// Initialize game instructions
gameInstructions.addStyles();
const instructionsPanel = gameInstructions.createPanel(
    'Pattern Sequence Instructions',
    [
        'Watch the pattern sequence carefully',
        'Repeat the pattern by clicking the cells in order',
        'Each level adds more steps to remember',
        'Progress through increasingly complex sequences'
    ],
    [
        'Focus on the pattern timing',
        'Try to create a rhythm in your mind',
        'Take your time when repeating the pattern'
    ]
);

document.querySelector('.game-header').after(instructionsPanel);

function initializeLevel() {
    const level = levels[currentLevel - 1];
    document.getElementById('level').textContent = currentLevel;
    document.getElementById('score').textContent = score;
    document.getElementById('sequenceLength').textContent = level.sequenceLength;

    // Create pattern grid
    const patternGrid = document.getElementById('patternGrid');
    patternGrid.innerHTML = '';

    for (let i = 0; i < 4; i++) {
        const cell = document.createElement('div');
        cell.className = `pattern-cell color-${i + 1}`;
        cell.dataset.index = i;
        cell.onclick = () => handleCellClick(i);
        patternGrid.appendChild(cell);
    }

    document.getElementById('startBtn').disabled = false;
    document.querySelector('.next-btn').disabled = true;
}

function startGame() {
    isPlaying = true;
    sequence = generateSequence();
    playerSequence = [];
    document.getElementById('startBtn').disabled = true;
    showPattern();
}

function generateSequence() {
    const level = levels[currentLevel - 1];
    const newSequence = [];
    for (let i = 0; i < level.sequenceLength; i++) {
        newSequence.push(Math.floor(Math.random() * 4));
    }
    return newSequence;
}

async function showPattern() {
    isShowingPattern = true;
    const level = levels[currentLevel - 1];
    const cells = document.querySelectorAll('.pattern-cell');

    for (const index of sequence) {
        cells[index].classList.add('active');
        await new Promise(resolve => setTimeout(resolve, level.speed));
        cells[index].classList.remove('active');
        await new Promise(resolve => setTimeout(resolve, level.speed / 2));
    }

    isShowingPattern = false;
}

function handleCellClick(index) {
    if (!isPlaying || isShowingPattern) return;

    const cells = document.querySelectorAll('.pattern-cell');
    cells[index].classList.add('active');
    setTimeout(() => cells[index].classList.remove('active'), 300);

    playerSequence.push(index);
    checkSequence();
}

function checkSequence() {
    const currentIndex = playerSequence.length - 1;
    
    if (playerSequence[currentIndex] !== sequence[currentIndex]) {
        gameOver();
        return;
    }

    if (playerSequence.length === sequence.length) {
        levelComplete();
    }
}

function gameOver() {
    isPlaying = false;
    celebrations.showMessage('Game Over! Try again! 😔', 3000);
    document.getElementById('startBtn').disabled = false;
    sequence = [];
    playerSequence = [];
}

function levelComplete() {
    isPlaying = false;
    const level = levels[currentLevel - 1];
    
    // Calculate bonuses
    const timeBonus = Math.max(300 - seconds, 0);
    const difficultyMultiplier = level.difficulty === 'Hard' ? 3 : 
                               level.difficulty === 'Medium' ? 2 : 1;
    const levelScore = (100 * difficultyMultiplier) + Math.floor(timeBonus * difficultyMultiplier / 2);
    score += levelScore;

    if (currentLevel === levels.length) {
        celebrations.showAdvancedSuccess();
        setTimeout(() => celebrations.showMessage(
            `🏆 Amazing! You've completed all levels!\nSequence Length: ${level.sequenceLength}\nTime Bonus: +${timeBonus}`, 
            5000
        ), 1500);
    } else {
        celebrations.showBeginnerSuccess();
        document.querySelector('.next-btn').disabled = false;
        celebrations.showMessage(
            `🌟 Level Complete!\nSequence Length: ${level.sequenceLength}\nTime Bonus: +${timeBonus}`, 
            3000
        );
    }
}

function gameOver() {
    isPlaying = false;
    celebrations.showMessage('Pattern incorrect! Try again! 🤔', 3000);
    setTimeout(() => {
        playerSequence = [];
        document.getElementById('startBtn').disabled = false;
    }, 1500);
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
});