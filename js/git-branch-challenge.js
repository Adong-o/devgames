// Git Branch Challenge Game Implementation

let currentLevel = 1;
let score = 0;
let timer;
let seconds = 0;
let currentBranch = 'main';
let branches = ['main'];
let commits = [];

// Game levels with their respective challenges
const levels = [
    {
        description: 'Create a new branch called "feature" from main and make a commit.',
        difficulty: 'Easy',
        solution: ['git branch feature', 'git checkout feature', 'git commit -m "feat: add new feature"'],
        initialState: {
            branches: ['main'],
            commits: [{ id: 1, message: 'Initial commit', branch: 'main' }]
        }
    },
    {
        description: 'Merge your feature branch back into main.',
        difficulty: 'Easy',
        solution: ['git checkout main', 'git merge feature'],
        initialState: {
            branches: ['main', 'feature'],
            commits: [
                { id: 1, message: 'Initial commit', branch: 'main' },
                { id: 2, message: 'Add feature', branch: 'feature' }
            ]
        }
    },
    {
        description: 'Create a hotfix branch, make a commit, and merge it to both main and develop branches.',
        difficulty: 'Medium',
        solution: [
            'git branch hotfix',
            'git checkout hotfix',
            'git commit -m "fix: critical bug"',
            'git checkout main',
            'git merge hotfix',
            'git checkout develop',
            'git merge hotfix'
        ],
        initialState: {
            branches: ['main', 'develop'],
            commits: [
                { id: 1, message: 'Initial commit', branch: 'main' },
                { id: 2, message: 'Development started', branch: 'develop' }
            ]
        }
    },
    {
        description: 'Resolve a merge conflict between feature and main branches.',
        difficulty: 'Hard',
        solution: [
            'git checkout main',
            'git merge feature',
            'git add .',
            'git commit -m "fix: resolve merge conflict"'
        ],
        initialState: {
            branches: ['main', 'feature'],
            commits: [
                { id: 1, message: 'Initial commit', branch: 'main' },
                { id: 2, message: 'Update main', branch: 'main' },
                { id: 3, message: 'Update feature', branch: 'feature' }
            ],
            conflict: true
        }
    }
];

// Initialize game instructions
gameInstructions.addStyles();
const instructionsPanel = gameInstructions.createPanel(
    'Git Branch Challenge Instructions',
    [
        'Enter git commands to complete each challenge',
        'Create, switch, and merge branches as needed',
        'Complete tasks with the minimum number of commands',
        'Progress through increasingly complex git scenarios'
    ],
    [
        'Remember basic git commands',
        'Plan your branching strategy',
        'Think about the git workflow'
    ]
);

document.querySelector('.game-header').after(instructionsPanel);

function initializeLevel() {
    const level = levels[currentLevel - 1];
    document.getElementById('level').textContent = currentLevel;
    document.getElementById('score').textContent = score;
    document.getElementById('challengeDescription').textContent = level.description;

    // Reset game state
    branches = [...level.initialState.branches];
    commits = [...level.initialState.commits];
    currentBranch = 'main';

    // Clear command history
    document.getElementById('commandHistory').innerHTML = '';
    document.getElementById('commandInput').value = '';

    document.querySelector('.next-btn').disabled = true;
    renderGitTree();
}

function renderGitTree() {
    const gitTree = document.getElementById('gitTree');
    gitTree.innerHTML = '';

    // Render branches
    branches.forEach((branch, index) => {
        const branchElement = document.createElement('div');
        branchElement.className = 'branch';
        branchElement.textContent = branch;
        branchElement.style.top = `${50 + index * 50}px`;
        branchElement.style.left = '20px';
        gitTree.appendChild(branchElement);
    });

    // Render commits
    commits.forEach((commit, index) => {
        const commitElement = document.createElement('div');
        commitElement.className = 'commit';
        commitElement.textContent = commit.id;
        commitElement.title = commit.message;
        commitElement.style.top = `${50 + branches.indexOf(commit.branch) * 50}px`;
        commitElement.style.left = `${100 + index * 80}px`;
        gitTree.appendChild(commitElement);
    });
}

function executeCommand() {
    const command = document.getElementById('commandInput').value.trim();
    const history = document.getElementById('commandHistory');
    history.innerHTML += `$ ${command}\n`;

    const level = levels[currentLevel - 1];
    const validCommand = validateGitCommand(command);

    if (validCommand) {
        processGitCommand(command);
        history.innerHTML += 'Command executed successfully.\n';

        // Check if level is complete
        if (checkLevelComplete()) {
            const timeBonus = Math.max(300 - seconds, 0);
            const difficultyMultiplier = level.difficulty === 'Hard' ? 3 : 
                                       level.difficulty === 'Medium' ? 2 : 1;
            const levelScore = (100 * difficultyMultiplier) + Math.floor(timeBonus * difficultyMultiplier / 2);
            score += levelScore;

            if (currentLevel === levels.length) {
                celebrations.showAdvancedSuccess();
                setTimeout(() => celebrations.showMessage(
                    `🏆 Amazing! You've completed all levels!\nTime Bonus: +${timeBonus}\nScore: +${levelScore}`, 
                    5000
                ), 1500);
            } else {
                celebrations.showBeginnerSuccess();
                document.querySelector('.next-btn').disabled = false;
                celebrations.showMessage(
                    `🌟 Level Complete!\nTime Bonus: +${timeBonus}\nScore: +${levelScore}`, 
                    3000
                );
            }
        }
    } else {
        history.innerHTML += 'Invalid git command. Try again.\n';
    }

    history.scrollTop = history.scrollHeight;
    document.getElementById('commandInput').value = '';
}

function validateGitCommand(command) {
    const validCommands = [
        /^git (branch|checkout|merge|commit|add) .+$/,
        /^git branch$/,
        /^git status$/
    ];

    return validCommands.some(pattern => pattern.test(command));
}

function processGitCommand(command) {
    const parts = command.split(' ');
    
    switch(parts[1]) {
        case 'branch':
            if (parts[2]) branches.push(parts[2]);
            break;
        case 'checkout':
            if (branches.includes(parts[2])) currentBranch = parts[2];
            break;
        case 'merge':
            if (branches.includes(parts[2])) {
                commits.push({
                    id: commits.length + 1,
                    message: `Merge ${parts[2]} into ${currentBranch}`,
                    branch: currentBranch
                });
            }
            break;
        case 'commit':
            commits.push({
                id: commits.length + 1,
                message: parts.slice(3).join(' ').replace(/"/g, ''),
                branch: currentBranch
            });
            break;
    }

    renderGitTree();
}

function checkLevelComplete() {
    const level = levels[currentLevel - 1];
    const history = document.getElementById('commandHistory').innerText;
    const commands = history.split('\n')
        .filter(line => line.startsWith('$'))
        .map(line => line.substring(2).trim());

    return level.solution.every(cmd => commands.some(userCmd => 
        userCmd.startsWith(cmd) || cmd.startsWith(userCmd)
    ));
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
    document.getElementById('commandInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') executeCommand();
    });
});