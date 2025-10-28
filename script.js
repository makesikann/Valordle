// ============================================
// VALORDLE - Frontend Game Logic
// ============================================

// Embedded player names (EMEA only)
const PLAYERS = [
  "RIENS", "CLOUD", "PROFEK", "MAGNUM", "CHHIA", "JAMPPI", "KICKS", "DERKE",
  "KOVAQ", "PAURA", "KEIKO", "KAAJAK", "RUXIC", "QRAXS", "KAMYK", "PROXH",
  "VEQJ", "MOLSI", "AVOVA", "PENNY", "CREWEN", "LOITA", "LAROK", "NEKKY",
  "AUDAZ", "FAVIAN", "YIGOX", "BRAVE", "ANIMA", "CYDERX", "GLOVEE", "JRAYN",
  "VENTT", "TURKO", "TREXX", "REAZY", "RENSZ", "BURZZY", "MERSA", "OXMANN",
  "ORONI", "STERBEN", "GLOOMY", "TOUVEN", "SKYLEN", "SPEAR", "KABZI", "STURNN",
  "DERREK", "ASUNA", "KEZNIT", "XENOM", "VERNO", "ASPAS", "ETHAN", "BRAWK",
  "SKUBA", "JOHNQT", "ZEKKEN", "VALYN", "TRENT", "JONAHP", "KARON", "METEOR",
  "AIMDLL", "LEGOO", "BEYAZ", "MASIC", "REDGAR", "ZYPPAN"
];

class Valordle {
    constructor() {
        // Game state
        this.maxGuesses = 6;
        this.wordLength = 5;
        this.currentGuess = '';
        this.currentRow = 0;
        this.gameOver = false;
        this.secretWord = '';
        this.guesses = [];
        // Word list (EMEA only)
        this.wordList = PLAYERS;
        
        // DOM elements
        this.gameBoard = document.getElementById('gameBoard');
        this.keyboard = document.getElementById('keyboard');
        this.message = document.getElementById('message');
        
        // Initialize game
        this.init();
    }
    
    // Seeded random generator
    seededRandom(seed) {
        const x = Math.sin(seed + 12321) * 10000;
        return x - Math.floor(x);
    }
    
