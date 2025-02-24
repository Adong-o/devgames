// Regex Runner Game Implementation

let score = 0;
let timer;
let seconds = 60;
let currentChallenge;
let currentLevel = 1;
let mistakes = 0;

// Regex challenges by difficulty level
const challenges = {
    beginner: [
        {
            pattern: 'hello',
            test: ['hello world', 'say hello', 'hello123'],
            description: 'Match the word "hello"',
            hint: 'Simple text matching'
        },
        {
            pattern: '\\d+',
            test: ['123', 'abc456', '789xyz'],
            description: 'Match one or more digits',
            hint: 'Use \\d for digits and + for one or more'
        },
        {
            pattern: '[aeiou]',
            test: ['apple', 'elephant', 'igloo'],
            description: 'Match any vowel',
            hint: 'Use square brackets for character sets'
        }
    ],
    intermediate: [
        {
            pattern: '^\\w+@\\w+\\.\\w+$',
            test: ['user@example.com', 'test@domain.com'],
            description: 'Match a simple email pattern',
            hint: 'Use ^ for start, $ for end, and \\w for word characters'
        },
        {
            pattern: '\\b\\w{4,}\\b',
            test: ['word longer four', 'test example'],
            description: 'Match words with 4 or more characters',
            hint: 'Use \\b for word boundaries and {4,} for length'
        },
        {
            pattern: '(https?:\\/\\/)?\\w+\\.\\w+',
            test: ['https://example.com', 'http://test.com', 'domain.com'],
            description: 'Match URLs with optional protocol',
            hint: 'Use ? for optional parts and escape forward slashes'
        }
    ],
    advanced: [
        {
            pattern: '(?<=\\$)\\d+(\\.\\d{2})?',
            test: ['$10.99', '$5.00', '$20'],
            description: 'Match currency amounts after dollar sign',
            hint: 'Use positive lookbehind (?<=) and optional decimals'
        },
        {
            pattern: '\\b(?!\\d+\\b)\\w+',
            test: ['abc 123 def', 'test 456'],
            description: 'Match words that are not numbers',
            hint: 'Use negative lookahead (?!) to exclude numbers'
        },
        {
            pattern: '(\\w)\\1+',
            test: ['hello', 'book', 'cheese'],
            description: 'Match repeated characters',
            hint: 'Use capturing groups and backreferences'
        }
    ]
};

// Initialize game instructions
gameInstructions.addStyles();
const instructionsPanel = gameInstructions.createPanel(
    'Regex Runner Instructions',
    [
        'Write a regular expression that matches the given pattern',
        'Test your regex against the provided test cases',
        'Complete challenges before time runs out',
        'Use the hint if you need help'
    ],
    [
        'Remember to escape special characters',
        'Pay attention to the pattern description',
        'Test your regex carefully'
    ]
);

document.querySelector('.game-header').after(instructionsPanel);

function getRandomChallenge() {
    const level = currentLevel === 1 ? 'beginner' :
                 currentLevel === 2 ? 'intermediate' : 'advanced';
    
    const levelChallenges = challenges[level];
    return levelChallenges[Math.floor(Math.random() * levelChallenges.length)];
}

function displayNewChallenge() {
    currentChallenge = getRandomChallenge();
    
    document.getElementById('challenge-description').textContent = currentChallenge.description;
    document.getElementById('challenge-hint').textContent = currentChallenge.hint;
    document.getElementById('test-cases').textContent = currentChallenge.test.join('\n');
    document.getElementById('regex-input').value = '';
    document.getElementById('regex-input').focus();
}

function testRegex() {
    const userInput = document.getElementById('regex-input').value;
    
    try {
        const regex = new RegExp(userInput);
        const allMatch = currentChallenge.test.every(test => 
            regex.test(test) === test.includes(currentChallenge.pattern)
        );
        
        if (allMatch) {
            const timeBonus = Math.max(30 - (60 - seconds), 0);
            const levelMultiplier = currentLevel;
            score += (20 + timeBonus) * levelMultiplier;
            
            document.getElementById('score').textContent = score;
            celebrations.showSuccess();
            
            if (score >= 150 && currentLevel === 1) {
                currentLevel = 2;
                celebrations.showMessage('Level Up! Intermediate Patterns Unlocked! 🚀', 2000);
            } else if (score >= 300 && currentLevel === 2) {
                currentLevel = 3;
                celebrations.showMessage('Level Up! Advanced Patterns Unlocked! 🎯', 2000);
            }
            
            displayNewChallenge();
        } else {
            mistakes++;
            celebrations.showError();
            if (mistakes >= 3) {
                celebrations.showMessage(`Hint: ${currentChallenge.hint}`, 2000);
            }
        }
    } catch (error) {
        celebrations.showMessage('Invalid regex pattern! Try again.', 2000);
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
    celebrations.showMessage(message, 3000);
    
    // Update high score
    const highScore = localStorage.getItem('regexRunnerHighScore') || 0;
    if (score > highScore) {
        localStorage.setItem('regexRunnerHighScore', score);
        celebrations.showMessage('New High Score! 🏆', 2000);
    }
}

// Event Listeners
document.getElementById('regex-input').addEventListener('keypress', (e) => {
    if (!timer) startTimer();
    if (e.key === 'Enter') {
        testRegex();
    }
});

document.getElementById('start-btn').addEventListener('click', () => {
    score = 0;
    seconds = 60;
    mistakes = 0;
    currentLevel = 1;
    
    document.getElementById('score').textContent = '0';
    document.getElementById('time').textContent = '60';
    
    clearInterval(timer);
    timer = null;
    
    displayNewChallenge();
    startTimer();
});

// Initialize game
displayNewChallenge();