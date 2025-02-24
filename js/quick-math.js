// Quick Math Game Implementation

let score = 0;
let timer;
let seconds = 30;
let currentProblem;
let currentLevel = 1;
let highScore = localStorage.getItem('quickMathHighScore') || 0;
let achievements = JSON.parse(localStorage.getItem('quickMathAchievements')) || {
    mathWhiz: false,     // Score 200+ points
    speedDemon: false,   // Answer 10 problems in under 15 seconds
    perfectRound: false, // Complete a round with no wrong answers
    calculator: false,   // Complete level 5 with double-digit operations
    mathGenius: false,   // Score 500+ points
    unstoppable: false   // Solve 20 problems without mistakes
};
let wrongAnswers = 0;
let problemsSolved = 0;

function generateProblem() {
    const operators = currentLevel === 1 ? ['+', '-'] : 
                     currentLevel === 2 ? ['+', '-', '*'] : 
                     currentLevel === 3 ? ['+', '-', '*', '/'] :
                     currentLevel === 4 ? ['+', '-', '*', '/', '%'] :
                     ['+', '-', '*', '/', '%', '**'];
    
    const maxNum = currentLevel === 1 ? 12 : 
                  currentLevel === 2 ? 50 : 
                  currentLevel === 3 ? 100 :
                  currentLevel === 4 ? 200 :
                  500;
    
    const num1 = Math.floor(Math.random() * maxNum) + 1;
    let num2 = Math.floor(Math.random() * maxNum) + 1;
    
    // Ensure division and modulo results in whole numbers
    if (operators.includes('/') || operators.includes('%')) {
        num2 = Math.floor(Math.random() * 10) + 1;
        const product = num1 * num2;
        if (operators.includes('%')) {
            return {
                question: `${num1} % ${num2} = ?`,
                answer: num1 % num2
            };
        }
        return {
            question: `${product} / ${num2} = ?`,
            answer: num1
        };
    }
    
    // Handle power operations for higher levels
    if (operators.includes('**')) {
        num2 = Math.floor(Math.random() * 3) + 2; // Powers between 2 and 4
        return {
            question: `${num1} ** ${num2} = ?`,
            answer: Math.pow(num1, num2)
        };
    }
    
    const operator = operators[Math.floor(Math.random() * operators.length)];
    let answer;
    
    switch(operator) {
        case '+':
            answer = num1 + num2;
            break;
        case '-':
            answer = num1 - num2;
            break;
        case '*':
            answer = num1 * num2;
            break;
        case '/':
            answer = product / num2;
            break;
        case '%':
            answer = num1 % num2;
            break;
        case '**':
            answer = Math.pow(num1, num2);
            break;
    }

    return {
        question: `${num1} ${operator} ${num2} = ?`,
        answer: answer
    };
}

function updateScore(correct) {
    if (correct) {
        const timeBonus = Math.max(30 - (30 - seconds), 0);
        const levelMultiplier = currentLevel * 2;
        score += (10 + timeBonus) * levelMultiplier;
        problemsSolved++;
    } else {
        wrongAnswers++;
    }
    
    document.getElementById('score').textContent = score;
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('quickMathHighScore', highScore);
        document.getElementById('highScore').textContent = highScore;
    }
}

function checkAchievements() {
    if (score >= 200 && !achievements.mathWhiz) {
        achievements.mathWhiz = true;
        celebrations.showMessage('🧮 Achievement Unlocked: Math Whiz!', 3000);
    }
    if (problemsSolved >= 10 && seconds > 15 && !achievements.speedDemon) {
        achievements.speedDemon = true;
        celebrations.showMessage('⚡ Achievement Unlocked: Speed Demon!', 3000);
    }
    if (problemsSolved >= 5 && wrongAnswers === 0 && !achievements.perfectRound) {
        achievements.perfectRound = true;
        celebrations.showMessage('✨ Achievement Unlocked: Perfect Round!', 3000);
    }
    if (currentLevel >= 5 && !achievements.calculator) {
        achievements.calculator = true;
        celebrations.showMessage('🔢 Achievement Unlocked: Human Calculator!', 3000);
    }
    if (score >= 500 && !achievements.mathGenius) {
        achievements.mathGenius = true;
        celebrations.showMessage('🎓 Achievement Unlocked: Math Genius!', 3000);
    }
    if (problemsSolved >= 20 && wrongAnswers === 0 && !achievements.unstoppable) {
        achievements.unstoppable = true;
        celebrations.showMessage('🚀 Achievement Unlocked: Unstoppable!', 3000);
    }
    localStorage.setItem('quickMathAchievements', JSON.stringify(achievements));
}

function checkAnswer() {
    const answerInput = document.getElementById('answer').value;
    if (!answerInput.trim()) return;
    
    const userAnswer = parseInt(answerInput);
    if (userAnswer === currentProblem.answer) {
        updateScore(true);
        celebrations.showBeginnerSuccess();
        if (score >= 100 * currentLevel && currentLevel < 5) {
            nextLevel();
        }
        checkAchievements();
        updateProblem();
    } else {
        updateScore(false);
        celebrations.showMessage('Try again! 🤔', 1000);
    }
    document.getElementById('answer').value = '';
    document.getElementById('answer').focus();
}

function nextLevel() {
    if (currentLevel < 5) {
        currentLevel++;
        document.getElementById('level').textContent = currentLevel;
        seconds += 15; // Bonus time for next level
        document.getElementById('time').textContent = seconds;
        celebrations.showMessage(`Level ${currentLevel} - Get Ready! 🚀`, 2000);
    }
}

function endGame() {
    clearInterval(timer);
    checkAchievements();
    const message = `Game Over! 🎮\nLevel: ${currentLevel}\nFinal Score: ${score}\nProblems Solved: ${problemsSolved}`;
    if (score >= 200) {
        celebrations.showAdvancedSuccess();
    }
    setTimeout(() => celebrations.showMessage(message, 5000), 1000);
    document.getElementById('answer').disabled = true;
    document.getElementById('submit-btn').disabled = true;
}

function restartGame() {
    score = 0;
    seconds = 30;
    currentLevel = 1;
    wrongAnswers = 0;
    problemsSolved = 0;
    clearInterval(timer);
    timer = null;
    
    document.getElementById('score').textContent = '0';
    document.getElementById('highScore').textContent = highScore;
    document.getElementById('level').textContent = '1';
    document.getElementById('time').textContent = '30';
    document.getElementById('answer').disabled = false;
    document.getElementById('submit-btn').disabled = false;
    
    updateProblem();
    startTimer();
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

// Event listeners
document.getElementById('answer').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        checkAnswer();
    }
});

function updateProblem() {
    currentProblem = generateProblem();
    document.getElementById('problem').textContent = currentProblem.question;
    document.getElementById('answer').value = '';
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Preload background images for visual feedback
        await imageUtils.preloadImages(
            ['mathematics', 'numbers', 'calculations'],
            400,
            300
        );
        
        // Initialize game elements
        document.getElementById('score').textContent = score;
        document.getElementById('highScore').textContent = highScore;
        document.getElementById('level').textContent = currentLevel;
        
        updateProblem();
        startTimer();
    } catch (error) {
        console.error('Error initializing game:', error);
        celebrations.showMessage('Failed to load game resources. Please try again.', 3000);
    }
});