// FilterConstructor/Components/globalState.js
// FilterConstructor/Components/globalState.js
const globalState = {
    lang: 'pt',
};

export function setLang(newLang) {
    globalState.lang = newLang;
    document.dispatchEvent(new CustomEvent('langChanged', { detail: newLang }));
}

export function getLang() {
    return globalState.lang;
}

