// ============================================
// VALORDLE - Frontend Game Logic (PHP API)
// ============================================

class Valordle {
    constructor() {
        // API configuration
        this.apiUrl = 'api_players.php';
        
        // Game state
        this.maxGuesses = 6;
        this.wordLength = 5;
        this.currentGuess = '';
        this.currentRow = 0;
        this.gameOver = false;
        this.secretWord = '';
        this.guesses = [];
        this.wordList = [];
        
        // DOM elements
        this.gameBoard = document.getElementById('gameBoard');
        this.keyboard = document.getElementById('keyboard');
        this.message = document.getElementById('message');
        
        // Initialize game
        this.init();
    }
    
    async init() {
        try {
            // Translate page
            translatePage();
            updateLanguageButtons();
            
            // Fetch word list from PHP API
            await this.fetchWordList();
            this.createBoard();
            this.attachEventListeners();
            this.loadGameState();
            
            // Show how to play on first visit
            if (!localStorage.getItem('valordle_visited')) {
                this.showHowToPlay();
                localStorage.setItem('valordle_visited', 'true');
            }
        } catch (error) {
            console.error('Failed to initialize game:', error);
            this.showMessage('Failed to load game. Please refresh.');
        }
    }
    
    // ============================================
    // API Communication
    // ============================================
    
    async fetchWordList() {
        try {
            const response = await fetch(`${this.apiUrl}?action=player-names`);
            if (!response.ok) throw new Error('Failed to fetch player names');
            const data = await response.json();
            this.wordList = data.playerNames;
            console.log(`Loaded ${this.wordList.length} player names from server`);
        } catch (error) {
            console.error('Error fetching player names:', error);
            throw error;
        }
    }
    
    async getDailyWord() {
        try {
            const response = await fetch(`${this.apiUrl}?action=daily-player-word`);
            if (!response.ok) throw new Error('Failed to fetch daily word');
            const data = await response.json();
            return data.dailyWord;
        } catch (error) {
            console.error('Error fetching daily word:', error);
            throw error;
        }
    }
    
    // ============================================
    // Game State Management
    // ============================================
    
    getDayNumber() {
        // Get day number since epoch (for consistent daily words)
        const start = new Date(2024, 0, 1);
        const today = new Date();
        const diff = today - start;
        return Math.floor(diff / (1000 * 60 * 60 * 24));
    }
    
    async loadGameState() {
        const dayNumber = this.getDayNumber();
        const savedState = localStorage.getItem('valordle_state');
        
        if (savedState) {
            try {
                const state = JSON.parse(savedState);
                
                // Check if it's the same day
                if (state.dayNumber === dayNumber) {
                    this.secretWord = state.secretWord;
                    this.currentRow = state.currentRow;
                    this.guesses = state.guesses || [];
                    this.gameOver = state.gameOver || false;
                    
                    // Restore board state
                    this.guesses.forEach((guess, index) => {
                        this.renderGuess(guess, index);
                    });
                    
                    // Show result if game was completed
                    if (this.gameOver) {
                        setTimeout(() => this.showResult(), 500);
                    }
                    
                    return;
                }
            } catch (e) {
                console.error('Error loading game state:', e);
            }
        }
        
        // Start new game
        await this.startNewGame();
    }
    
    saveGameState() {
        const state = {
            dayNumber: this.getDayNumber(),
            secretWord: this.secretWord,
            currentRow: this.currentRow,
            guesses: this.guesses,
            gameOver: this.gameOver
        };
        localStorage.setItem('valordle_state', JSON.stringify(state));
    }
    
    async startNewGame() {
        try {
            this.secretWord = await this.getDailyWord();
            this.currentRow = 0;
            this.currentGuess = '';
            this.guesses = [];
            this.gameOver = false;
            this.createBoard();
            this.resetKeyboard();
            this.saveGameState();
        } catch (error) {
            this.showMessage('Failed to load daily word');
            console.error(error);
        }
    }
    
    // ============================================
    // Board Management
    // ============================================
    
