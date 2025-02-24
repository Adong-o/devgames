// Logic Gates Game Implementation

let currentLevel = 1;
let score = 0;
let timer;
let seconds = 0;

// Game levels with their respective challenges
const levels = [
    {
        gate: 'AND',
        description: 'Complete the truth table for an AND gate',
        difficulty: 'Easy',
        truthTable: [
            { a: 0, b: 0, output: 0 },
            { a: 0, b: 1, output: 0 },
            { a: 1, b: 0, output: 0 },
            { a: 1, b: 1, output: 1 }
        ]
    },
    {
        gate: 'OR',
        description: 'Complete the truth table for an OR gate',
        difficulty: 'Easy',
        truthTable: [
            { a: 0, b: 0, output: 0 },
            { a: 0, b: 1, output: 1 },
            { a: 1, b: 0, output: 1 },
            { a: 1, b: 1, output: 1 }
        ]
    },
    {
        gate: 'XOR',
        description: 'Complete the truth table for an XOR gate',
        difficulty: 'Medium',
        truthTable: [
            { a: 0, b: 0, output: 0 },
            { a: 0, b: 1, output: 1 },
            { a: 1, b: 0, output: 1 },
            { a: 1, b: 1, output: 0 }
        ]
    },
    {
        gate: 'NAND',
        description: 'Complete the truth table for a NAND gate',
        difficulty: 'Medium',
        truthTable: [
            { a: 0, b: 0, output: 1 },
            { a: 0, b: 1, output: 1 },
            { a: 1, b: 0, output: 1 },
            { a: 1, b: 1, output: 0 }
        ]
    },
    {
        gate: 'NOR',
        description: 'Complete the truth table for a NOR gate',
        difficulty: 'Hard',
        truthTable: [
            { a: 0, b: 0, output: 1 },
            { a: 0, b: 1, output: 0 },
            { a: 1, b: 0, output: 0 },
            { a: 1, b: 1, output: 0 }
        ]
    }
];

// Initialize game instructions
gameInstructions.addStyles();
const instructionsPanel = gameInstructions.createPanel(
    'Logic Gates Instructions',
    [
        'Complete the truth table by clicking on the output cells',
        'Click once for 1, click again for 0',
        'Check your solution when you think you have it right',
        'Progress through increasingly complex logic gates'
    ],
    [
        'Study the gate symbol carefully',
        'Remember basic logic gate operations',
        'Consider all possible input combinations'
    ]
);

document.querySelector('.game-header').after(instructionsPanel);

function initializeLevel() {
    const level = levels[currentLevel - 1];
    document.getElementById('problemDescription').textContent = level.description;
    document.getElementById('level').textContent = currentLevel;
    document.getElementById('score').textContent = score;

    // Display gate symbol
    const gateGrid = document.getElementById('gateGrid');
    gateGrid.innerHTML = `<div class="gate">${level.gate}</div>`;

    // Create truth table
    const truthTableBody = document.getElementById('truthTableBody');
    truthTableBody.innerHTML = '';

    level.truthTable.forEach((row, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${row.a}</td>
            <td>${row.b}</td>
            <td class="output-cell" data-index="${index}" onclick="toggleOutput(this)">0</td>
        `;
        truthTableBody.appendChild(tr);
    });
}

function toggleOutput(cell) {
    cell.textContent = cell.textContent === '0' ? '1' : '0';
}

function checkSolution() {
    const level = levels[currentLevel - 1];
    const outputCells = document.querySelectorAll('.output-cell');
    let correct = true;

    outputCells.forEach((cell, index) => {
        if (parseInt(cell.textContent) !== level.truthTable[index].output) {
            correct = false;
        }
    });

    if (correct) {
        // Calculate time bonus (faster completion = more points)
        const timeBonus = Math.max(300 - seconds, 0);
        // Score based on difficulty and time
        const difficultyMultiplier = level.difficulty === 'Hard' ? 3 : level.difficulty === 'Medium' ? 2 : 1;
        const levelScore = (100 * difficultyMultiplier) + Math.floor(timeBonus * difficultyMultiplier / 2);
        score += levelScore;
        document.getElementById('score').textContent = score;

        if (currentLevel === levels.length) {
            celebrations.showAdvancedSuccess();
            setTimeout(() => celebrations.showMessage(`🏆 Amazing! You've completed all levels!\nFinal Score: ${score}\nTime Bonus: +${timeBonus}`, 5000), 1500);
        } else {
            celebrations.showBeginnerSuccess();
            document.querySelector('.next-btn').disabled = false;
            celebrations.showMessage(`🌟 Level Complete!\nScore: +${levelScore}\nTime Bonus: +${timeBonus}`, 3000);
        }
    } else {
        celebrations.showMessage('Not quite right. Check your truth table values! 🤔', 3000);
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
});