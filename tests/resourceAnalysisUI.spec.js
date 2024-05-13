import { describe, test, expect, beforeEach, beforeAll, vi } from 'vitest';
import { ResourceAnalysis } from '../resourceAnalysis.js';
// Simulate local storage
global.localStorage = {
    storage: {},
    setItem: function (key, value) {
        this.storage[key] = value;
    },
    getItem: function (key) {
        return this.storage[key];
    },
    removeItem: function (key) {
        delete this.storage[key];
    },
    clear: function () {
        this.storage = {};
    }
};

async function mockGeneralJS() {
    // Mock diContainer and its methods
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
    })()

    // Replace window.diContainer with the mock
    global.window.diContainer = diContainer;

    // Simulate the async dynamic imports and their effects
    const errorHandler = { logFrontEndError: vi.fn() };
    const languageLoader = { getTranslations: vi.fn() };

    diContainer.register('logFrontEndError', errorHandler.logFrontEndError);
    diContainer.register('getTranslations', languageLoader.getTranslations);

    // Simulate diContainerReady event
    global.window.diContainerReady = true;
    global.window.dispatchEvent(new CustomEvent('diContainerReady'));
    // Mock itmGlobal and its ensureDiContainerReady method
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

    // Mock JSVersion function if needed
    global.window.getJSVersion = function () {
        const today = new Date();
        return today.toISOString().substring(0, 10); // Formats the date as YYYY-MM-DD
    };
}


describe('ResourceAnalysis Initialization', () => {
    beforeAll(async () => {
        await mockGeneralJS();
    });

    beforeEach(async () => {
        // Set item in local storage as required
        localStorage.setItem('testingWithLocalFiles', 'true');

        // Simulate the necessary DOM structure
        document.body.innerHTML = `
      <div id="requestConstructorContainer"></div>
      <div id="rowSelectorContainer"></div>
      <div id="tableContainer"></div>
      <button id="loadAnalysisBtn">Load Analysis</button>
    `;
    });

    test('ResourceAnalysis should initialize without throwing', () => {
        expect(() => {
            const parentDivIds = {
                requestConstructorContainer: 'requestConstructorContainer',
                rowSelectorContainer: 'rowSelectorContainer',
                tableContainer: 'tableContainer'
            };
            const resourceAnalysis = new ResourceAnalysis(parentDivIds);
        }).not.toThrow();
    });
});
