// \Scripts\languageLoader.js
// TODO - C - This module retrieves one language, but loads them all to return one. Is that efficient?
const translationsFolder = './translations/';
async function getTranslations(langFileName, lang) {
    if (!lang) {
        console.log('Language not provided. Defaulting to English');
        lang = 'en';
    }
    const langFilePath = composeFilePath(langFileName);
    const translationsModule = await import(langFilePath);
    const translations = translationsModule.default;

    // Extract translations for the desired language or default to English
    const langTranslations = getLanguage(translations, lang);

    return langTranslations;
}

function getLanguage(translations, lang) {
    let langTranslations = {};
    langTranslations= Object.keys(translations).reduce((obj, key) => {
        // Attempt to get the translation for the specified language
        let translation = translations[key][lang];

        // If the translation for the specified language doesn't exist, fall back to English
        if (!translation) {
            translation = translations[key]['en'];
        }

        // If the translation for English doesn't exist either, fall back to the key name
        obj[key] = translation !== undefined ? translation : key; // Use translation if defined, otherwise fallback to key

        return obj;
    }, {});
    /**
     * Retrieves the translation for a given label. If the translation for the requested language does not exist,
     * it attempts to fallback to the English translation. If neither translation exists, it returns the label itself.
     * 
     * @param {string} label - The key for the translation label.
     * @returns {string} The translated string if available, otherwise the label itself.
     */
    langTranslations.t = function (label) {
        return this[label] !== undefined ? this[label] : label;
    };
return langTranslations;
}


function composeFilePath(langFileName) {
    let langFilePath = `${translationsFolder}${langFileName}`;
    if (!langFilePath.endsWith('.lang.js')) {
        langFilePath += '.lang.js';
    }
    return langFilePath;
}


export { getTranslations };

/** add functions to unit test*/
const testOnly = {
    getLanguage,
    composeFilePath
}
export { testOnly };