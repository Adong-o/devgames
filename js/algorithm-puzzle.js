// Algorithm Puzzle Game Implementation

let currentLevel = 1;
let score = 0;
let timer;
let seconds = 0;

// Game levels with their respective challenges
const levels = [
    {
        description: 'Arrange the code blocks to create a function that finds the maximum number in an array.',
        difficulty: 'Easy',
        blocks: [
            'function findMax(arr) {',
            '    let max = arr[0];',
            '    for (let i = 1; i < arr.length; i++) {',
            '        if (arr[i] > max) {',
            '            max = arr[i];',
            '        }',
            '    }',
            '    return max;',
            '}'
        ],
        solution: [0, 1, 2, 3, 4, 5, 6, 7]
    },
    {
        description: 'Create a function that checks if a string is a palindrome.',
        difficulty: 'Easy',
        blocks: [
            'function isPalindrome(str) {',
            '    str = str.toLowerCase().replace(/[^a-z0-9]/g, "");',
            '    let left = 0;',
            '    let right = str.length - 1;',
            '    while (left < right) {',
            '        if (str[left] !== str[right]) return false;',
            '        left++;',
            '        right--;',
            '    }',
            '    return true;',
            '}'
        ],
        solution: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    },
    {
        description: 'Create a binary search function to find a target number in a sorted array.',
        difficulty: 'Medium',
        blocks: [
            'function binarySearch(arr, target) {',
            '    let left = 0;',
            '    let right = arr.length - 1;',
            '    while (left <= right) {',
            '        const mid = Math.floor((left + right) / 2);',
            '        if (arr[mid] === target) return mid;',
            '        if (arr[mid] < target) left = mid + 1;',
            '        else right = mid - 1;',
            '    }',
            '    return -1;',
            '}'        
        ],
        solution: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    },
    {
        description: 'Implement a quicksort algorithm to sort an array.',
        difficulty: 'Hard',
        blocks: [
            'function quickSort(arr) {',
            '    if (arr.length <= 1) return arr;',
            '    const pivot = arr[0];',
            '    const left = [];',
            '    const right = [];',
            '    for (let i = 1; i < arr.length; i++) {',
            '        if (arr[i] < pivot) left.push(arr[i]);',
            '        else right.push(arr[i]);',
            '    }',
            '    return [...quickSort(left), pivot, ...quickSort(right)];',
            '}'        
        ],
        solution: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    }
];

// Initialize game instructions
gameInstructions.addStyles();
const instructionsPanel = gameInstructions.createPanel(
    'Algorithm Puzzle Instructions',
    [
        'Drag and drop code blocks to arrange them in the correct order',
        'Create a working function by properly sequencing the code',
        'Click "Check Solution" when you think you have the correct order',
        'Complete each level to unlock more challenging problems'
    ],
    [
        'Pay attention to code indentation for clues',
        'Look for opening and closing brackets',
        'Consider the logical flow of the algorithm'
    ]
);

document.querySelector('.game-header').after(instructionsPanel);

function initializeLevel() {
    const level = levels[currentLevel - 1];
    document.getElementById('problemDescription').textContent = level.description;
    document.getElementById('level').textContent = currentLevel;
    document.getElementById('score').textContent = score;

    const codeBlocks = document.getElementById('codeBlocks');
    const shuffledBlocks = shuffleArray([...level.blocks]);
    codeBlocks.innerHTML = '';

    shuffledBlocks.forEach((block, index) => {
        const blockElement = document.createElement('div');
        blockElement.className = 'code-block';
        blockElement.textContent = block;
        blockElement.draggable = true;
        blockElement.dataset.index = level.blocks.indexOf(block);

        blockElement.addEventListener('dragstart', handleDragStart);
        blockElement.addEventListener('dragend', handleDragEnd);
        codeBlocks.appendChild(blockElement);
    });

    const solutionArea = document.getElementById('solutionArea');
    solutionArea.innerHTML = '';
    solutionArea.addEventListener('dragover', handleDragOver);
    solutionArea.addEventListener('drop', handleDrop);
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function handleDragStart(e) {
    e.target.classList.add('dragging');
    e.dataTransfer.setData('text/plain', e.target.dataset.index);
}

function handleDragEnd(e) {
    e.target.classList.remove('dragging');
}

function handleDrop(e) {
    e.preventDefault();
    const draggedBlock = document.querySelector('.dragging');
    if (draggedBlock && e.target.classList.contains('solution-area')) {
        e.target.appendChild(draggedBlock);
    } else if (draggedBlock && e.target.classList.contains('code-block')) {
        e.target.parentNode.insertBefore(draggedBlock, e.target);
    }
}

function handleDragOver(e) {
    e.preventDefault();
    const draggedBlock = document.querySelector('.dragging');
    if (draggedBlock) {
        const container = e.target.classList.contains('solution-area') ? 
            e.target : e.target.parentNode;
        const afterElement = getDragAfterElement(container, e.clientY);
        if (afterElement) {
            container.insertBefore(draggedBlock, afterElement);
        } else {
            container.appendChild(draggedBlock);
        }
    }
}

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.code-block:not(.dragging)')];
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

function checkSolution() {
    const solutionArea = document.getElementById('solutionArea');
    const blocks = Array.from(solutionArea.children);
    const currentSolution = blocks.map(block => parseInt(block.dataset.index));
    const level = levels[currentLevel - 1];

    if (arraysEqual(currentSolution, level.solution)) {
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
        // Provide specific feedback based on the type of error
        const errorMessage = getErrorFeedback(currentSolution, level.solution);
        celebrations.showMessage(`Not quite right. ${errorMessage} Try again! 🤔`, 3000);
    }
}

function getErrorFeedback(current, solution) {
    if (current.length < solution.length) {
        return "You're missing some code blocks.";
    } else if (current.length > solution.length) {
        return "You have too many code blocks.";
    } else {
        // Find the first mismatch
        const mismatchIndex = current.findIndex((val, idx) => val !== solution[idx]);
        if (mismatchIndex === -1) return "Check your logic.";
        return `Check the block at position ${mismatchIndex + 1}.`;
    }
}

function nextLevel() {
    if (currentLevel < levels.length) {
        currentLevel++;
        document.querySelector('.next-btn').disabled = true;
        initializeLevel();
    }
}

function arraysEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) return false;
    return arr1.every((value, index) => value === arr2[index]);
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