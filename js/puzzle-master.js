// Puzzle Master Game Implementation

let currentLevel = 1;
let moves = 0;
let timer;
let seconds = 0;
let puzzleState = [];
let emptyTileIndex = 8; // Bottom-right corner

// Game levels with their respective challenges
const levels = [
    {
        imageUrl: 'images/puzzle1.jpg',
        size: 3,
        difficulty: 'Easy',
        moves: 20
    },
    {
        imageUrl: 'images/puzzle2.jpg',
        size: 3,
        difficulty: 'Medium',
        moves: 30
    },
    {
        imageUrl: 'images/puzzle3.jpg',
        size: 3,
        difficulty: 'Hard',
        moves: 40
    }
];

// Initialize game instructions
gameInstructions.addStyles();
const instructionsPanel = gameInstructions.createPanel(
    'Puzzle Master Instructions',
    [
        'Click tiles adjacent to the empty space to move them',
        'Arrange the tiles to match the preview image',
        'Complete the puzzle in as few moves as possible',
        'Progress through increasingly complex puzzles'
    ],
    [
        'Study the preview image carefully',
        'Plan your moves in advance',
        'Use the empty space strategically'
    ]
);

document.querySelector('.game-header').after(instructionsPanel);

function initializeLevel() {
    const level = levels[currentLevel - 1];
    document.getElementById('level').textContent = currentLevel;
    document.getElementById('moves').textContent = moves = 0;
    document.getElementById('previewImage').src = level.imageUrl;

    // Initialize puzzle state
    puzzleState = Array.from({length: 8}, (_, i) => i + 1);
    puzzleState.push(null); // Empty tile
    emptyTileIndex = 8;

    renderPuzzle();
    shufflePuzzle();
}

function renderPuzzle() {
    const puzzleGrid = document.getElementById('puzzleGrid');
    puzzleGrid.innerHTML = '';

    puzzleState.forEach((value, index) => {
        const tile = document.createElement('div');
        tile.className = `puzzle-tile${value === null ? ' empty' : ''}`;
        if (value !== null) {
            tile.textContent = value;
            tile.onclick = () => moveTile(index);
        }
        puzzleGrid.appendChild(tile);
    });
}

function moveTile(index) {
    const validMoves = getValidMoves();
    if (validMoves.includes(index)) {
        // Swap tiles
        [puzzleState[index], puzzleState[emptyTileIndex]] = 
        [puzzleState[emptyTileIndex], puzzleState[index]];
        emptyTileIndex = index;
        moves++;
        document.getElementById('moves').textContent = moves;

        renderPuzzle();
        checkWinCondition();
    }
}

function getValidMoves() {
    const size = 3; // 3x3 grid
    const row = Math.floor(emptyTileIndex / size);
    const col = emptyTileIndex % size;
    const validMoves = [];

    // Check adjacent tiles
    if (row > 0) validMoves.push(emptyTileIndex - size); // Up
    if (row < size - 1) validMoves.push(emptyTileIndex + size); // Down
    if (col > 0) validMoves.push(emptyTileIndex - 1); // Left
    if (col < size - 1) validMoves.push(emptyTileIndex + 1); // Right

    return validMoves;
}

function shufflePuzzle() {
    // Perform random valid moves to ensure solvability
    for (let i = 0; i < 100; i++) {
        const validMoves = getValidMoves();
        const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)];
        [puzzleState[randomMove], puzzleState[emptyTileIndex]] = 
        [puzzleState[emptyTileIndex], puzzleState[randomMove]];
        emptyTileIndex = randomMove;
    }

    moves = 0;
    document.getElementById('moves').textContent = moves;
    renderPuzzle();
}

function checkWinCondition() {
    const isWin = puzzleState.every((value, index) => 
        (index === 8 && value === null) || value === index + 1
    );

    if (isWin) {
        const level = levels[currentLevel - 1];
        const moveBonus = Math.max(level.moves - moves, 0);
        const timeBonus = Math.max(300 - seconds, 0);
        const difficultyMultiplier = level.difficulty === 'Hard' ? 3 : 
                                   level.difficulty === 'Medium' ? 2 : 1;

        const score = (100 * difficultyMultiplier) + 
                     (moveBonus * 10 * difficultyMultiplier) + 
                     (timeBonus * difficultyMultiplier);

        if (currentLevel === levels.length) {
            celebrations.showAdvancedSuccess();
            setTimeout(() => celebrations.showMessage(
                `🏆 Amazing! You've completed all levels!\nMoves: ${moves}\nTime Bonus: +${timeBonus}\nMove Bonus: +${moveBonus * 10}`, 
                5000
            ), 1500);
        } else {
            celebrations.showBeginnerSuccess();
            document.querySelector('.next-btn').disabled = false;
            celebrations.showMessage(
                `🌟 Level Complete!\nMoves: ${moves}\nTime Bonus: +${timeBonus}\nMove Bonus: +${moveBonus * 10}`, 
                3000
            );
        }
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