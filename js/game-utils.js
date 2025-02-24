// Utility functions for game celebrations and instructions

const confetti = {
    create(colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff']) {
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.top = '0';
        container.style.left = '0';
        container.style.width = '100%';
        container.style.height = '100%';
        container.style.pointerEvents = 'none';
        container.style.zIndex = '9999';
        document.body.appendChild(container);

        for (let i = 0; i < 100; i++) {
            const particle = document.createElement('div');
            particle.style.position = 'absolute';
            particle.style.width = '10px';
            particle.style.height = '10px';
            particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = '-10px';
            container.appendChild(particle);

            const animation = particle.animate([
                { transform: 'translate3d(0, 0, 0)', opacity: 1 },
                { transform: `translate3d(${Math.random() * 100 - 50}px, ${window.innerHeight}px, 0)`, opacity: 0 }
            ], {
                duration: 1000 + Math.random() * 2000,
                easing: 'cubic-bezier(0, .9, .57, 1)',
                delay: Math.random() * 1000
            });

            animation.onfinish = () => particle.remove();
        }

        setTimeout(() => container.remove(), 4000);
    }
};

const celebrations = {
    showAdvancedSuccess() {
        confetti.create();
        this.showMessage('Impressive work! 🎉 You\'ve mastered a challenging problem!');
    },

    showBeginnerSuccess() {
        this.showMessage('Good job! 🌟 Keep practicing to tackle harder challenges!');
    },

    showMessage(text, duration = 3000) {
        const message = document.createElement('div');
        message.style.position = 'fixed';
        message.style.top = '20px';
        message.style.left = '50%';
        message.style.transform = 'translateX(-50%)';
        message.style.backgroundColor = 'rgba(52, 152, 219, 0.9)';
        message.style.color = '#fff';
        message.style.padding = '15px 30px';
        message.style.borderRadius = '5px';
        message.style.zIndex = '10000';
        message.style.fontFamily = '"Courier New", monospace';
        message.textContent = text;
        document.body.appendChild(message);

        setTimeout(() => {
            message.style.transition = 'opacity 0.5s';
            message.style.opacity = '0';
            setTimeout(() => message.remove(), 500);
        }, duration);
    }

};

const gameInstructions = {

// Export utilities after all declarations
window.celebrations = celebrations;
window.gameInstructions = gameInstructions;
window.confetti = confetti;
    createPanel(title, instructions, hints) {
        const panel = document.createElement('div');
        panel.className = 'instructions-panel collapsed';
        
        const header = document.createElement('div');
        header.className = 'instructions-header';
        header.innerHTML = `<h3>${title}</h3><span class="toggle-btn">+</span>`;
        
        const content = document.createElement('div');
        content.className = 'instructions-content';
        content.innerHTML = `
            <div class="instructions">
                <h4>How to Play:</h4>
                <ul>
                    ${instructions.map(inst => `<li>${inst}</li>`).join('')}
                </ul>
                ${hints ? `
                    <h4>Hints:</h4>
                    <ul>
                        ${hints.map(hint => `<li>${hint}</li>`).join('')}
                    </ul>
                ` : ''}
            </div>
        `;
        
        header.addEventListener('click', () => {
            panel.classList.toggle('collapsed');
            header.querySelector('.toggle-btn').textContent = 
                panel.classList.contains('collapsed') ? '+' : '-';
        });
        
        panel.appendChild(header);
        panel.appendChild(content);
        return panel;
    },

    addStyles() {
        if (!document.getElementById('instruction-styles')) {
            const style = document.createElement('style');
            style.id = 'instruction-styles';
            style.textContent = `
                .instructions-panel {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 8px;
                    margin: 1rem 0;
                    max-width: 400px;
                    overflow: hidden;
                }
                .instructions-header {
                    padding: 1rem 1.5rem;
                    cursor: pointer;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    background: rgba(255, 255, 255, 0.05);
                }
                .instructions-content {
                    padding: 1.5rem;
                    max-height: 500px;
                    transition: max-height 0.3s ease-out;
                }
                .instructions-panel.collapsed .instructions-content {
                    max-height: 0;
                    padding: 0 1.5rem;
                    overflow: hidden;
                }
                .toggle-btn {
                    font-size: 1.5rem;
                    font-weight: bold;
                    color: var(--secondary-color);
                }
                .instructions-panel h3 {
                    color: var(--secondary-color);
                    margin-bottom: 1rem;
                }
                .instructions-panel h4 {
                    color: var(--accent-color);
                    margin: 1rem 0 0.5rem;
                }
                .instructions-panel ul {
                    list-style-type: none;
                    padding-left: 1rem;
                }
                .instructions-panel li {
                    margin-bottom: 0.5rem;
                    position: relative;
                }
                .instructions-panel li:before {
                    content: '→';
                    position: absolute;
                    left: -1rem;
                    color: var(--secondary-color);
                }
            `;
            document.head.appendChild(style);
        }
    }
};