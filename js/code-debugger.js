// Code Debugger Game Implementation

let score = 0;
let timer;
let seconds = 180; // 3 minutes per challenge
let currentChallenge;
let currentLevel = 1;
let mistakes = 0;

// Code challenges by difficulty level
const challenges = {
    beginner: [
        {
            code: `function calculateSum(numbers) {
    let sum = 0;
    for (let i = 0; i <= numbers.length; i++) {
        sum += numbers[i];
    }
    return sum;
}`,
            bugs: ['Array index out of bounds', 'Loop condition includes equal to'],
            solution: `function calculateSum(numbers) {
    let sum = 0;
    for (let i = 0; i < numbers.length; i++) {
        sum += numbers[i];
    }
    return sum;
}`,
            testCases: [
                { input: [1, 2, 3], expected: 6 },
                { input: [10, 20, 30], expected: 60 }
            ],
            hint: 'Check the loop condition and array bounds'
        },
        {
            code: `function reverseString(str) {
    let reversed = "";
    for (let i = str.length; i >= 0; i--) {
        reversed += str[i];
    }
    return reversed;
}`,
            bugs: ['Starting index too high', 'Including undefined character'],
            solution: `function reverseString(str) {
    let reversed = "";
    for (let i = str.length - 1; i >= 0; i--) {
        reversed += str[i];
    }
    return reversed;
}`,
            testCases: [
                { input: "hello", expected: "olleh" },
                { input: "world", expected: "dlrow" }
            ],
            hint: 'Think about string indices and their valid range'
        }
    ],
    intermediate: [
        {
            code: `class Stack {
    constructor() {
        this.items = [];
    }
    
    push(element) {
        this.items.push(element);
    }
    
    pop() {
        return this.items.pop();
    }
    
    peek() {
        return this.items[this.items.length];
    }
    
    isEmpty() {
        return this.items.length === 0;
    }
}`,
            bugs: ['Peek method returns undefined', 'No empty check in pop'],
            solution: `class Stack {
    constructor() {
        this.items = [];
    }
    
    push(element) {
        this.items.push(element);
    }
    
    pop() {
        if (this.isEmpty()) return null;
        return this.items.pop();
    }
    
    peek() {
        if (this.isEmpty()) return null;
        return this.items[this.items.length - 1];
    }
    
    isEmpty() {
        return this.items.length === 0;
    }
}`,
            testCases: [
                { input: ['push(1)', 'peek()'], expected: 1 },
                { input: ['pop()', 'isEmpty()'], expected: true }
            ],
            hint: 'Check array bounds and edge cases'
        }
    ],
    advanced: [
        {
            code: `class BinarySearchTree {
    constructor() {
        this.root = null;
    }
    
    insert(value) {
        const node = { value, left: null, right: null };
        if (!this.root) {
            this.root = node;
            return;
        }
        
        let current = this.root;
        while (true) {
            if (value < current.value) {
                if (!current.left) {
                    current.left = node;
                    break;
                }
                current = current.left;
            } else {
                if (!current.right) {
                    current.right = node;
                    break;
                }
            }
        }
    }
    
    search(value) {
        let current = this.root;
        while (current && current.value !== value) {
            current = value < current.value ? current.left : current.right;
            if (!current) return false;
        }
        return true;
    }
}`,
            bugs: ['Missing current = current.right in insert', 'Incorrect return in search'],
            solution: `class BinarySearchTree {
    constructor() {
        this.root = null;
    }
    
    insert(value) {
        const node = { value, left: null, right: null };
        if (!this.root) {
            this.root = node;
            return;
        }
        
        let current = this.root;
        while (true) {
            if (value < current.value) {
                if (!current.left) {
                    current.left = node;
                    break;
                }
                current = current.left;
            } else {
                if (!current.right) {
                    current.right = node;
                    break;
                }
                current = current.right;
            }
        }
    }
    
    search(value) {
        let current = this.root;
        while (current && current.value !== value) {
            current = value < current.value ? current.left : current.right;
        }
        return current !== null;
    }
}`,
            testCases: [
                { input: ['insert(5)', 'insert(3)', 'search(3)'], expected: true },
                { input: ['search(7)'], expected: false }
            ],
            hint: 'Check tree traversal and node updates'
        }
    ]
};

// Initialize game instructions
gameInstructions.addStyles();
const instructionsPanel = gameInstructions.createPanel(
    'Code Debugger Instructions',
    [
        'Find and fix bugs in the provided code',
        'Run test cases to verify your fixes',
        'Complete challenges before time runs out',
        'Use the hints if you need help'
    ],
    [
        'Look for common programming mistakes',
        'Check array bounds and edge cases',
        'Verify all code paths'
    ]
);

document.querySelector('.game-header').after(instructionsPanel);

function getRandomChallenge() {
    const level = currentLevel === 1 ? 'beginner' :
                 currentLevel === 2 ? 'intermediate' : 'advanced';
    
    const levelChallenges = challenges[level];
    return levelChallenges[Math.floor(Math.random() * levelChallenges.length)];
}

function displayChallenge() {
    currentChallenge = getRandomChallenge();
    document.getElementById('code-display').textContent = currentChallenge.code;
    document.getElementById('bugs-list').innerHTML = currentChallenge.bugs
        .map(bug => `<li>${bug}</li>`)
        .join('');
    document.getElementById('test-cases').innerHTML = currentChallenge.testCases
        .map(test => `<div>Input: ${JSON.stringify(test.input)} → Expected: ${test.expected}</div>`)
        .join('');
}

function checkSolution() {
    const userCode = document.getElementById('code-input').value;
    try {
        // Create a safe evaluation environment
        const testFunction = new Function('return ' + userCode)();
        
        // Run test cases
        const results = currentChallenge.testCases.map(test => {
            try {
                const result = testFunction(...test.input);
                return result === test.expected;
            } catch (e) {
                return false;
            }
        });
        
        if (results.every(r => r)) {
            const timeBonus = Math.max(60 - (180 - seconds), 0);
            score += (50 + timeBonus) * currentLevel;
            document.getElementById('score').textContent = score;
            celebrations.showSuccess();
            nextChallenge();
        } else {
            mistakes++;
            celebrations.showError();
        }
    } catch (e) {
        mistakes++;
        celebrations.showError();
    }
}

function startTimer() {
    timer = setInterval(() => {
        seconds--;
        document.getElementById('time').textContent = seconds;
        if (seconds <= 0) endGame();
    }, 1000);
}

function endGame() {
    clearInterval(timer);
    const finalScore = score - (mistakes * 5);
    alert(`Game Over! Final Score: ${finalScore}\nMistakes: ${mistakes}`);
    window.location.href = 'index.html';
}

// Event Listeners
document.getElementById('submit-btn').addEventListener('click', checkSolution);
document.getElementById('hint-btn').addEventListener('click', () => {
    document.getElementById('hint').textContent = currentChallenge.hint;
});

// Initialize game
displayChallenge();
startTimer();