    createBoard() {
        this.gameBoard.innerHTML = '';
        
        for (let i = 0; i < this.maxGuesses; i++) {
            const row = document.createElement('div');
            row.className = 'board-row';
            
            for (let j = 0; j < this.wordLength; j++) {
                const tile = document.createElement('div');
                tile.className = 'tile';
                tile.setAttribute('data-row', i);
                tile.setAttribute('data-col', j);
                row.appendChild(tile);
            }
            
            this.gameBoard.appendChild(row);
        }
    }
    
    updateBoard() {
        for (let i = 0; i < this.wordLength; i++) {
            const tile = document.querySelector(`[data-row="${this.currentRow}"][data-col="${i}"]`);
            if (tile) {
                tile.textContent = this.currentGuess[i] || '';
                tile.classList.toggle('filled', i < this.currentGuess.length);
            }
        }
    }
    
    renderGuess(guess, rowIndex) {
        const result = this.checkGuess(guess);
        
        result.forEach((status, colIndex) => {
            const tile = document.querySelector(`[data-row="${rowIndex}"][data-col="${colIndex}"]`);
            if (tile) {
                setTimeout(() => {
                    tile.textContent = guess[colIndex];
                    tile.classList.add(`tile-${status}`);
                    this.updateKeyboard(guess[colIndex], status);
                }, colIndex * 100);
            }
        });
    }
    
    // ============================================
    // Game Logic
    // ============================================
    
    handleKeyPress(key) {
        if (this.gameOver) return;
        
        if (key === 'ENTER') {
            this.submitGuess();
        } else if (key === 'BACKSPACE') {
            this.currentGuess = this.currentGuess.slice(0, -1);
            this.updateBoard();
        } else if (this.currentGuess.length < this.wordLength && /^[A-Z]$/.test(key)) {
            this.currentGuess += key;
            this.updateBoard();
        }
    }
    
    submitGuess() {
        if (this.currentGuess.length !== this.wordLength) {
            this.showMessage(t('notEnoughLetters'));
            return;
        }
        
        if (!this.wordList.includes(this.currentGuess)) {
            this.showMessage(t('notInWordList'));
            return;
        }
        
        // Add guess
        this.guesses.push(this.currentGuess);
        this.renderGuess(this.currentGuess, this.currentRow);
        
        // Check win condition
        if (this.currentGuess === this.secretWord) {
            this.gameOver = true;
            setTimeout(() => {
                this.showMessage(t('headshot'));
                this.showResult();
            }, this.wordLength * 100 + 500);
        } else if (this.currentRow === this.maxGuesses - 1) {
            this.gameOver = true;
            setTimeout(() => {
                this.showMessage(`${t('wordWas')} ${this.secretWord}`);
                this.showResult();
            }, this.wordLength * 100 + 500);
        }
        
        // Move to next row
        this.currentRow++;
        this.currentGuess = '';
        this.saveGameState();
    }
    
    checkGuess(guess) {
        const result = [];
        const secretLetters = this.secretWord.split('');
        const guessLetters = guess.split('');
        
        // First pass: mark correct positions
        const used = new Array(this.wordLength).fill(false);
        for (let i = 0; i < this.wordLength; i++) {
            if (guessLetters[i] === secretLetters[i]) {
                result[i] = 'correct';
                used[i] = true;
            }
        }
        
        // Second pass: mark present letters
        for (let i = 0; i < this.wordLength; i++) {
            if (result[i]) continue;
            
            const letterIndex = secretLetters.findIndex((letter, index) => 
                letter === guessLetters[i] && !used[index]
            );
            
            if (letterIndex !== -1) {
                result[i] = 'present';
                used[letterIndex] = true;
            } else {
                result[i] = 'absent';
            }
        }
        
        return result;
    }
    
    // ============================================
    // Keyboard
    // ============================================
    
    updateKeyboard(letter, status) {
        const key = document.querySelector(`[data-key="${letter}"]`);
        if (!key) return;
        
        const currentStatus = key.classList.contains('key-correct') ? 'correct' :
                            key.classList.contains('key-present') ? 'present' :
                            key.classList.contains('key-absent') ? 'absent' : null;
        
        // Only update if new status is better
        if (status === 'correct' || 
            (status === 'present' && currentStatus !== 'correct') ||
            (status === 'absent' && !currentStatus)) {
            key.classList.remove('key-correct', 'key-present', 'key-absent');
            key.classList.add(`key-${status}`);
        }
    }
    
