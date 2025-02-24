// Color Guess Game Implementation

let currentLevel = 1;
let score = 0;
let timer;
let seconds = 0;
let targetColor = {};

// Game levels with their respective challenges
const levels = [
    {
        difficulty: 'Easy',
        tolerance: 30,
        description: 'Guess the RGB values with a tolerance of 30'
    },
    {
        difficulty: 'Easy',
        tolerance: 25,
        description: 'Guess the RGB values with a tolerance of 25'
    },
    {
        difficulty: 'Medium',
        tolerance: 20,
        description: 'Guess the RGB values with a tolerance of 20'
    },
    {
        difficulty: 'Medium',
        tolerance: 15,
        description: 'Guess the RGB values with a tolerance of 15'
    },
    {
        difficulty: 'Hard',
        tolerance: 10,
        description: 'Guess the RGB values with a tolerance of 10'
    }
];

// Initialize game instructions
gameInstructions.addStyles();
const instructionsPanel = gameInstructions.createPanel(
    'Color Guess Instructions',
    [
        'Observe the displayed color carefully',
        'Input your RGB value guesses (0-255)',
        'Check your guess and see how close you are',
        'Progress through increasingly precise challenges'
    ],
    [
        'Study how RGB values affect colors',
        'Red, Green, and Blue combine to create colors',
        'Practice identifying color components'
    ]
);

document.querySelector('.game-header').after(instructionsPanel);

function initializeLevel() {
    const level = levels[currentLevel - 1];
    document.getElementById('level').textContent = currentLevel;
    document.getElementById('score').textContent = score;
    document.getElementById('hint').textContent = level.description;

    // Generate random target color
    targetColor = {
        red: Math.floor(Math.random() * 256),
        green: Math.floor(Math.random() * 256),
        blue: Math.floor(Math.random() * 256)
    };

    // Display the color
    const colorDisplay = document.getElementById('colorDisplay');
    colorDisplay.style.backgroundColor = `rgb(${targetColor.red}, ${targetColor.green}, ${targetColor.blue})`;

    // Reset inputs
    document.getElementById('redInput').value = '';
    document.getElementById('greenInput').value = '';
    document.getElementById('blueInput').value = '';
    document.getElementById('accuracy').textContent = '0';

    document.querySelector('.next-btn').disabled = true;
}

function checkGuess() {
    const level = levels[currentLevel - 1];
    const redGuess = parseInt(document.getElementById('redInput').value) || 0;
    const greenGuess = parseInt(document.getElementById('greenInput').value) || 0;
    const blueGuess = parseInt(document.getElementById('blueInput').value) || 0;

    // Calculate accuracy for each channel
    const redDiff = Math.abs(targetColor.red - redGuess);
    const greenDiff = Math.abs(targetColor.green - greenGuess);
    const blueDiff = Math.abs(targetColor.blue - blueGuess);

    // Calculate overall accuracy percentage
    const maxDiff = 255;
    const accuracy = Math.round(
        ((maxDiff - (redDiff + greenDiff + blueDiff) / 3) / maxDiff) * 100
    );
    document.getElementById('accuracy').textContent = accuracy;

    // Check if guess is within tolerance
    if (redDiff <= level.tolerance && 
        greenDiff <= level.tolerance && 
        blueDiff <= level.tolerance) {

        // Calculate bonuses
        const accuracyBonus = Math.max(accuracy - 80, 0);
        const timeBonus = Math.max(300 - seconds, 0);
        const difficultyMultiplier = level.difficulty === 'Hard' ? 3 : 
                                   level.difficulty === 'Medium' ? 2 : 1;

        const levelScore = (100 * difficultyMultiplier) + 
                         (accuracyBonus * 5 * difficultyMultiplier) + 
                         (timeBonus * difficultyMultiplier / 2);
        score += levelScore;

        if (currentLevel === levels.length) {
            celebrations.showAdvancedSuccess();
            setTimeout(() => celebrations.showMessage(
                `🏆 Amazing! You've completed all levels!\nAccuracy: ${accuracy}%\nTime Bonus: +${timeBonus}\nScore: +${levelScore}`, 
                5000
            ), 1500);
        } else {
            celebrations.showBeginnerSuccess();
            document.querySelector('.next-btn').disabled = false;
            celebrations.showMessage(
                `🌟 Level Complete!\nAccuracy: ${accuracy}%\nTime Bonus: +${timeBonus}\nScore: +${levelScore}`, 
                3000
            );
        }
    } else {
        const hint = generateHint(redDiff, greenDiff, blueDiff);
        celebrations.showMessage(`Not quite right. ${hint} Try again! 🤔`, 3000);
    }
}

function generateHint(redDiff, greenDiff, blueDiff) {
    const hints = [];
    if (redDiff > 50) hints.push('Red is way off');
    if (greenDiff > 50) hints.push('Green is way off');
    if (blueDiff > 50) hints.push('Blue is way off');
    return hints.join(', ') || 'Getting closer!';
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
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Reset game state
        score = 0;
        seconds = 0;
        currentLevel = 1;
        document.getElementById('score').textContent = '0';
        document.getElementById('level').textContent = '1';
        document.getElementById('time').textContent = '0:00';

        // Initialize the first level
        initializeLevel();
        startTimer();

        // Preload background images for visual feedback
        await imageUtils.preloadImages(
            ['colors', 'palette', 'spectrum'],
            400,
            300
        );
    } catch (error) {
        console.error('Error initializing game:', error);
        celebrations.showMessage('Failed to initialize game. Please refresh the page.', 3000);
    }
});