// Bug Squash Game

const bugSquash = {
    score: 0,
    timeLeft: 60,
    gameActive: false,
    bugInterval: null,
    codeSnippets: [
        'function calculateSum(a, b) {\n    retrun a + b;\n}',
        'for (let i = 0; i <= array.length; i++) {\n    console.log(array[i]);\n}',
        'if (userInput = "yes") {\n    proceedWithAction();\n}',
        'const data == fetchData();\nprocessData(data);'
    ],

    init() {
        this.gameContainer = document.getElementById('game-container');
        this.scoreDisplay = document.getElementById('score');
        this.timeDisplay = document.getElementById('time');
        this.startButton = document.getElementById('start-btn');
        
        this.startButton.addEventListener('click', () => this.startGame());
        this.setupGameUI();
    },

    setupGameUI() {
        const gameHTML = `
            <div class="game-stats">
                <div>Score: <span id="score">0</span></div>
                <div>Time: <span id="time">60</span>s</div>
            </div>
            <div class="code-container"></div>
            <button id="start-btn" class="play-btn">Start Game</button>
        `;
        this.gameContainer.innerHTML = gameHTML;
    },

    startGame() {
        this.score = 0;
        this.timeLeft = 60;
        this.gameActive = true;
        this.updateScore();
        this.updateTime();
        this.startButton.disabled = true;
        
        this.spawnBugs();
        this.startTimer();
    },

    spawnBugs() {
        const codeContainer = document.querySelector('.code-container');
        const randomSnippet = this.codeSnippets[Math.floor(Math.random() * this.codeSnippets.length)];
        codeContainer.innerHTML = `<pre>${randomSnippet}</pre>`;

        this.bugInterval = setInterval(() => {
            if (!this.gameActive) return;

            const bug = document.createElement('div');
            bug.className = 'bug';
            bug.style.left = Math.random() * (codeContainer.offsetWidth - 20) + 'px';
            bug.style.top = Math.random() * (codeContainer.offsetHeight - 20) + 'px';
            
            bug.addEventListener('click', () => {
                if (!this.gameActive) return;
                this.score += 10;
                this.updateScore();
                bug.remove();
            });

            codeContainer.appendChild(bug);
            
            setTimeout(() => {
                if (bug && bug.parentNode) {
                    bug.remove();
                }
            }, 2000);
        }, 1000);
    },

    startTimer() {
        const timer = setInterval(() => {
            this.timeLeft--;
            this.updateTime();

            if (this.timeLeft <= 0) {
                this.endGame();
                clearInterval(timer);
            }
        }, 1000);
    },

    updateScore() {
        this.scoreDisplay.textContent = this.score;
    },

    updateTime() {
        this.timeDisplay.textContent = this.timeLeft;
    },

    endGame() {
        this.gameActive = false;
        clearInterval(this.bugInterval);
        this.startButton.disabled = false;
        alert(`Game Over! Your score: ${this.score}`);
    }
};

document.addEventListener('DOMContentLoaded', () => bugSquash.init());