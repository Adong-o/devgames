// Command Line Race Game Implementation

let score = 0;
let timer;
let seconds = 60;
let currentCommand;
let commandHistory = [];
let currentLevel = 1;
let mistakes = 0;

// Command list by difficulty level
const commands = {
    beginner: [
        { command: 'ls', description: 'List directory contents' },
        { command: 'cd', description: 'Change directory' },
        { command: 'pwd', description: 'Print working directory' },
        { command: 'mkdir', description: 'Make directory' },
        { command: 'touch', description: 'Create empty file' },
        { command: 'cp', description: 'Copy file or directory' },
        { command: 'mv', description: 'Move or rename file' },
        { command: 'rm', description: 'Remove file' }
    ],
    intermediate: [
        { command: 'chmod', description: 'Change file permissions' },
        { command: 'grep', description: 'Search text patterns' },
        { command: 'find', description: 'Search for files' },
        { command: 'tar', description: 'Archive files' },
        { command: 'ssh', description: 'Secure shell connection' },
        { command: 'scp', description: 'Secure copy' },
        { command: 'curl', description: 'Transfer data from/to server' },
        { command: 'wget', description: 'Download files from web' }
    ],
    advanced: [
        { command: 'awk', description: 'Text processing tool' },
        { command: 'sed', description: 'Stream editor' },
        { command: 'netstat', description: 'Network statistics' },
        { command: 'ps aux', description: 'Process status' },
        { command: 'kill', description: 'Terminate process' },
        { command: 'cron', description: 'Schedule tasks' },
        { command: 'rsync', description: 'Remote file sync' },
        { command: 'docker', description: 'Container operations' }
    ]
};

// Initialize game instructions
gameInstructions.addStyles();
const instructionsPanel = gameInstructions.createPanel(
    'Command Line Race Instructions',
    [
        'Type the displayed command exactly as shown',
        'Press Enter to submit your answer',
        'Complete as many commands as possible before time runs out',
        'Watch out for case sensitivity!'
    ],
    [
        'Read the command description for hints',
        'Pay attention to spaces and special characters',
        'Learn common terminal commands while playing'
    ]
);

document.querySelector('.game-header').after(instructionsPanel);

function getRandomCommand() {
    const level = currentLevel === 1 ? 'beginner' :
                 currentLevel === 2 ? 'intermediate' : 'advanced';
    
    const availableCommands = commands[level].filter(cmd => 
        !commandHistory.includes(cmd.command)
    );
    
    if (availableCommands.length === 0) {
        commandHistory = [];
        return commands[level][Math.floor(Math.random() * commands[level].length)];
    }
    
    return availableCommands[Math.floor(Math.random() * availableCommands.length)];
}

function displayNewCommand() {
    currentCommand = getRandomCommand();
    commandHistory.push(currentCommand.command);
    
    document.getElementById('command-display').textContent = currentCommand.command;
    document.getElementById('command-description').textContent = currentCommand.description;
    document.getElementById('command-input').value = '';
    document.getElementById('command-input').focus();
}

function checkCommand() {
    const userInput = document.getElementById('command-input').value.trim();
    
    if (userInput === currentCommand.command) {
        const timeBonus = Math.max(30 - (60 - seconds), 0);
        const levelMultiplier = currentLevel;
        score += (10 + timeBonus) * levelMultiplier;
        
        document.getElementById('score').textContent = score;
        celebrations.showSuccess();
        
        if (score >= 100 && currentLevel === 1) {
            currentLevel = 2;
            celebrations.showMessage('Level Up! Intermediate Commands Unlocked! 🚀', 2000);
        } else if (score >= 250 && currentLevel === 2) {
            currentLevel = 3;
            celebrations.showMessage('Level Up! Advanced Commands Unlocked! 🎯', 2000);
        }
        
        displayNewCommand();
    } else {
        mistakes++;
        celebrations.showError();
        if (mistakes >= 3) {
            celebrations.showMessage('Hint: Type exactly as shown, including spaces!', 2000);
        }
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
    const message = `Game Over! 🎮\nFinal Score: ${score}\nCommands Mastered: ${commandHistory.length}`;
    celebrations.showMessage(message, 3000);
    
    // Update high score
    const highScore = localStorage.getItem('commandLineHighScore') || 0;
    if (score > highScore) {
        localStorage.setItem('commandLineHighScore', score);
        celebrations.showMessage('New High Score! 🏆', 2000);
    }
}

// Event Listeners
document.getElementById('command-input').addEventListener('keypress', (e) => {
    if (!timer) startTimer();
    if (e.key === 'Enter') {
        checkCommand();
    }
});

document.getElementById('start-btn').addEventListener('click', () => {
    score = 0;
    seconds = 60;
    mistakes = 0;
    commandHistory = [];
    currentLevel = 1;
    
    document.getElementById('score').textContent = '0';
    document.getElementById('time').textContent = '60';
    
    clearInterval(timer);
    timer = null;
    
    displayNewCommand();
    startTimer();
});

// Initialize game
displayNewCommand();