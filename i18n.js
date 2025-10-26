// ============================================
// VALORDLE - Translations (i18n)
// ============================================

const translations = {
    en: {
        // Game UI
        howToPlay: "HOW TO PLAY",
        guess: "Guess the VALORANT word in 6 tries",
        validWords: "Each guess must be a valid 5-letter Valorant term (agents, abilities, tactics, map callouts)",
        colorInfo: "The color of the tiles will change to show how close your guess was to the word.",
        examples: "Examples:",
        
        // Colors
        green: "Green (Headshot!)",
        greenDesc: "The letter is in the word and in the correct spot.",
        yellow: "Yellow (Lit!)",
        yellowDesc: "The letter is in the word but in the wrong spot.",
        gray: "Gray (Miss!)",
        grayDesc: "The letter is not in the word in any spot.",
        
        daily: "A new VALORDLE will be available each day!",
        
        // Messages
        notEnoughLetters: "Not enough letters!",
        notInWordList: "Not in word list!",
        headshot: "HEADSHOT! 🎯",
        eliminated: "ELIMINATED",
        victory: "🎯 VICTORY!",
        wordWas: "The word was:",
        tries: "tries",
        
        // Results
        foundWord: "You found the word in",
        of: "of",
        nextGame: "Next VALORDLE in",
        
        // Share
        share: "SHARE",
        copied: "Copied to clipboard!",
        
        // Navigation
        selectLanguage: "SELECT LANGUAGE",
    },
    tr: {
        // Game UI
        howToPlay: "NASIL OYNANIR?",
        guess: "VALORANT kelimesini 6 denemede bul.",
        validWords: "Her tahmin geçerli bir 5 harfli Valorant terimi olmalıdır (ajanlar, yetenekler, taktikler, harita çağrıları).",
        colorInfo: "Taşlar rengini değiştirerek tahminin kelimeye ne kadar yakın olduğunu gösterecektir.",
        examples: "Örnekler:",
        
        // Colors
        green: "Yeşil (Headshot!)",
        greenDesc: "Harf kelimede ve doğru pozisyonda.",
        yellow: "Sarı (Lit!)",
        yellowDesc: "Harf kelimede ancak yanlış pozisyonda.",
        gray: "Gri (Miss!)",
        grayDesc: "Harf kelimede hiç bulunmuyor.",
        
        daily: "Her gün yeni bir VALORDLE olacak!",
        
        // Messages
        notEnoughLetters: "Yeterli harf yok!",
        notInWordList: "Kelime listesinde yok!",
        headshot: "HEADSHOT! 🎯",
        eliminated: "ELİMİNE OLDUM",
        victory: "🎯 ZAFER!",
        wordWas: "Kelime şuydu:",
        tries: "deneme",
        
        // Results
        foundWord: "Kelimeyi bulduğun deneme sayısı",
        of: "of",
        nextGame: "Sonraki VALORDLE'ye",
        
        // Share
        share: "PAYLAŞ",
        copied: "Panoya kopyalandı!",
        
        // Navigation
        selectLanguage: "DİL SEÇ",
    }
};

/**
 * Get translated string
 */
function t(key) {
    const lang = localStorage.getItem('valordle_lang') || 'en';
    return translations[lang]?.[key] || translations.en[key] || key;
}

/**
 * Translate all elements with data-i18n attribute
 */
function translatePage() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        el.textContent = t(key);
    });
}

/**
 * Set language
 */
function setLanguage(lang) {
    localStorage.setItem('valordle_lang', lang);
    translatePage();
    updateLanguageButtons();
}

/**
 * Update language button states
 */
function updateLanguageButtons() {
    const lang = localStorage.getItem('valordle_lang') || 'en';
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-lang') === lang) {
            btn.classList.add('active');
        }
    });
}

/**
 * Get current language
 */
function getCurrentLanguage() {
    return localStorage.getItem('valordle_lang') || 'en';
}
