// Lógica de i18n
let currentLang = 'es';
let translations = {};

// Cargar el idioma
function loadLanguage(lang) {
    try {
        translations = appTranslations[lang]; // Obtenido de translations.js
        currentLang = lang;
        localStorage.setItem('kapuli_lang', lang); // Guardar preferencia en localStorage
        applyTranslations();
        updateLanguageButtons(lang);
        document.dispatchEvent(new Event('languageChanged'));
    } catch (error) {
        console.error('Error loading language:', error);
    }
}

// Aplicar los textos al DOM
function applyTranslations() {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        const text = key.split('.').reduce((obj, i) => obj ? obj[i] : null, translations);
        if (text) {
            element.innerHTML = text;
        }
    });
}

// Actualizar el estado visual de los botones
function updateLanguageButtons(lang) {
    const btnEs = document.getElementById('btn-es');
    const btnEn = document.getElementById('btn-en');
    
    if (btnEs && btnEn) {
        if (lang === 'es') {
            btnEs.classList.add('active');
            btnEn.classList.remove('active');
        } else {
            btnEn.classList.add('active');
            btnEs.classList.remove('active');
        }
    }
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    // Event listeners para los botones de idioma
    const btnEs = document.getElementById('btn-es');
    const btnEn = document.getElementById('btn-en');
    
    if (btnEs) btnEs.addEventListener('click', () => loadLanguage('es'));
    if (btnEn) btnEn.addEventListener('click', () => loadLanguage('en'));

    // Recuperar idioma guardado o usar por defecto
    const savedLang = localStorage.getItem('kapuli_lang');
    if (savedLang && (savedLang === 'es' || savedLang === 'en')) {
        currentLang = savedLang;
    }

    // Cargar idioma
    loadLanguage(currentLang);
});