    resetKeyboard() {
        document.querySelectorAll('.key').forEach(key => {
            key.classList.remove('key-correct', 'key-present', 'key-absent');
        });
    }
    
    // ============================================
    // UI Messages
    // ============================================
    
    showMessage(text) {
        this.message.textContent = text;
        setTimeout(() => {
            this.message.textContent = '';
        }, 2000);
    }
    
    // ============================================
    // Result Modal
    // ============================================
    
    showResult() {
        const modal = document.getElementById('resultModal');
        const title = document.getElementById('resultTitle');
        const message = document.getElementById('resultMessage');
        const grid = document.getElementById('resultGrid');
        
        const won = this.guesses[this.guesses.length - 1] === this.secretWord;
        
        if (won) {
            title.textContent = t('victory');
            message.textContent = `${t('foundWord')} ${this.guesses.length}/6 ${t('tries')}!`;
        } else {
            title.textContent = t('eliminated');
            message.textContent = `${t('wordWas')} ${this.secretWord}`;
        }
        
        grid.textContent = this.generateShareText();
        this.updateNextGameTimer();
        
        modal.classList.add('show');
    }
    
    generateShareText() {
        const dayNumber = this.getDayNumber();
        const won = this.guesses[this.guesses.length - 1] === this.secretWord;
        const score = won ? `${this.guesses.length}/6` : 'X/6';
        
        let text = `VALORDLE #${dayNumber}\n${score}\n\n`;
        
        this.guesses.forEach(guess => {
            const result = this.checkGuess(guess);
            result.forEach(status => {
                if (status === 'correct') text += '🟩';
                else if (status === 'present') text += '🟨';
                else text += '⬛';
            });
            text += '\n';
        });
        
        return text;
    }
    
    updateNextGameTimer() {
        const timer = document.getElementById('nextGameTimer');
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        
        const diff = tomorrow - now;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        timer.textContent = `${t('nextGame')} ${hours}h ${minutes}m ${seconds}s`;
        
        setTimeout(() => this.updateNextGameTimer(), 1000);
    }
    
    shareResults() {
        const text = this.generateShareText();
        
        if (navigator.share) {
            navigator.share({
                text: text
            }).catch(() => {
                this.copyToClipboard(text);
            });
        } else {
            this.copyToClipboard(text);
        }
    }
    
    copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            this.showMessage(t('copied'));
        }).catch(() => {
            // Fallback for older browsers
            const textarea = document.createElement('textarea');
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            this.showMessage(t('copied'));
        });
    }
    
    // ============================================
    // Modal Controls
    // ============================================
    
    showHowToPlay() {
        const modal = document.getElementById('howToPlayModal');
        modal.classList.add('show');
    }
    
    // ============================================
    // Event Listeners
    // ============================================
    
    attachEventListeners() {
        // Physical keyboard
        document.addEventListener('keydown', (e) => {
            const key = e.key.toUpperCase();
            if (key === 'ENTER' || key === 'BACKSPACE') {
                this.handleKeyPress(key);
            } else if (/^[A-Z]$/.test(key)) {
                this.handleKeyPress(key);
            }
        });
        
        // On-screen keyboard
        document.querySelectorAll('.key').forEach(key => {
            key.addEventListener('click', () => {
                const keyValue = key.getAttribute('data-key');
                this.handleKeyPress(keyValue);
            });
        });
        
        // Language button
        document.getElementById('langBtn').addEventListener('click', () => {
            document.getElementById('langModal').classList.add('show');
        });
        
        // Language selection
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const lang = btn.getAttribute('data-lang');
                setLanguage(lang);
                document.getElementById('langModal').classList.remove('show');
            });
        });
        
        // How to play button
        document.getElementById('howToPlayBtn').addEventListener('click', () => {
            this.showHowToPlay();
        });
        
        // Share button
        document.getElementById('shareBtn').addEventListener('click', () => {
            this.shareResults();
        });
        
        // Close modals
        document.querySelectorAll('.close').forEach(closeBtn => {
            closeBtn.addEventListener('click', (e) => {
                e.target.closest('.modal').classList.remove('show');
            });
        });
        
        // Close modal on outside click
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('show');
                }
            });
        });
    }
}

// ============================================
// Initialize Game
// ============================================

const game = new Valordle();
