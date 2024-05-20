// tests/mockGeneralJS.js
import { vi } from 'vitest';
async function mockGeneralJS() {
    const diContainer = (function () {
        const _services = {};

        function register(name, service) {
            _services[name] = service;
        }

        function get(name) {
            const service = _services[name];
            if (!service) {
                throw new Error(`Service not found: ${name}`);
            }
            return service;
        }

        function getServices() {
            return _services;
        }

        return { register, get, getServices };
    })();

    global.window.diContainer = diContainer;

    const errorHandler = { logFrontEndError: vi.fn() };
    const languageLoader = {
        getTranslations: vi.fn().mockResolvedValue({
            t: vi.fn((key) => `Translated: ${key}`)  // Mocks translation function t
        })
    };
    // Mock FilterConstructor
    const filterConstructorMock = vi.fn((initialFilter, dataServiceModel, parentDivId, tablesAllowed, language) => {
        const mockElement = document.createElement('div');

        return {
            element: mockElement
        };
    });

    global.fetch = vi.fn().mockImplementation((url, options) => {
        // We can use 'url' and 'options' to determine what to return
        return Promise.resolve({
            json: () => Promise.resolve({ /* mock response data */ })
        });
    });

    diContainer.register('logFrontEndError', errorHandler.logFrontEndError);
    diContainer.register('getTranslations', async () => await languageLoader.getTranslations());
    diContainer.register('FilterConstructor', filterConstructorMock);

    global.window.diContainerReady = true;
    global.window.dispatchEvent(new CustomEvent('diContainerReady'));

    global.window.itmGlobal = {
        ensureDiContainerReady: function () {
            return new Promise((resolve) => {
                if (window.diContainerReady) {
                    resolve();
                } else {
                    window.addEventListener('diContainerReady', resolve);
                }
            });
        }
    };

    global.window.getJSVersion = function () {
        const today = new Date();
        return today.toISOString().substring(0, 10); // Formats the date as YYYY-MM-DD
    };

    global.window.userLoginToken = 'mockToken';
}

export default mockGeneralJS;