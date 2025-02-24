// Stack Overflow Game

const stackOverflow = {
    score: 0,
    gameActive: false,
    currentHeight: 0,
    targetHeight: 100,
    blockWidth: 100,
    fallingSpeed: 2,
    blocks: [],
    codeBlocks: [
        'function()',
        'if (true)',
        'while (i < n)',
        'try {',
        'class Main',
        'const var =',
        'return val',
        'await async',
        'import from',
        'export default'
    ],

    init() {
        this.gameContainer = document.getElementById('game-container');
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.setupGame();
        this.addEventListeners();
    },

    setupGame() {
        this.canvas.width = 800;
        this.canvas.height = 600;
        this.gameContainer.appendChild(this.canvas);
        
        const gameStats = document.createElement('div');
        gameStats.className = 'game-stats';
        gameStats.innerHTML = `
            <div>Score: <span id="score">0</span></div>
            <div>Height: <span id="height">0</span>/${this.targetHeight}</div>
        `;
        this.gameContainer.insertBefore(gameStats, this.canvas);

        const startButton = document.createElement('button');
        startButton.id = 'start-btn';
        startButton.className = 'play-btn';
        startButton.textContent = 'Start Game';
        this.gameContainer.appendChild(startButton);
    },

    addEventListeners() {
        document.getElementById('start-btn').addEventListener('click', () => this.startGame());
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && this.gameActive) {
                this.dropBlock();
            }
        });
    },

    startGame() {
        this.score = 0;
        this.currentHeight = 0;
        this.blocks = [];
        this.gameActive = true;
        document.getElementById('start-btn').disabled = true;
        this.spawnNewBlock();
        this.gameLoop();
    },

    spawnNewBlock() {
        const text = this.codeBlocks[Math.floor(Math.random() * this.codeBlocks.length)];
        const block = {
            x: 0,
            y: 50,
            width: this.blockWidth,
            height: 30,
            text: text,
            moving: true
        };
        this.blocks.push(block);
    },

    dropBlock() {
        const currentBlock = this.blocks[this.blocks.length - 1];
        if (currentBlock && currentBlock.moving) {
            currentBlock.moving = false;
            this.currentHeight += currentBlock.height;
            this.score += 10;
            this.updateScore();
            
            if (this.currentHeight >= this.targetHeight) {
                this.winGame();
                return;
            }
            
            this.spawnNewBlock();
        }
    },

    gameLoop() {
        if (!this.gameActive) return;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw all blocks
        this.blocks.forEach(block => {
            this.ctx.fillStyle = '#3498db';
            this.ctx.fillRect(block.x, block.y, block.width, block.height);
            
            this.ctx.fillStyle = '#fff';
            this.ctx.font = '14px Courier New';
            this.ctx.fillText(block.text, block.x + 5, block.y + 20);
            
            if (block.moving) {
                block.x += this.fallingSpeed;
                if (block.x + block.width > this.canvas.width) {
                    this.fallingSpeed = -Math.abs(this.fallingSpeed);
                } else if (block.x < 0) {
                    this.fallingSpeed = Math.abs(this.fallingSpeed);
                }
            }
        });

        requestAnimationFrame(() => this.gameLoop());
    },

    updateScore() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('height').textContent = this.currentHeight;
    },

    winGame() {
        this.gameActive = false;
        document.getElementById('start-btn').disabled = false;
        alert(`Congratulations! You've reached the height goal with a score of ${this.score}!`);
    },

    endGame() {
        this.gameActive = false;
        document.getElementById('start-btn').disabled = false;
        alert(`Game Over! Final score: ${this.score}`);
    }
};

document.addEventListener('DOMContentLoaded', () => stackOverflow.init());