    async init() {
        try {
            // Translate page
            translatePage();
            updateLanguageButtons();
            
            this.attachEventListeners();
            
            // Check if day has changed, reset if needed
            const today = this.getDayNumber();
            const savedDay = localStorage.getItem('valordle_day');
            
            // Check if day changed
            if ((savedDay !== null && parseInt(savedDay) !== today)) {
                localStorage.removeItem('valordle_state');
            }
            
            localStorage.setItem('valordle_day', today.toString());
            
            this.loadGameState();
            
            // Create board after loading game state (wordLength will be set)
            this.createBoard();
            
            // Render guesses if loading from state (skip animations)
            if (this.isLoadingState && this.guesses.length > 0) {
                this.guesses.forEach((guess, index) => {
                    this.renderGuess(guess, index, true);
                });
                
                if (this.showResultFlag) {
                    setTimeout(() => this.showResult(), 500);
                }
            }
            
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
    // Game State Management
    // ============================================
    
    getDayNumber() {
        const start = new Date(2025, 9, 27); // October 27, 2025
        const today = new Date();
        const diff = today - start;
        return Math.floor(diff / (1000 * 60 * 60 * 24));
    }
    
    getDailyWord() {
        const dayNumber = this.getDayNumber();
        const randomValue = this.seededRandom(dayNumber);
        const index = Math.floor(randomValue * this.wordList.length);
        const word = this.wordList[index];
        this.wordLength = word.length;
        return word;
    }
    
    async loadGameState() {
        const dayNumber = this.getDayNumber();
        const stateKey = 'valordle_state';
        const savedState = localStorage.getItem(stateKey);
        
        if (savedState) {
            try {
                const state = JSON.parse(savedState);
                
                if (state.dayNumber === dayNumber) {
                    this.secretWord = state.secretWord;
                    this.wordLength = this.secretWord.length;
                    this.currentRow = state.currentRow;
                    this.guesses = state.guesses || [];
                    this.gameOver = state.gameOver || false;
                    this.isLoadingState = true; // Flag to render after board is created
                    
                    if (this.gameOver) {
                        this.showResultFlag = true;
                    }
                    
                    return;
                }
            } catch (e) {
                console.error('Error loading game state:', e);
            }
        }
        
        this.startNewGame();
    }
    
    saveGameState() {
        const stateKey = 'valordle_state';
        const state = {
            dayNumber: this.getDayNumber(),
            secretWord: this.secretWord,
            currentRow: this.currentRow,
            guesses: this.guesses,
            gameOver: this.gameOver
        };
        localStorage.setItem(stateKey, JSON.stringify(state));
    }
    
    startNewGame() {
        this.secretWord = this.getDailyWord();
        // wordLength is now set by getDailyWord()
        this.currentRow = 0;
        this.currentGuess = '';
        this.guesses = [];
        this.gameOver = false;
        this.createBoard();
        this.resetKeyboard();
        this.saveGameState();
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
    
    renderGuess(guess, rowIndex, skipAnimation = false) {
        const result = this.checkGuess(guess);
        
        result.forEach((status, colIndex) => {
            const tile = document.querySelector(`[data-row="${rowIndex}"][data-col="${colIndex}"]`);
            if (tile) {
                const delay = skipAnimation ? 0 : colIndex * 100;
                setTimeout(() => {
                    tile.textContent = guess[colIndex];
                    if (!skipAnimation) {
                        tile.classList.add('tile-flip');
                    }
                    tile.classList.add(`tile-${status}`);
                    this.updateKeyboard(guess[colIndex], status);
                }, delay);
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
        
        this.guesses.push(this.currentGuess);
        this.renderGuess(this.currentGuess, this.currentRow);
        
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
        
        this.currentRow++;
        this.currentGuess = '';
        this.saveGameState();
    }
    
    checkGuess(guess) {
        const result = [];
        const secretLetters = this.secretWord.split('');
        const guessLetters = guess.split('');
        
        const used = new Array(this.wordLength).fill(false);
        for (let i = 0; i < this.wordLength; i++) {
            if (guessLetters[i] === secretLetters[i]) {
                result[i] = 'correct';
                used[i] = true;
            }
        }
        
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
        
        text += '\nhttps://valordle-lovat.vercel.app/';
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
    
    copyResults() {
        const text = this.generateShareText();
        this.copyToClipboard(text);
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
        // Try modern Clipboard API first
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text).then(() => {
                this.showMessage(t('copied'));
            }).catch(() => {
                this.fallbackCopy(text);
            });
        } else {
            // Fallback for older browsers and non-secure contexts
            this.fallbackCopy(text);
        }
    }
    
    fallbackCopy(text) {
        try {
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.left = '-999999px';
            textarea.style.top = '-999999px';
            document.body.appendChild(textarea);
            textarea.focus();
            textarea.select();
            const successful = document.execCommand('copy');
            document.body.removeChild(textarea);
            if (successful) {
                this.showMessage(t('copied'));
            } else {
                this.showMessage('Failed to copy');
            }
        } catch (err) {
            this.showMessage('Failed to copy');
        }
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
        document.addEventListener('keydown', (e) => {
            const key = e.key.toUpperCase();
            if (key === 'ENTER' || key === 'BACKSPACE') {
                this.handleKeyPress(key);
            } else if (/^[A-Z]$/.test(key)) {
                this.handleKeyPress(key);
            }
        });
        
        document.querySelectorAll('.key').forEach(key => {
            key.addEventListener('click', () => {
                const keyValue = key.getAttribute('data-key');
                this.handleKeyPress(keyValue);
            });
        });
        
        document.getElementById('howToPlayBtn').addEventListener('click', () => {
            this.showHowToPlay();
        });
        
        const copyBtn = document.getElementById('copyBtn');
        if (copyBtn) {
            copyBtn.addEventListener('click', () => {
                this.copyResults();
            });
        }
        
        const shareBtn = document.getElementById('shareBtn');
        if (shareBtn) {
            shareBtn.addEventListener('click', () => {
                this.shareResults();
            });
        }
        
        document.querySelectorAll('.close').forEach(closeBtn => {
            closeBtn.addEventListener('click', (e) => {
                e.target.closest('.modal').classList.remove('show');
            });
        });
        
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('show');
                }
            });
        });
        
        document.getElementById('langBtn').addEventListener('click', () => {
            document.getElementById('langModal').classList.add('show');
        });
        
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const lang = btn.getAttribute('data-lang');
                setLanguage(lang);
                document.getElementById('langModal').classList.remove('show');
            });
        });
    }
}

// ============================================
// Initialize Game
// ============================================

const game = new Valordle();
