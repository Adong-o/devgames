// Game Filtering System

const gameFilter = {
    init() {
        this.createFilterUI();
        this.addEventListeners();
    },

    createFilterUI() {
        const header = document.querySelector('header');
        const filterContainer = document.createElement('div');
        filterContainer.className = 'filter-container';
        filterContainer.innerHTML = `
            <div class="filter-buttons">
                <button class="filter-btn active" data-difficulty="all">All Games</button>
                <button class="filter-btn" data-difficulty="beginner">Beginner</button>
                <button class="filter-btn" data-difficulty="intermediate">Intermediate</button>
                <button class="filter-btn" data-difficulty="advanced">Advanced</button>
                <button class="filter-btn" data-difficulty="expert">Expert</button>
            </div>
        `;

        const style = document.createElement('style');
        style.textContent = `
            .filter-container {
                text-align: center;
                margin: 2rem 0;
            }

            .filter-buttons {
                display: flex;
                justify-content: center;
                gap: 1rem;
                flex-wrap: wrap;
            }

            .filter-btn {
                padding: 0.5rem 1rem;
                border: none;
                border-radius: 5px;
                background: rgba(255, 255, 255, 0.1);
                color: var(--text-color);
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .filter-btn:hover {
                background: rgba(255, 255, 255, 0.2);
            }

            .filter-btn.active {
                background: var(--secondary-color);
            }

            .game-card.hidden {
                display: none;
            }

            @media (max-width: 768px) {
                .filter-buttons {
                    gap: 0.5rem;
                }

                .filter-btn {
                    padding: 0.4rem 0.8rem;
                    font-size: 0.9rem;
                }
            }
        `;

        document.head.appendChild(style);
        header.after(filterContainer);
    },

    addEventListeners() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const gameCards = document.querySelectorAll('.game-card');

        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                const difficulty = button.dataset.difficulty;

                // Filter games
                gameCards.forEach(card => {
                    if (difficulty === 'all') {
                        card.classList.remove('hidden');
                    } else {
                        card.classList.toggle(
                            'hidden',
                            !card.classList.contains(difficulty)
                        );
                    }
                });
            });
        });
    }
};

// Initialize the filter system when the page loads
document.addEventListener('DOMContentLoaded', () => gameFilter.init());