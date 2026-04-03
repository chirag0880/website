// Shared i18n Logic
const supportedLanguages = ['en', 'de', 'es', 'fr', 'it', 'pt'];

function setLanguage(lang) {
    if (!supportedLanguages.includes(lang)) lang = 'en';
    
    localStorage.setItem('language', lang);
    const languageSelect = document.getElementById('language-select');
    if (languageSelect) languageSelect.value = lang;
    
    updateContent(lang);
    document.documentElement.lang = lang;
}

function updateContent(lang) {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (typeof translations !== 'undefined' && translations[lang] && translations[lang][key]) {
            if (translations[lang][key].includes('<span')) {
                el.innerHTML = translations[lang][key];
            } else {
                el.textContent = translations[lang][key];
            }
        }
    });

    // Special case for show more button text
    const showMoreBtn = document.getElementById('show-more-skills');
    if (showMoreBtn) {
        const isShowingAll = showMoreBtn.getAttribute('data-showing-all') === 'true';
        showMoreBtn.textContent = translations[lang][isShowingAll ? 'skill_show_less' : 'skill_show_more'];
    }
}

function autoDetectLanguage() {
    const savedLang = localStorage.getItem('language');
    if (savedLang) return savedLang;

    const browserLang = navigator.language.split('-')[0];
    return supportedLanguages.includes(browserLang) ? browserLang : 'en';
}

function t(key) {
    const lang = localStorage.getItem('language') || 'en';
    if (typeof translations !== 'undefined' && translations[lang] && translations[lang][key]) {
        return translations[lang][key];
    }
    return key;
}

document.addEventListener("DOMContentLoaded", () => {
    const initialLang = autoDetectLanguage();
    setLanguage(initialLang);

    const languageSelect = document.getElementById('language-select');
    if (languageSelect) {
        languageSelect.addEventListener('change', (e) => {
            setLanguage(e.target.value);
            if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
        });
    }
});
