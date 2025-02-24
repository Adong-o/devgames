// Memory Game Implementation

// Initialize game state
let symbols = [];
let flippedCards = [];
let matchedPairs = 0;
let moves = 0;
let gameStarted = false;
let timer;
let seconds = 0;
let currentLevel = 1;
let score = 0;
let highScore = localStorage.getItem('memoryGameHighScore') || 0;

// Ensure symbols are loaded
function loadSymbols() {
    if (window.symbols && window.symbols.length > 0) {
        symbols = window.symbols;
    } else {
        symbols = [
            '{ }', '[ ]', '( )', '=>', '&&', '||', '!=', '==',
            '++', '--', '+=', '-=', '*=', '/=', '**', '%%'
        ];
    }
}
let achievements = JSON.parse(localStorage.getItem('memoryGameAchievements')) || {
    speedster: false,    // Complete level in under 30 seconds
    perfectMatch: false, // Complete with no mistakes
    masterMind: false,   // Complete all levels
    dailyStreak: false,  // Complete daily challenge 3 days in a row
    symbolMaster: false, // Match all special symbols in level 3
    timeWizard: false    // Complete all levels in under 3 minutes total
};

// Daily challenge system
let dailyChallenge = {
    lastPlayed: localStorage.getItem('memoryGameLastPlayed') || '',
    streak: parseInt(localStorage.getItem('memoryGameStreak')) || 0,
    today: new Date().toDateString()
};

function updateDailyChallenge() {
    if (dailyChallenge.lastPlayed !== dailyChallenge.today) {
        if (new Date(dailyChallenge.lastPlayed).getTime() + 86400000 < new Date().getTime()) {
            dailyChallenge.streak = 0;
        }
        dailyChallenge.streak++;
        dailyChallenge.lastPlayed = dailyChallenge.today;
        localStorage.setItem('memoryGameLastPlayed', dailyChallenge.lastPlayed);
        localStorage.setItem('memoryGameStreak', dailyChallenge.streak);
        
        if (dailyChallenge.streak >= 3 && !achievements.dailyStreak) {
            achievements.dailyStreak = true;
            celebrations.showMessage('🌟 Achievement Unlocked: Daily Dedication!', 3000);
        }
    }
}

function updateScore(matched) {
    const timeBonus = Math.max(100 - seconds, 0);
    const movesPenalty = Math.max(20 - moves, 0);
    const points = matched ? (100 + timeBonus + movesPenalty * 5) : 0;
    score += points;
    document.getElementById('score').textContent = score;
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('memoryGameHighScore', highScore);
        document.getElementById('highScore').textContent = highScore;
    }
}

function checkAchievements() {
    if (seconds < 30 && !achievements.speedster) {
        achievements.speedster = true;
        celebrations.showMessage('🏃 Achievement Unlocked: Speedster!', 3000);
    }
    if (moves === matchedPairs * 2 && !achievements.perfectMatch) {
        achievements.perfectMatch = true;
        celebrations.showMessage('🎯 Achievement Unlocked: Perfect Match!', 3000);
    }
    if (currentLevel === 3 && !achievements.masterMind) {
        achievements.masterMind = true;
        celebrations.showMessage('🧠 Achievement Unlocked: Master Mind!', 3000);
    }
    if (currentLevel === 3 && matchedPairs === levelSymbols.length / 2 && !achievements.symbolMaster) {
        achievements.symbolMaster = true;
        celebrations.showMessage('🎭 Achievement Unlocked: Symbol Master!', 3000);
    }
    if (currentLevel === 3 && seconds < 180 && !achievements.timeWizard) {
        achievements.timeWizard = true;
        celebrations.showMessage('⚡ Achievement Unlocked: Time Wizard!', 3000);
    }
    updateDailyChallenge();
    localStorage.setItem('memoryGameAchievements', JSON.stringify(achievements));
}

function nextLevel() {
    currentLevel++;
    if (currentLevel <= 3) {
        document.getElementById('level').textContent = currentLevel;
        restartGame();
        celebrations.showMessage(`Level ${currentLevel} - Get Ready!`, 2000);
    } else {
        celebrations.showMessage('🏆 Congratulations! You\'ve mastered all levels!', 5000);
    }
}

// Initialize game instructions
gameInstructions.addStyles();
const instructionsPanel = gameInstructions.createPanel(
    'Memory Game Instructions',
    [
        'Click on any card to reveal its symbol',
        'Find matching pairs of programming symbols',
        'Match all pairs to win the game',
        'Try to complete with fewer moves for a better score'
    ],
    [
        'Remember the positions of symbols you\'ve seen',
        'Take your time - accuracy is better than speed',

        'Look for patterns in the symbol placement'
    ]
);

