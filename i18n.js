// ============================================
// VALORDLE - Translations (i18n)
// ============================================

const translations = {
    en: {
        howToPlay: "HOW TO PLAY",
        guess: "Guess the VALORANT word in 6 tries",
        validWords: "Every guess will be a valid 5 or 6 letter Valorant esports player (from VCT EMEA + Türkiye Birlik or Americas).",
        colorInfo: "The color of the tiles will change to show how close your guess was to the word.",
        examples: "Examples:",
        
        green: "Green (Headshot!)",
        greenDesc: "The letter is in the word and in the correct spot.",
        yellow: "Yellow (Lit!)",
        yellowDesc: "The letter is in the word but in the wrong spot.",
        gray: "Gray (Miss!)",
        grayDesc: "The letter is not in the word in any spot.",
        
        daily: "A new VALORDLE will be available each day!",
        
        notEnoughLetters: "Not enough letters!",
        notInWordList: "Not in word list!",
        headshot: "HEADSHOT! 🎯",
        eliminated: "ELIMINATED",
        victory: "🎯 VICTORY!",
        wordWas: "The word was:",
        tries: "tries",
        
        foundWord: "You found the word in",
        of: "of",
        nextGame: "Next VALORDLE in",
        
        share: "SHARE",
        copied: "Copied to clipboard!",
        
        selectLanguage: "SELECT LANGUAGE",
    },
    tr: {
        howToPlay: "NASIL OYNANIR?",
        guess: "VALORANT kelimesini 6 denemede bul.",
        validWords: "Her tahmin geçerli bir 5 veya 6 harfli Valorant esporcusu olacaktır (VCT EMEA + Türkiye Birlik veya Amerika).",
        colorInfo: "Taşlar rengini değiştirerek tahminin kelimeye ne kadar yakın olduğunu gösterecektir.",
        examples: "Örnekler:",
        
        green: "Yeşil (Headshot!)",
        greenDesc: "Harf kelimede ve doğru pozisyonda.",
        yellow: "Sarı (Lit!)",
        yellowDesc: "Harf kelimede ancak yanlış pozisyonda.",
        gray: "Gri (Miss!)",
        grayDesc: "Harf kelimede hiç bulunmuyor.",
        
        daily: "Her gün yeni bir VALORDLE olacak!",
        
        notEnoughLetters: "Yeterli harf yok!",
        notInWordList: "Kelime listesinde yok!",
        headshot: "HEADSHOT! 🎯",
        eliminated: "ELİMİNE OLDUM",
        victory: "🎯 ZAFER!",
        wordWas: "Kelime şuydu:",
        tries: "deneme",
        
        foundWord: "Kelimeyi bulduğun deneme sayısı",
        of: "of",
        nextGame: "Sonraki VALORDLE'ye",
        
        share: "PAYLAŞ",
        copied: "Panoya kopyalandı!",
        
        selectLanguage: "DİL SEÇ",
    }
};

function t(key) {
    const lang = localStorage.getItem('valordle_lang') || 'en';
    return translations[lang]?.[key] || translations.en[key] || key;
}

function translatePage() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        el.textContent = t(key);
    });
}

function setLanguage(lang) {
    localStorage.setItem('valordle_lang', lang);
    translatePage();
    updateLanguageButtons();
}

function updateLanguageButtons() {
    const lang = localStorage.getItem('valordle_lang') || 'en';
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-lang') === lang) {
            btn.classList.add('active');
        }
    });
}

function getCurrentLanguage() {
    return localStorage.getItem('valordle_lang') || 'en';
}

function setRegion(region) {
    localStorage.setItem('valordle_region', region);
    updateRegionButtons();
    location.reload();
}

function getRegion() {
    return localStorage.getItem('valordle_region') || 'emea';
}

function updateRegionButtons() {
    const region = getRegion();
    document.querySelectorAll('.region-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-region') === region) {
            btn.classList.add('active');
        }
    });
}
