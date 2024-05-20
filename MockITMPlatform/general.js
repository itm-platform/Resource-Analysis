(async () => {
    window.companyId = 'itmrozas'; // Set the company ID here
    const token = 'fc55f846-d7f7-4abb-afc8-d25338a71ef6'
    async function fetchToken() {
        const response = await fetch(`/proxy/${window.companyId}/login/${token}`);
        const data = await response.json();
        return data.Token;
    }
    window.userLoginToken = await fetchToken();

    const diContainerModule = await import('./diContainer.js');
    window.diContainer = diContainerModule.default;

    // Mind the order of the imports. Some modules depend on others
    const errorHandlerModule = await import('./errorHandler.js');
    window.diContainer.register('logFrontEndError', errorHandlerModule.logFrontEndError);

    const languageLoaderModule = await import('./languageLoader.js');
    window.diContainer.register('getTranslations', languageLoaderModule.getTranslations);

    const filterConstructorModule = await import('../FilterConstructor/Components/Filter.js');
    window.diContainer.register('FilterConstructor', filterConstructorModule.Filter);

    window.diContainerReady = true;
    window.dispatchEvent(new CustomEvent('diContainerReady'));
})();

const itmGlobal = {};
itmGlobal.ensureDiContainerReady =
    /**
     * Used in clients to await itmGlobal.ensureDiContainerReady();
     */
    function () {
        return new Promise((resolve) => {
            if (window.diContainerReady) {
                resolve();
            } else {
                window.addEventListener('diContainerReady', resolve);
            }
        });
    };

function getJSVersion() {
    if (typeof window.JSVersion !== 'undefined') {
        return window.JSVersion;
    }
    const today = new Date();
    return today.toISOString().substring(0, 10); // Formats the date as YYYY-MM-DD
}