document.querySelector('.game-header').after(instructionsPanel);

async function initializeGame() {
    const gameGrid = document.getElementById('gameGrid');
    let levelSymbols = getSymbols(currentLevel);
    
    // Add more symbols for higher levels
    if (currentLevel >= 2) {
        levelSymbols = levelSymbols.concat(getSymbols(2));
    }
    if (currentLevel === 3) {
        levelSymbols = levelSymbols.concat(getSymbols(3));
    }
    
    const shuffledSymbols = shuffleArray(levelSymbols);
    gameGrid.innerHTML = '';
    
    // Adjust grid size based on level
    gameGrid.style.gridTemplateColumns = `repeat(${currentLevel <= 1 ? 4 : currentLevel <= 2 ? 5 : 6}, 1fr)`;
    
    // Preload background images for cards
    try {
        const backgroundImages = await imageUtils.preloadImages(
            ['programming', 'code', 'technology'],
            200,
            300
        );

    shuffledSymbols.forEach((symbol, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.index = index;
        card.innerHTML = `
            <div class="card-front">?</div>
            <div class="card-back">${symbol}</div>
        `;
        card.addEventListener('click', () => flipCard(card));
        gameGrid.appendChild(card);
    });

    // Update pairs count display
    document.getElementById('pairs').textContent = `0/${shuffledSymbols.length / 2}`;
    
    // Reset game state
    flippedCards = [];
    matchedPairs = 0;
    moves = 0;
    seconds = 0;
    gameStarted = false;
    document.getElementById('moves').textContent = '0';
    document.getElementById('time').textContent = '0:00';
    document.getElementById('score').textContent = score;
    document.getElementById('highScore').textContent = highScore;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function flipCard(card) {
    if (
        flippedCards.length === 2 ||
        flippedCards.includes(card) ||
        card.classList.contains('matched')
    ) return;

    if (!gameStarted) {
        startTimer();
        gameStarted = true;
    }

    card.classList.add('flipped');
    flippedCards.push(card);

    if (flippedCards.length === 2) {
        moves++;
        document.getElementById('moves').textContent = moves;
        checkMatch();
    }
}

function checkMatch() {
    const [card1, card2] = flippedCards;
    const symbol1 = card1.querySelector('.card-back').textContent;
    const symbol2 = card2.querySelector('.card-back').textContent;

    if (symbol1 === symbol2) {
        matchedPairs++;
        document.getElementById('pairs').textContent = `${matchedPairs}/${levelSymbols.length / 2}`;
        card1.classList.add('matched');
        card2.classList.add('matched');
        flippedCards = [];
        updateScore(true);

        if (matchedPairs === levelSymbols.length / 2) {
            endGame();
        } else {
            celebrations.showBeginnerSuccess();
        }
    } else {
        updateScore(false);
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            flippedCards = [];
        }, 1000);
    }
}

function endGame() {
    clearInterval(timer);
    const timeStr = document.getElementById('time').textContent;
    checkAchievements();
    const message = `Level ${currentLevel} Complete! 🎉\nScore: ${score}\nMoves: ${moves}\nTime: ${timeStr}\nPairs Found: ${matchedPairs}/${symbols.length}\nAccuracy: ${Math.round((matchedPairs * 2 / moves) * 100)}%`;
    if (moves < 20) {
        celebrations.showAdvancedSuccess();
        setTimeout(() => {
            if (currentLevel < 3) {
                if (confirm('Ready for the next level?')) {
                    nextLevel();
                }
            }
        }, 2000);
    } else {
        celebrations.showBeginnerSuccess();
    }
    setTimeout(() => celebrations.showMessage(message, 5000), 1500);
}

function startTimer() {
    if (!timer) {
        timer = setInterval(() => {
            seconds++;
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = seconds % 60;
            document.getElementById('time').textContent = 
                `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
        }, 1000);
    }
}

function restartGame() {
    flippedCards = [];
    matchedPairs = 0;
    moves = 0;
    seconds = 0;
    gameStarted = false;
    clearInterval(timer);
    timer = null;
    
    document.getElementById('moves').textContent = '0';
    document.getElementById('pairs').textContent = '0';
    document.getElementById('time').textContent = '0:00';
    
    initializeGame();
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    try {
        loadSymbols();
        initializeGame();
    } catch (error) {
        console.error('Error initializing game:', error);
        celebrations.showMessage('Failed to initialize game. Please refresh the page.', 3000);
    }
});